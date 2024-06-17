import request from '@/utils/request'

// 查询港口检查生物列表
export function listPort_check(query) {
  return request({
    url: '/info/port_check/list',
    method: 'get',
    params: query
  })
}

// 查询港口检查生物详细
export function getPort_check(id) {
  return request({
    url: '/info/port_check/' + id,
    method: 'get'
  })
}

// 新增港口检查生物
export function addPort_check(data) {
  return request({
    url: '/info/port_check',
    method: 'post',
    data: data
  })
}

// 修改港口检查生物
export function updatePort_check(data) {
  return request({
    url: '/info/port_check',
    method: 'put',
    data: data
  })
}

// 删除港口检查生物
export function delPort_check(id) {
  return request({
    url: '/info/port_check/' + id,
    method: 'delete'
  })
}
