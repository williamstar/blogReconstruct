<template>
  <div class='header-module'>
    <div class="content">
      <el-row type="flex">
        <el-col :md="20" :sm="18" :xs="{span:24}">
          <div class="title" @click="toIndex">
            <h2 class="first-name">william personal</h2>
            <h2 class="last-name">blog</h2>
          </div>
        </el-col>
        <el-col :md="{span:4, pull: 1}" :sm="{span:4, offset:1}" :xs="{span:0}">
          <img :src="coverImg" class="avatar " alt="用户头像 ">
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type='text/javascript'>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'coverImg',
    ]),
  },
  methods: {
    toIndex() {
      const returnAdmin = ['edit', 'config', 'admin'];
      if (returnAdmin.some(returnItem => this.$route.fullPath.indexOf(returnItem) !== -1)) {
        this.$router.push('/admin');
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.header-module {
  width: 100%;
  background: #D8E2DD;

  .content {
    width: 1020px;
    margin: 0 auto;
    padding: 5px;
    color: #12A2BC;
    @media screen and (max-width: 1020px) {
      width: auto;
    }
    .el-row--flex {
      align-items: center;
    }
    .title {
      margin: 0 auto;
      display: flex;
      font-family: 'Chelsea Market';
      text-transform: uppercase;
      font-size: 24px;
      flex-direction: column;
      cursor: pointer;
      @media screen and (max-width: 768px) {
        font-size: 36px;
        .last-name {
          padding-right: 20px;
          text-align: right;
        }
      }
      @media screen and (max-width: 700px) {
        font-size: 36px;
      }
      @media screen and (max-width: 633px) {
        font-size: 32px;
      }
      .first-name {
        padding-left: 20px;
        white-space: nowrap;
        font-family: inherit;
      }
      .last-name {
        padding-left: 50%;
        font-family: inherit;
      }
    }
    .avatar {
      margin: 0 auto;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      object-fit: cover;
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
  }
}
</style>
