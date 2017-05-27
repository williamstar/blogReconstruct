<template>
  <div class='register-module'>
    <el-form :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="passwd">
        <el-input type="password" v-model="form.passwd" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="verifyPasswd" auto-complete="off">
        <el-input type="password" v-model="form.verifyPasswd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type='text/javascript'>
import { Message } from 'element-ui';

const OK = 'success';

export default {
  data() {
    const reUserName = /^\w+$/;
    /* eslint-disable*/
    const rePasswd = /[\'\\\"\ ]/;
    /* eslint-enable */
    let validateUserName = (rule, value, cb) => {
      if (value.length < 3 || value.length > 16) {
        cb(new Error('长度要求在4到16之间'));
      } else if (!reUserName.test(value)) {
        cb(new Error('只能是英文和数字'));
      } else {
        cb();
      }
    };
    let validatePasswd = (rule, value, cb) => {
      if (value.length < 3 || value.length > 16) {
        cb(new Error('长度要求在4到16之间'));
      } else if (rePasswd.test(value)) {
        cb(new Error('不能含有单引号,双引号,斜杠,空格字符'));
      } else {
        cb();
      }
    };
    let validateVerify = (rule, value, cb) => {
      if (value.length < 3 || value.length > 16) {
        cb(new Error('长度要求在4到16之间'));
      } else if (rePasswd.test(value)) {
        cb(new Error('不能含有单引号,双引号,斜杠,空格字符'));
      } else if (this.passwd !== this.verifyPasswd) {
        cb(new Error('两次密码不一致'));
      }
      cb();
    };
    return {
      form: {
        userName: '',
        passwd: '',
        verifyPasswd: '',
      },
      rules: {
        userName: { validator: validateUserName, trigger: 'blur' },
        passwd: { validator: validatePasswd, trigger: 'blur' },
        verifyPasswd: { validator: validateVerify, trigger: 'blur' },
      },
    };
  },
  methods: {
    submitForm() {
      this
        .$http
        .post('/william/register', this.form)
        .then((res) => {
          res = res.body;
          if (res.status === OK) {
            // 跳转到管理处
            this.$router.push('/admin');
          } else {
            Message.error('系统错误');
          }
        });
    },
    reset() {
      this.form = {
        userName: '',
        passwd: '',
        verifyPasswd: '',
      };
    },
  },
};
</script>
<style lang='scss'>
.register-module {
  width: 500px;
  margin: 0 auto;
  padding-top: 100px;
  label {
    color: #fff;
  }
}
</style>
