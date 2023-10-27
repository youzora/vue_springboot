import request from '@/utils/request'

export function getUserListPage(params) {
  return request({
    url: '/score/listpage',
    method: 'get',
    params: params
  })
}
export function getProcessSelectList(params) {
  return request({
    url: '/course/getProcessSelectList',
    method: 'get',
    params: params
  })
}

export function entry(params) {
  return request({
    url: '/score/entry',
    method: 'get',
    params: params
  })
}

export function editScore(params) {
  return request({
    url: '/score/editScore',
    method: 'get',
    params: params
  })
}

export function deleteScore(params) {
  return request({
    url: '/score/deleteScore',
    method: 'get',
    params: params
  })
}
export function batchRemoveScore(params) {
  return request({
    url: '/score/batchRemoveScore',
    method: 'get',
    params: params
  })
}


