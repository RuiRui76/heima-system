<template>
  <div class="login-container">
  <div class="login-form-wrap">
    <div class="login-head">
      <div class="logo"></div>
    </div>
  <el-form class="login-form" ref="form" :model="user">
  <el-form-item>
    <el-input
     v-model="user.mobile"
     placeholder= "请输入手机号"></el-input>
  </el-form-item>
  <el-form-item>
    <el-input
     v-model="user.code"
     placeholder= "请输入验证码"></el-input>
  </el-form-item>
  <el-form-item>
    <el-checkbox v-model="checked">我已阅读并同意<a href="javascript:;">用户协议和隐私条</a></el-checkbox>
  </el-form-item>
  <el-form-item>
    <el-button
    class="login-btn"
    type="primary"
    :loading="loginLoading"
    @click="onLogin">登录</el-button>
  </el-form-item>
</el-form>
  </div>
</div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      checked: false,
      loginLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据
      const user = this.user
      // 表单验证
      // 通过验证，提交登录
      // 开启登录的 loading
      this.loginLoading = true
      request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data: user
      }).then(res => {
        console.log(res)

        // 登录成功
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
        this.loginLoading = false
      }).catch(err => {
        console.log('登录失败', err)
        // 登录失败
        this.$message.error('登录失败，手机号或验证码错误！')
        this.loginLoading = false
      })
      // 处理后端响应结果
    }
  }
}
</script>
<style scoped lang="less">
.login-container{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-form-wrap{
    background-color: #fff;
    padding: 30px 50px 10px;
    min-width: 300px;
  }
  .login-head{
    display:flex;
    justify-content: center;
    .logo{
      width: 200px;
      height: 57px;
      background: url('./logo_index.png') no-repeat;
      background-size: contain;
    }
  }
  .login-form{
    .login-btn{
      width: 100%;
    }
  }
}
</style>
