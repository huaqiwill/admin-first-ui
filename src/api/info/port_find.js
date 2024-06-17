import request from '@/utils/request'

// 查询港口发现生物列表
export function listPort_find(query) {
  return request({
    url: '/info/port_find/list',
    method: 'get',
    params: query
  })
}

// 查询港口发现生物详细
export function getPort_find(id) {
  return request({
    url: '/info/port_find/' + id,
    method: 'get'
  })
}

// 新增港口发现生物
export function addPort_find(data) {
  return request({
    url: '/info/port_find',
    method: 'post',
    data: data
  })
}

// 修改港口发现生物
export function updatePort_find(data) {
  return request({
    url: '/info/port_find',
    method: 'put',
    data: data
  })
}

// 删除港口发现生物
export function delPort_find(id) {
  return request({
    url: '/info/port_find/' + id,
    method: 'delete'
  })
}
