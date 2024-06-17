import request from '@/utils/request'

// 查询港口信息管理列表
export function listPort(query) {
  return request({
    url: '/info/port/list',
    method: 'get',
    params: query
  })
}

// 查询港口信息管理详细
export function getPort(id) {
  return request({
    url: '/info/port/' + id,
    method: 'get'
  })
}

// 新增港口信息管理
export function addPort(data) {
  return request({
    url: '/info/port',
    method: 'post',
    data: data
  })
}

// 修改港口信息管理
export function updatePort(data) {
  return request({
    url: '/info/port',
    method: 'put',
    data: data
  })
}

// 删除港口信息管理
export function delPort(id) {
  return request({
    url: '/info/port/' + id,
    method: 'delete'
  })
}

export function portNameList() {
  return request({
    url: '/info/port/nameList',
    method: 'get'
  })
}
