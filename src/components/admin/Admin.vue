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
    </div>
    <filter-blog @get-blog="getBlog"></filter-blog>
    <blog-iterator :blogs="blogs" :admin="true"></blog-iterator>
    <div v-if="total !== 0" class="pagination">
      <el-pagination layout="prev, pager, next" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';
import filterBlog from '@/components/smallcomponents/Filter';

const OK = 'success';

export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      blogs: [],
      limit: 10,
      filter: {
        isDraft: 0,
        sortedKey: 'createDate',
        sortedVal: 'desc',
        categoryId: -1,
        queryStr: '',
      },
    };
  },
  beforeMount() {
    this
      .$http
      .get('/checkuser')
      .then((res) => {
        res = res.body;
        if (res.status !== OK) {
          // 如果已经登陆就继续，否则跳转到登陆页面
          this.$router.push('/login');
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
        .get('/logout')
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
    getBlog(filter) {
      if (filter) {
        this.filter = filter;
      }
      let defaultUrl = '/blogs';
      defaultUrl = `/blogs?page=${this.currentPage}&isDraft=${this.filter.isDraft}&categoryId=${this.filter.categoryId}&sortedKey=${this.filter.sortedKey}&sortedVal=${this.filter.sortedVal}&queryStr=${this.filter.queryStr}`;
      this
        .$http
        .get(defaultUrl)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            this.blogs = res.data.blogs;
            this.total = res.data.total;
          }
        });
    },
  },
  components: {
    blogIterator,
    filterBlog,
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
