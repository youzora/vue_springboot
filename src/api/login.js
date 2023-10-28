import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
// 动态路由由此进入
export function getInfo(id) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { id }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
