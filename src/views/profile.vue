<template>
  <div>
    <div class="mwin">
      <div class="titlebar">
        <h2 class="title">
          <i class="el-icon-user-solid"></i>
          修改密码
        </h2>
      </div>
      <div class="mainbody">
        <el-input
          v-model="oldPassword"
          ref="oldPassword"
          placeholder="旧密码"
          show-password
          @keyup.enter.native="changePassword()"
        ></el-input>
        <el-input
          v-model="newPassword"
          placeholder="新密码"
          show-password
          @keyup.enter.native="changePassword()"
        ></el-input>
        <el-input
          v-model="confirmNewPassword"
          placeholder="确认新密码"
          show-password
          @keyup.enter.native="changePassword()"
        ></el-input>
        <el-button
          type="primary"
          style="width: 100%; margin-top: 30px;"
          @click="changePassword()"
        >{{changeText}}</el-button>
        <div class="change-err" v-if="isErr">{{errText}}</div>
      </div>
    </div>
    <el-alert
      class="alert"
      v-if="showSuccess"
      :title="successTitle"
      type="success"
      :description="successData"
      @close="closeSuccessAlert"
      show-icon>
    </el-alert>
    <el-alert
      class="alert"
      v-if="showError"
      :title="errorTitle"
      type="error"
      :description="errorData"
      @close="closeErrorAlert"
      show-icon>
    </el-alert>
  </div>
</template>

<script>
import API from '@/data/api.js'

export default {
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      changeText: '提交',
      isErr: false,
      errText: '',
      showSuccess: false,
      successTitle: '',
      successData: '',
      showError: false,
      errorTitle: '',
      errorData: ''
    }
  },
  methods: {
    changePassword () {
      if (this.oldPassword.length <= 0) {
        this.errText = '旧密码不能为空！'
        this.isErr = true
        return
      }
      if (this.newPassword.length <= 0) {
        this.errText = '新密码不能为空！'
        this.isErr = true
        return
      }
      if (this.newPassword !== this.confirmNewPassword) {
        this.errText = '两次密码输入不一致！'
        this.isErr = true
        return
      }
      this.changeText = '提交中...'
      API.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }).then(res => {
        this.openSucessAlert('提交', '密码修改成功！', function () {
        })
      }).catch(error => {
        console.log(error)
        this.openErrorAlert('提交', '密码修改失败！')
        this.changeText = '提交'
      })
    },
    openSucessAlert (title, data, fn) {
      this.successTitle = title
      this.successData = data
      this.showSuccess = true
      setTimeout((fn) => {
        this.closeSuccessAlert()
        this.$router.push('/login')
        fn()
      }, 1000)
    },
    openErrorAlert (title, data) {
      this.errorTitle = title
      this.errorData = data
      this.showError = true
      setTimeout(() => { this.closeErrorAlert() }, 1000)
    },
    closeSuccessAlert () {
      this.showSuccess = false
      this.successTitle = ''
      this.successData = ''
    },
    closeErrorAlert () {
      this.showError = false
      this.errorTitle = ''
      this.errorData = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/common';

.mainbody {
  margin: 50px auto;
  width: 30%;
  line-height: 50px;
}

.change-err {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
}

</style>
