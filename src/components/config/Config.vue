<template>
  <div class='config-module'>
    <div class="cover-manager">
      <el-button v-if="!coverImg" class="cover-btn" @click="selectCover">
        <i class="el-icon-plus icon-plus"></i>
      </el-button>
      <img :src="coverImg" @click="selectCover" width="150" height="150" alt="用户头像" class="upload-cover">
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
        <div class="config-item">
          <div class="config-label">
            分类管理
          </div>
          <div class="categories">
            <el-tag v-for="(category, index) in categories" color="#f0f" :closable="true" :key="category.id" @close="deleteCategory(index)">
              {{category.val}}
            </el-tag>
          </div>
        </div>
        <div class="config-item">
          <div class="config-label">快速渲染</div>
          <div class="display-way">
            <el-switch v-model="renderWay" @change="switchFastRender"></el-switch>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type='text/javascript'>
import { Message } from 'element-ui';
import transparentFileElm from '@/components/smallcomponents/TransparentFileElm';
import { mapState, mapActions } from 'vuex';
import { uploadCoverImgService, deleteCategoryService, modifyPasswdService, switchFastRenderService } from '@/api/index';

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
  computed: {
    ...mapState([
      'coverImg',
      'categories',
      'renderWay',
    ]),
  },
  methods: {
    ...mapActions(['switchFastRender']),
    _switchFastRender() {
      switchFastRenderService(+!this.renderWay)
        .then(() => {
          this.switchFastRender();
        });
    },
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
      uploadCoverImgService(fd)
        .then(() => {
          Message.success('上传用户头像成功');
        }).catch(() => {
          Message.warning('服务器问题');
        });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    },
    submitForm(form) {
      /* eslint-disable consistent-return */
      this.$refs[form].validate((valid) => {
        if (valid) {
          modifyPasswdService('/config/change-passwd', this.passwdForm)
            .then(() => {
              Message.success('修改密码成功');
            }).catch(err => {
              Message.error(`服务器问题${err}`);
            });
        } else {
          return false;
        }
      });
    },
    deleteCategory(index) {
      deleteCategoryService(`/category/${this.categories[index].id}/delete`)
        .then(() => {
          this.categories.splice(index, 1);
          Message.success('删除分类成功');
        }).catch(() => {
          Message.error('删除失败，该分类不存在');
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

  .modify-passwd {
    width: 500px;
    margin: 20px auto;
    label {
      color: #fff;
    }
  }

  .el-tabs__item {
    color: #fff;
  }

  .el-tag {
    margin-right: 10px;
  }
}
</style>
