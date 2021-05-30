<template>
  <div class="app-container">
    <div class="main-content">
      <div class="qr-main">

        <div class="qrcode" v-if="!login">
          <img :src="qrcode"> 

          <div class="tips">还剩<span>{{ seconds }}刷新二维码</span></div>
          <el-button type="text" @click="refreshQrcode">刷新二维码</el-button>
          <el-button type="primary" plain @click="refreshLogin">确认登录后请点我刷新登录状态</el-button>
        </div>

        <div v-else class="tips">
          <span>Bot 已登录</span>
          <br><br>
          <span>您可以愉快地使用各种功能了！</span>
          <br><br>
          <img class="logo" src="../../assets/logo.svg">
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { loginStatus, fetchQrcode } from '@/api/wechat'

export default {
  name: 'LoginStatus',
  data () {
    return {
      qrcode: "",
      login: false,
      seconds: 25,
      timer: null,
    }
  },
  created() {
    this.fetchLoginStatus()
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    setTimer() {
      if (this.timer) return
      this.timer = setInterval(() => {
        if (this.seconds > 0) {
          this.seconds--;
        } else {
          this.refreshQrcode()
          this.seconds = 25
        }
      }, 1000)
    },
    refreshQrcode() {
      fetchQrcode().then(res => {
        this.qrcode = res.data.url
        this.setTimer()
      })
    },
    fetchLoginStatus() {
      loginStatus().then(res => {
        if (!res.data.status) {
          this.refreshQrcode()
        }
        this.login = res.data.status
      })
    },
    refreshLogin() {
      loginStatus().then(res => {
        this.login = res.data.status
        if (this.login && this.timer) {
          clearInterval(this.timer)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  width: 80%;
  margin: 0 auto;
  padding: 10px;
  text-align: center;
  
  .qr-main {
    padding: 42px 0 0 0;
    margin: 0 auto;
    border-radius: 4px;
    background-color: #fff;
    width: 380px;
    height: 540px;
    box-shadow: 0 2px 10px #999;    
    
    .qrcode {
      width: 270px;
      height: 270px;
      margin: 42px auto 12px;
      position: relative;
      
      img {
        width: 200px;
        height: 200px;
      }
    }
     
    img {
      border-style: none;
    }
    
    .tips {
      color: grey;
      font-size: 24px;
      font-weight: bolder;
    }
  }
  
  .logo {
    height: 200px;
    width: 200px;
    line-height: 200px; 
    border-radius: 4px;
    display: inline-block;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
}
</style>
