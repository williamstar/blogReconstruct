<template>
  <div class='index-module'>
    <div class="nav-wrapper">
      <nav class="navigation">
        <router-link to="/" active-class="active"  exact>首页</router-link>
        <router-link to="/personal" active-class="active">个人介绍</router-link>
        <router-link to="/project" active-class="active">项目</router-link>
      </nav>
    </div>
    <keep-alive>
      <router-view :blogs="blogs"></router-view>
    </keep-alive>
  </div>
</template>
<script type='text/javascript'>
import blogIterator from '@/components/smallcomponents/BlogIterator';

export default {
  data() {
    return {
      blogs: [],
    };
  },
  activated() {
    document.title = 'william';
    // this.$children[this.$children.length - 1].getBlogs();
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
      .active {
        color: #0c5c95;
      }
      a {
        font-size: 24px;
        font-weight: 300;
        color: #fff;
      }
    }
  }
}
</style>
