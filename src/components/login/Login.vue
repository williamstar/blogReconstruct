<template>
  <div class='login-module'>
    <el-form v-model="user" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="user.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.passwd" type="password" @keyup.native.enter="login"></el-input>
      </el-form-item>
      <el-button type="primary" size="large" class="login-button" @click="login">登陆</el-button>
    </el-form>
  </div>
</template>
<script type='text/javascript'>
import { loginService, checkUserService } from '@/api/index';
import { Message } from 'element-ui';

export default {
  data() {
    return {
      user: {
        userName: '',
        passwd: '',
      },
    };
  },
  created() {
    checkUserService('/checkuser')
      .then(() => {
        this.$router.push('/admin');
      });
  },
  methods: {
    login() {
      loginService(this.user)
        .then(() => {
          this.$router.push('/admin');
        }).catch(() => {
          Message.warning('密码错误');
        });
    },
  },
};
</script>
<style lang='scss'>
.login-module {
  position: relative;
  width: 500px;
  height: 300px;
  margin: 0 auto;
  padding-top: 100px;
  .el-form-item {
    margin-bottom: 50px;
    label {
      color: #fff;
    }
  }
  .login-button {
    position: absolute;
    left: 50%;
  }
}
</style>
