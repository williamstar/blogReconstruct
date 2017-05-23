<template>
  <div class='admin-module'>
    <div class="platform">
      <div class="button-groups">
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
    <blog-iterator :blogs="blogs" :admin="true"></blog-iterator>
    <div class="pagination">
      <span @click="jump(1)" class="changepage f-l-page">
        <i class="el-icon-d-arrow-left"></i>
      </span>
      <span @click="prePage" class="changepage" :class="{'forbid': currentPage === 1}">
        <i class="el-icon-arrow-left"></i>
      </span>
      <span v-for="i in pageSize" class="page-btn" :class="{'light': i === currentPage}" @click="jump(i)">
        <span class="page-text">
          {{i}}
        </span>
      </span>
      <span @click="nextPage" class="changepage" :class="{'forbid': currentPage === pageSize}">
        <i class="el-icon-arrow-right"></i>
      </span>
      <span @click="jump(pageSize)" class="changepage f-l-page">
        <i class="el-icon-d-arrow-right"></i>
      </span>
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
    getBlog() {
      let defaultUrl = '/api/admin';
      defaultUrl = `/api/admin?page=${this.currentPage}`;
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
    jump(page) {
      this.currentPage = page;
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px 0;
    color: #fff;
    font-size: 17px;
    .f-l-page {
      margin: 0 8px;
    }
    .page-btn {
      margin: 0 15px;
      display: inline-block;
      padding: 2px 2px;
      background: #fff;
      cursor: pointer;
      &.light {
        background: #20a0ff;
        .page-text {
          color: #fff;
        }
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
