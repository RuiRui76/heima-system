import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Fans from '@/views/fans'
import Settings from '@/views/settings'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // 作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

// 导航守卫 - 判断用户是否登录
router.beforeEach((to, from, next) => {
  // 顶部导航进度条特效开启
  NProgress.start()
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path === '/login') {
    next()
  } else {
    if (user) {
      next()
    } else {
      next('./login')
    }
  }
})

router.afterEach((to, from) => {
  // 结束导航进度条特效
  NProgress.done()
})
export default router
