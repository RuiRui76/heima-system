/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
// axios()
// axios.get()
// axios.post()

// 创建 axios 实例
const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/'
  baseURL: 'http://api-toutiao-web.itheima.net/'
})

// 请求拦截

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
