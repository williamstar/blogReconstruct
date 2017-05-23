<template>
  <div class='index-module'>
    <div class="nav-wrapper">
      <nav class="navigation">
        <router-link to="/">首页</router-link>
        <router-link to="/personal">个人介绍</router-link>
        <router-link to="/project">项目</router-link>
      </nav>
    </div>
    <router-view :blogs="blogs"></router-view>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';

const OK = 'success';

export default{
  data() {
    return {
      blogs: [],
    };
  },
  activated() {
    document.title = 'william';
  },
  created() {
    this
      .$http
      .get('/api/')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.blogs = res.data;
        }
      });
  },
  components: {
    blogIterator,
  },
};
</script>
<style lang='scss' scoped>
.index-module {
  .nav-wrapper {
    width: 600px;
    margin: 0 auto;
    padding: 30px 0 10px;
    .navigation {
      display: flex;
      justify-content: space-around;
      a {
        font-size: 18px;
        font-weight: 500;
        color: #fff;
      }
    }
  }
}
</style>
