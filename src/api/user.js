import request from '@/utils/request.js'

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data // data: data
  })
}
// 获取用户信息
// 修改用户信息
