/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
// 非组件模块可以这样加载使用 element 的 message 提示组件
import { Message } from 'element-ui'
// axios()
// axios.get()
// axios.post()

// 创建 axios 实例
const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/',
  baseURL: 'http://api-toutiao-web.itheima.net/',
  // 用于定义后端返回的原始数据的处理
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // 对后端传入数据进行异常捕获，如果传入的不是JSON格式字符串，返回原数据
    try {
      return JSONbig.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 请求拦截
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
// 响应拦截
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里

  // response 是响应处理
  // 注意：一定要把响应结果 return，否则真正发请求的位置拿不到数据
  return response
}, function (error) {
  const { status } = error.response
  // 任何超出 2xx 的响应码都会进入这里
  if (status === 401) {
    // 跳转到登录页面
    // 清除本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token 未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }

  return Promise.reject(error)
})

// 导出请求方法
export default request

// 谁调用谁就加载该模块
// import request from 'request.js'
// request.xxx// 请求类型
// request({
//     method: ,
//     url: ''
// })
