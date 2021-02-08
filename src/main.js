/**
 * 项目启动入口
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局样式
import './styles/index.less'
// 加载 element 组件库
import ElementUI from 'element-ui'
// 加载 element 组件库样式
import 'element-ui/lib/theme-chalk/index.css'
import 'nprogress/nprogress.css'
// 加载 json-bigint 第三方包
import JSONbig from 'json-bigint'

// 全局注册 element 组件库
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
