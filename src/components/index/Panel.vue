<template>
  <div class='admin-module'>
    <div v-if="isAdmin" class="platform">
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
    <div class="content-hook">
      <filter-blog @get-blog="getBlogs" :is-admin="isAdmin"></filter-blog>
      <blog-iterator :blogs="blogs" :admin="isAdmin"></blog-iterator>
      <div v-if="total !== 0" class="pagination">
        <el-pagination layout="prev, pager, next" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';
import filterBlog from '@/components/smallcomponents/Filter';
import { checkUserService, getBlogsService, logoutService } from '@/api/index';
import { Loading } from 'element-ui';

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
    checkUserService().catch(() => {
      this.$router.push('/login');
    });
  },
  activated() {
    document.title = '后台管理';
    console.log('activated');
    this.getBlogs();
  },
  computed: {
    pageSize() {
      return Math.ceil(this.total / this.limit);
    },
    isAdmin() {
      return this.$route.fullPath.indexOf('admin') !== -1;
    },
  },
  methods: {
    logout() {
      logoutService().then(() => {
        this.$router.push('/login');
      });
    },
    handleCurrentChange() {
      this.getBlogs();
    },
    handlerSearch() {

    },
    getBlogs(filter) {
      if (filter) {
        this.filter = filter;
      }
      let defaultUrl = '/blogs';
      // 拼接查询得字符串
      defaultUrl = `/blogs?page=${this.currentPage}&isDraft=${this.filter.isDraft}&categoryId=${this.filter.categoryId}&sortedKey=${this.filter.sortedKey}&sortedVal=${this.filter.sortedVal}&queryStr=${this.filter.queryStr}`;
      // 加载得过度动画
      let loading = Loading.service({ target: document.querySelector('.content-hook') });
      getBlogsService(defaultUrl)
        .then(({ blogs, total }) => {
          this.blogs = blogs;
          this.total = total;
        })
        .catch((err) => {
          console.log(err);
        }).then(() => {
          loading.close();
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

  .content-hook {
    min-height: 600px;
    .pagination {
      margin-top: 25px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
