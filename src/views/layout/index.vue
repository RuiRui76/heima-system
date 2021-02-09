<template>
<el-container class="layout-container">
  <el-aside
  class="aside" width="auto">
    <app-aside
    class="aside-menu"
    :is-collapse="isCollapse"
    />
  </el-aside>
  <el-container>
    <el-header class="header">
      <div>
        <i
        :class="{
          'el-icon-s-unfold':isCollapse,
          'el-icon-s-fold':!isCollapse
        }"
        @click="isCollapse = !isCollapse"
        ></i>
        <span>黑马头条后台管理</span>
      </div>
      <el-dropdown>
        <div class="avatar-wrap">
          <img :src="user.photo" alt="user-avatar" class="avatar">
          <span>{{ user.name }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toSettings">个人设置</el-dropdown-item>
        <el-dropdown-item @click.native="onLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main class="main">
        <!-- 子路由出口 -->
      <router-view/>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '@/api/user.js'
import globalBus from '@/utils/global-bus.js' // 用于同时更新顶部和个人设置的头像与名称

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始化组件，请求获取用户资料
    this.loadUserProfile()
    // 监听事件的发布
    globalBus.$on('update-uesr', (data) => {
      this.user.name = data.name // 资料修改后名字更新
      this.user.photo = data.photo // 头像修改后，头像更新
    })
  },
  mounted () {},
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确定退出登录?', '退出提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user')
        this.$router.push('./login')
      })
    },
    toSettings () {
      this.$router.push({
        name: 'settings'
      })
    }
  }
}
</script>
<style scoped lang="less">
.layout-container{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.aside {
  background-color: #d3dce6;
  .aside-menu{
    height: 100%
  }
}
.header{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #cccccc;
  .avatar-wrap{
    display: flex;
    align-items: center;
    .avatar{
      height: 35px;
      width: 35px;
      margin-right: 10px;
    }
  }
}
.main{
  background-color: #e9eef3;
}
</style>
