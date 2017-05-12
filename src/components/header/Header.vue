<template>
  <div class='header-module'>
    <div class="content">
      <el-row type="flex">
        <el-col :span="20">
          <div class="title">
            <h2 class="first-name">william personal</h2>
            <h2 class="last-name">blog</h2>
          </div>
        </el-col>
        <el-col :span="4">
          <img src="http://placehold.it/500x500" width="150" height="150" class="user-avatar" alt="用户头像">
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type='text/javascript'>
export default {
  components: {

  },
};
</script>
<style lang='scss' scoped>
.header-module {
  width: 100%;
  background: #D8E2DD;
  .content {
    width: 1000px;
    margin: 0 auto;
    padding: 10px;
    color: #12A2BC;
    .el-row--flex {
      align-items: center;
    }
    .title {
      display: flex;
      font-family: 'Chelsea Market';
      text-transform: uppercase;
      font-size: 36px;
      flex-direction: column;
      .first-name {
        font-family: inherit;
      }
      .last-name {
        padding-left: 50%;
        font-family: inherit;
      }
    }
    .avatar {
      object-fit: cover;
    }
  }
}
</style>
