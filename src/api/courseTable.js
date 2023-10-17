import request from '@/utils/request'

export function getCourseListPage(params) {
  return request({
    url: '/course/listpage',
    method: 'get',
    params: params
  })
}
export function removeCourse(params) {
  return request({
    url: '/course/remove',
    method: 'get',
    params: params
  })
}
export function batchRemoveCourse(params) {
  return request({
    url: '/course/batchremove',
    method: 'get',
    params: params
  })
}
export function editCourse(params) {
  return request({
    url: '/course/edit',
    method: 'get',
    params: params
  })
}
export function addCourse(params) {
  return request({
    url: '/course/add',
    method: 'get',
    params: params
  })
}
