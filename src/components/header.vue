<template>
  <header>
    <el-menu
      :default-active="$route.path"
      class="el-menu-demo nav-menu"
      mode="horizontal"
      @select="handleSelect"
      background-color="#007bff"
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-menu-item index="0" class="nav-img-item">
        <span>
          <img src="/images/NOKIA_SBELL_LOGO_H_WHITE_HR.png" alt />
        </span>
      </el-menu-item>
      <el-menu-item index="/nssi" class="nav-item" @click="gotoAddress({path: '/nssi'})">
        <span>
          <i class="el-icon-document-copy nav-icon"></i>
          NS实例管理
        </span>
      </el-menu-item>
      <el-menu-item
        index="/nsst_design"
        class="nav-item"
        @click="gotoAddress({path: '/nsst_design'})"
      >
        <span>
          <i class="el-icon-edit-outline nav-icon"></i>
          NSST模板设计
        </span>
      </el-menu-item>
      <el-menu-item
        index="/nsst_runtime"
        class="nav-item"
        @click="gotoAddress({path: '/nsst_runtime'})"
      >
        <span>
          <i class="el-icon-document-checked nav-icon"></i>
          NSST模板管理
        </span>
      </el-menu-item>
      <el-menu-item index="/script" class="nav-item" @click="gotoAddress({path: '/script'})">
        <span>
          <i class="el-icon-c-scale-to-original nav-icon"></i>
          脚本包管理
        </span>
      </el-menu-item>
      <el-menu-item index="/fm" class="nav-item" @click="gotoAddress({path: '/fm'})">
        <span>
          <i class="el-icon-s-opportunity nav-icon"></i>
          告警管理
        </span>
      </el-menu-item>
      <el-menu-item index="/pm" class="nav-item" @click="gotoAddress({path: '/pm'})">
        <span>
          <i class="el-icon-data-line nav-icon"></i>
          性能管理
        </span>
      </el-menu-item>
      <div class="toolbar">
        <div @click="gotoAddress({path: '/profile'})">
          <font-awesome-icon :icon="['fas','user-circle']" />
          <span>{{userName}}</span>
        </div>
        <div @click="doLogout()">
          <font-awesome-icon :icon="['fas','power-off']" />
          <span>退出</span>
        </div>
      </div>
    </el-menu>
  </header>
</template>

<script>
// @ is an alias to /src
import API from '@/data/api.js'

export default {
  data () {
    return {
      userName: ''
    }
  },
  mounted () {
    this.userName = window.sessionStorage.getItem('userName')
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    gotoAddress (obj) {
      if (this.$route.path.indexOf(obj.path) === -1) {
        this.$router.push(obj)
      }
    },
    doLogout () {
      API.logout().then(res => {
        window.sessionStorage.removeItem('userName')
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('expires')
      })
      this.gotoAddress('/login')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.nav-menu {
  width: 100%;
  height: 2.6rem;
}

.nav-img-item {
  width: 15%;
  height: 2.5rem !important;
  line-height: 2.5rem !important;
  cursor: not-allowed;
  pointer-events: none;
  img {
    height: 140%;
    margin-top: -2%;
    width: 100%;
  }
}

.nav-item {
  height: 2.5rem !important;
  line-height: 2.5rem !important;
  width: 9%;
  font-size: 12px !important;
  text-align: center;
  padding: 0 !important;
}

.nav-icon {
  color: #fff !important;
}

.toolbar {
  float: right;
  height: 100%;
  margin-right: 10px;
  overflow: hidden;
  font-size: 14px !important;
  div {
    float: left;
    color: #fff;
    cursor: pointer;
    height: 100%;
    line-height: 100%;
    padding: 15px;
    margin: 0 5px;
    span {
      margin-left: 5px;
    }
  }
  div:hover {
      background-color: #0062CC;
  }
}
</style>
