<template>
  <div class='config-module'>
    <div class="cover-manager">
      <el-button v-if="!coverImg" class="cover-btn" @click="selectCover">
        <i class="el-icon-plus icon-plus"></i>
      </el-button>
      <img :src="`/api/image/${coverImg}`" @click="selectCover" width="150" height="150" alt="用户头像" class="upload-cover">
      <transparent-file-elm :selector="'upload-cover'" :need-hash="true" @had:cover="setCover" ref="uploadCover"></transparent-file-elm>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人资料" name="personalData">
        <div class="project-upload">
          上传项目
        </div>
        <div class="link-manager">
          链接上传
        </div>
        <div class="self-intro-edit">
          编辑个人简介
        </div>
      </el-tab-pane>
      <el-tab-pane label="账号安全" name="accountSecurity">
        <div class="passwd-modify">
          修改密码
        </div>
        <div class="ban-ip">
          屏蔽设置
        </div>
      </el-tab-pane>
      <el-tab-pane label="博客设置" name="blogConfig">
        <div class="category-manager">
          分类管理
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type='text/javascript'>
import transparentFileElm from '@/components/smallcomponents/TransparentFileElm';

const OK = 'success';

export default{
  data() {
    return {
      activeName: 'personalData',
      coverImg: '',
    };
  },
  created() {
    this
      .$http
      .get('/api/user-config')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.coverImg = res.data.coverImg;
        }
      });
  },
  methods: {
    handleClick() {
    },
    selectCover() {
      this.$refs.uploadCover.open();
    },
    setCover(rs, hash) {
      document.querySelector('.upload-cover').src = rs;
      this.coverImg = hash;
      let fd = new FormData();
      let file = this.$refs.uploadCover.$el.querySelector('input').files[0];
      fd.append('cover', file);
      fd.append('coverImg', hash);
      this
        .$http
        .post('/api/config/upload-cover', fd)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            // done something
            this.$message.success('上传用户头像成功');
          } else {
            this.$message.warning('服务器问题');
          }
        });
    },
  },
  components: {
    transparentFileElm,
  },
};
</script>
<style lang='scss'>
.config-module {
  position: relative;
  padding-top: 20px;
  margin: 0 auto;
  width: 1200px;
  color: #fff;
  .cover-manager {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    .upload-cover {
      object-fit: cover;
      cursor: pointer;
    }
    .cover-btn {
      padding: 20px;
      width: 100%;
      height: 100%;
    }
  }
  .el-tabs__item {
    color: #fff;
  }
}
</style>
