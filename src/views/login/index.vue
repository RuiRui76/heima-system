<template>
  <div class="login-container">
  <div class="login-form-wrap">
    <div class="login-head">
      <div class="logo"></div>
    </div>
  <el-form
  class="login-form"
  ref="login-form"
  :model="user"
  :rules="formRules">
  <el-form-item prop="mobile">
    <el-input
     v-model="user.mobile"
     placeholder= "请输入手机号"></el-input>
  </el-form-item>
  <el-form-item prop="code">
    <el-input
     v-model="user.code"
     placeholder= "请输入验证码"></el-input>
  </el-form-item>
  <el-form-item prop="agree">
    <el-checkbox v-model="user.agree">我已阅读并同意<a href="javascript:;">用户协议和隐私条</a></el-checkbox>
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
import { login } from '@/api/user.js'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: true // false
        // 为了测试，暂时将账户密码写死
      },
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { pattern: /^1[3|4|5|7|8|9]\d{9}$/, message: '请输入正确的手机号' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的6位验证码', trigger: 'blur' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请阅读并同意协议'))
              }
            },
            tirgger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        // 通过验证，提交登录
        this.login()
      })

      // 开启登录的 loading
      // 处理后端响应结果
    },
    login () {
      this.loginLoading = true
      login(this.user).then(res => {
        // 登录成功
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
        this.loginLoading = false

        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 登录成功后跳转到首页
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        // 登录失败
        this.$message.error('登录失败，手机号或验证码错误！')
        this.loginLoading = false
      })
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
