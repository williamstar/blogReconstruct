<template>
  <div class='config-module'>
    <div class="cover-manager">
      <el-button v-if="!coverImg" class="cover-btn" @click="selectCover">
        <i class="el-icon-plus icon-plus"></i>
      </el-button>
      <img :src="`/image/${coverImg}`" @click="selectCover" width="150" height="150" alt="用户头像" class="upload-cover">
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
        <el-row>
          <el-col :span="2">
            <div class="nav-vertical-item" :class="{'active': subActiveName === 'modifyPasswd'}" @click="setSubItem()">
              修改密码
            </div>
            <div class="nav-vertical-item">
              屏蔽设置
            </div>
          </el-col>
          <el-col :span="22">
            <div class="modify-passwd">
              <el-form label-width="80px" :model="passwdForm" :rules="passwdRules" ref="passwdForm">
                <el-form-item label="新密码" prop="passwd">
                  <el-input v-model="passwdForm.passwd" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="verifyPasswd">
                  <el-input v-model="passwdForm.verifyPasswd" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('passwdForm')">确认</el-button>
                  <el-button type="warning" @click="resetForm('passwdForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="博客设置" name="blogConfig">
        <el-col :span="2">
          <div class="nav-vertical-item">
            分类管理
          </div>
        </el-col>
        <el-col :span="21" :offset="1">
          <div class="categories">
            <el-tag v-for="(category, index) in categories" color="#f0f" :closable="true" :key="category.id" @close="deleteCategory(index)">
              {{category.val}}
            </el-tag>
          </div>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type='text/javascript'>
import transparentFileElm from '@/components/smallcomponents/TransparentFileElm';

const OK = 'success';

export default {
  data() {
    const checkPasswd = (rule, val, cb) => {
      if (val === '') {
        cb(new Error('请输入密码'));
      } else {
        cb();
      }
    };
    const checkEqual = (rule, val, cb) => {
      if (val === '') {
        cb(new Error('请输入密码'));
      } else if (val !== this.passwdForm.passwd) {
        cb(new Error('两次输入密码不一致'));
      } else {
        cb();
      }
    };
    return {
      activeName: 'personalData',
      subActiveName: '',
      coverImg: '',
      categories: [],
      passwdForm: {
        passwd: '',
        verifyPasswd: '',
      },
      passwdRules: {
        passwd: [
          { validator: checkPasswd, trigger: 'blur' },
        ],
        verifyPasswd: [
          { validator: checkEqual, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this
      .$http
      .get('/config/user-config')
      .then((res) => {
        res = res.body;
        if (res.status === OK) {
          this.coverImg = res.data.coverImg;
          this.categories = res.data.categories;
        }
      });
  },
  methods: {
    handleClick() {
      if (this.activeName === 'personalData') {
        this.subActiveName = 'uploadProject';
      } else if (this.activeName === 'accountSecurity') {
        this.subActiveName = 'modifyPasswd';
      } else {
        this.subActiveName = 'categoryManager';
      }
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
        .post('/config/upload-cover', fd)
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
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    submitForm(form) {
      /* eslint-disable consistent-return */
      this.$refs[form].validate((valid) => {
        if (valid) {
          this
            .$http
            .post('/config/change-passwd', this.passwdForm)
            .then((res) => {
              res = res.body;
              if (res.status === OK) {
                this.$message.success('修改密码成功');
              } else {
                this.$message.error('服务器问题');
              }
            });
        } else {
          return false;
        }
      });
    },
    deleteCategory(index) {
      this
        .$http
        .delete(`/category/${this.categories[index].id}/delete`)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            this.categories.splice(index, 1);
            this.$message.success('删除分类成功');
          } else {
            this.$message.error('删除失败，该分类不存在');
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
@import '../../common/scss/config';

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
  .modify-passwd {
    width: 500px;
    margin: 20px auto;
    label {
      color: #fff;
    }
  }
  .categories {
    padding-top: 10px;
    .el-tag {
      margin-right: 10px;
    }
  }
}
</style>