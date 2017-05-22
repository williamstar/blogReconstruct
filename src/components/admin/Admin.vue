<template>
  <div class='admin-module'>
    <div class="platform">
      <div class="button-groups">
        <router-link to="/edit">
          <el-button icon="plus" type="primary">添加新博客</el-button>
        </router-link>
        <router-link to="/logout">
          <el-button type="danger" @click.prevent="logout">
            <i class="fa fa-power-off fa-lg"></i>
            注销
          </el-button>
        </router-link>
      </div>
    </div>
    <blog-iterator :blogs="blogs" :admin="true"></blog-iterator>
    <div class="pagination">
      <span class="total-num">总条数 {{total}}</span>
      <span @click="prePage" class="changepage" :class="{'forbid': currentPage === 1}">上一页</span>
      <span v-for="i in pageSize" class="page-btn" :class="{'light': i === currentPage}">
        <span class="page-text">
          {{i}}
        </span>
      </span>
      <span @click="nextPage" class="changepage" :class="{'forbid': currentPage === pageSize}">下一页</span>
    </div>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';

const OK = 'success';

export default {
  data() {
    return {
      currentPage: 1,
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
      .get('/api/count-blog')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.total = res.data;
        }
      });
  },
  activated() {
    document.title = '后台管理';
    let page = this.$route.query.page;
    /* eslint-disable */
    page = page ? page : 0;
    /* eslint-enable */
    let defaultUrl = '/api/admin';
    defaultUrl = `/api/admin?page=${page}`;
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
    prePage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageSize) {
        this.currentPage += 1;
      }
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
  .pagination {
    height: 20px;
    color: #fff;
    font-size: 17px;
    .page-btn {
      margin: 0 6px;
      display: inline-block;
      background: #fff;
      &.light {
        background: #20a0ff;
        .page-text {
          color: #fff;
        }
      }
      .page-text {
        padding: 7px 5px;
        color: #000;
      }
    }
    .changepage {
      cursor: pointer;
      &.forbid {
        cursor: not-allowed;
      }
    }
  }
}
</style>
