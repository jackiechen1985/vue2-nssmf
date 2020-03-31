<template>
  <div class="login-bg">
    <div class="login-w">
      <img style="width:100%" src="/images/NOKIA_SBELL_LOGO_H_WHITE_MR.png" />
      <el-input
        v-model="userName"
        ref="userName"
        placeholder="用户名"
        @keyup.enter.native="login()"
      ></el-input>
      <el-input
        style="margin-top: 30px; margin-bottom: 30px;"
        v-model="value"
        placeholder="请输入密码"
        show-password
        @keyup.enter.native="login()"
      ></el-input>
      <el-button type="primary" style="width:100%;" @click="login()">{{loginText}}</el-button>
      <div class="login-err" v-if="isErr">{{errText}}</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import API from '@/data/api.js'

export default {
  data () {
    return {
      userName: '',
      value: '',
      loginText: '登录',
      isErr: false,
      errText: ''
    }
  },
  mounted () {
    this.$refs.userName.focus()
  },
  methods: {
    async login () {
      if (this.userName.length === 0) {
        this.errText = '用户名不能为空！'
        this.isErr = true
        return
      }
      if (this.value.length === 0) {
        this.errText = '密码不能为空！'
        this.isErr = true
        return
      }
      this.loginText = '正在登录...'
      try {
        const res = await API.login({
          userName: this.userName,
          value: this.value,
          grantType: 'password'
        })
        window.sessionStorage.setItem('userName', this.userName)
        window.sessionStorage.setItem('token', res.accessToken)
        window.sessionStorage.setItem('expires', res.expires)
        this.$router.push('/home')
      } catch (e) {
        this.loginText = '登录'
        this.errText = '用户名或密码错误！'
        this.isErr = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/mixin';

.login-bg {
  @include wh(100%, 100%);
  @include bi('/images/panel.hello.bk.jpg');
}

.login-w {
  box-shadow: #848484 0px 0px 10px;
  width: 400px;
  padding: 50px;
  /* margin-right: 100px; */
  position: absolute;
  right: 10%;
  top: 30%;
  border: 1px solid #cccccc6b;
}

.login-err {
  color: red;
  font-size: 13px;
  text-align: center;
  margin-top: 5px;
}
</style>
