import request from '@/utils/request'

export function getCount() {
  return request({
    url: '/user/count',
    method: 'get'
  })
}