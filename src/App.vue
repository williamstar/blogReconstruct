<template>
  <div id="app">
    <my-header></my-header>
    <div class="main">
      <div class="content">
        <div class="content-inner">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
      <div class="footer-wrapper">
        <my-footer></my-footer>
      </div>
    </div>
    <to-top :model="'dual'"></to-top>
  </div>
</template>

<script>
import myHeader from '@/components/header/Header';
import myFooter from '@/components/footer/Footer';
import ToTop from '@/components/smallcomponents/ToTop';
import { mapActions } from 'vuex';

export default {
  name: 'app',
  components: {
    myHeader,
    myFooter,
    ToTop,
  },
  created() {
    this.preloadData();
  },
  methods: {
    ...mapActions([
      'preloadData',
    ]),
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: 'Chelsea Market';
  font-style: normal;
  font-weight: 400;
  src: local('Chelsea Market'), local('ChelseaMarket-Regular'), url('common/fonts/Chelsea Market.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}

#app {
  width: 100%;
  height: 100%;
  .main {
    height: calc(100% - 114px);
    .content {
      min-height: 100%;
      margin-bottom: -84px;
      background: #74cdcc;
      .content-inner {
        width: 1400px;
        margin: 0 auto;
      }
      &:after {
        content: "";
        display: block;
      }
      &:after,
      &+footer-wrapper {
        height: 100px;
      }
    }
  }
}
</style>
