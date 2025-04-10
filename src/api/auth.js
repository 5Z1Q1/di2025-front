import request from '../utils/request'

// 登录
export function login(username, password) {
  return request({
    url: '/accounts/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

// 修改角色
export function changeRole(username, role) {
  return request({
    url: '/accounts/changeRole',
    method: 'post',
    params: {
      username,
      role
    }
  })
} 