/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
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

// 导出请求方法
export default request

// 谁调用谁就加载该模块
// import request from 'request.js'
// request.xxx// 请求类型
// request({
//     method: ,
//     url: ''
// })
