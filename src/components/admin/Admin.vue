<template>
  <div class='admin-module'>
    <div class="platform">
      <div class="nav-bar">
        <router-link to="/edit">
          <el-button icon="plus" type="primary">添加新博客</el-button>
        </router-link>
        <router-link to="/config">
          <el-button type="success">
            <i class="fa fa-power-off fa-lg"></i>
            设置
          </el-button>
        </router-link>
        <router-link to="/logout">
          <el-button type="danger" @click.prevent="logout">
            <i class="fa fa-power-off fa-lg"></i>
            注销
          </el-button>
        </router-link>
      </div>
      <el-form :inline="true" label-width="50px" class="filter">
        <el-form-item label="博客状态">
          <el-select v-model="isDraft" @change="getBlog">
            <el-option v-for="(status, index) in blogStatuss" :value="index" :label="status" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="categoryIndex" @change="getBlog">
            <el-option v-for="category in categories" :value="category.id" :label="category.val" :key="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="sortedIndex" @change="getBlog">
            <el-option v-for="(status, index) in sortedStatuss" :value="index" :label="status.text" :key="status.val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryStr" placeholder="全局搜索" icon="search" :on-icon-click="handlerSearch"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <blog-iterator :blogs="blogs" :admin="true"></blog-iterator>
    <div class="pagination">
      <el-pagination layout="prev, pager, next" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';

const OK = 'success';

export default {
  data() {
    return {
      blogStatuss: ['完成', '草稿'],
      sortedStatuss: [
        {
          val: 'desc',
          key: 'createDate',
          text: '最近',
        },
        {
          val: 'asc',
          key: 'createDate',
          text: '最久',
        },
        {
          val: 'desc',
          key: 'exploredTime',
          text: '最多浏览量',
        },
        {
          val: 'desc',
          key: 'commentNum',
          text: '最多评论量',
        },
      ],
      categories: [
        {
          id: -1,
          val: '全部',
        },
      ],
      categoryIndex: -1,
      sortedIndex: 0,
      isDraft: 0,
      currentPage: 1,
      queryStr: '',
      blogs: [],
      total: 0,
      limit: 10,
    };
  },
  beforeMount() {
    this
      .$http
      .get('/api/checkuser')
      .then((res) => {
        res = res.body;
        if (res.status !== OK) {
          // 如果已经登陆就继续，否则跳转到登陆页面
          this.$router.push('/login');
        }
      });
  },
  created() {
    this
      .$http
      .get('/api/preload-data')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.total = res.data.total;
          this.categories = this.categories.concat(res.data.categories);
        }
      });
  },
  activated() {
    document.title = '后台管理';
    this.getBlog();
  },
  computed: {
    pageSize() {
      return Math.ceil(this.total / this.limit);
    },
  },
  methods: {
    logout() {
      this
        .$http
        .get('/api/logout')
        .then((res) => {
          res = res.body;
          if (res.status === 'success') {
            this.$router.push('/login');
          }
        });
    },
    handleCurrentChange() {
      this.getBlog();
    },
    handlerSearch() {

    },
    getBlog() {
      let defaultUrl = '/api/admin';
      defaultUrl = `/api/admin?page=${this.currentPage}&isDraft=${this.isDraft}&categoryId=${this.categoryIndex}&sortedKey=${this.sortedStatuss[this.sortedIndex].key}&sortedVal=${this.sortedStatuss[this.sortedIndex].val}&queryStr=${this.queryStr}`;
      this
        .$http
        .get(defaultUrl)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            this.blogs = res.data;
          }
        });
    },
  },
  components: {
    blogIterator,
  },
};
</script>
<style lang='scss'>
.admin-module {
  padding: 10px;
  label {
    color: #fff;
  }
  .platform {
    padding: 10px 0 10px 20px;
    .el-button {
      margin-right: 20px;
    }
    .filter {
      margin-top: 20px;
    }
  }
  .pagination {
    margin-top: 25px;
    display: flex;
    justify-content: center;
  }
}
</style>
