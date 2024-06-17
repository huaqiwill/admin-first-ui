import request from '@/utils/request'

// 查询生物信息管理列表
export function listBiology(query) {
  return request({
    url: '/info/biology/list',
    method: 'get',
    params: query
  })
}

// 查询生物信息管理详细
export function getBiology(id) {
  return request({
    url: '/info/biology/' + id,
    method: 'get'
  })
}

// 新增生物信息管理
export function addBiology(data) {
  return request({
    url: '/info/biology',
    method: 'post',
    data: data
  })
}

// 修改生物信息管理
export function updateBiology(data) {
  return request({
    url: '/info/biology',
    method: 'put',
    data: data
  })
}

// 删除生物信息管理
export function delBiology(id) {
  return request({
    url: '/info/biology/' + id,
    method: 'delete'
  })
}

export function biologyNameList() {
  return request({
    url: '/info/biology/nameList',
    method: 'get'
  })
}
