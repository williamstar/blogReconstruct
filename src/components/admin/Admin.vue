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
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';

const OK = 'success';

export default {
  data() {
    return {
      blogs: [],
    };
  },
  created() {
    document.title = '后台管理';
    this
      .$http
      .get('/api/admin')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.blogs = res.data;
        }
      });
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
  },
  components: {
    blogIterator,
  },
};
</script>
<style lang='scss' scoped>
.admin-module {
  padding: 10px;
}
</style>
