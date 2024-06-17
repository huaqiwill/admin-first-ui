import request from '@/utils/request'

// 查询国家信息管理列表
export function listCountry(query) {
  return request({
    url: '/info/country/list',
    method: 'get',
    params: query
  })
}

// 查询国家信息管理详细
export function getCountry(id) {
  return request({
    url: '/info/country/' + id,
    method: 'get'
  })
}

// 新增国家信息管理
export function addCountry(data) {
  return request({
    url: '/info/country',
    method: 'post',
    data: data
  })
}

// 修改国家信息管理
export function updateCountry(data) {
  return request({
    url: '/info/country',
    method: 'put',
    data: data
  })
}

// 删除国家信息管理
export function delCountry(id) {
  return request({
    url: '/info/country/' + id,
    method: 'delete'
  })
}

export function countryNameList() {
  return request({
    url: '/info/country/nameList',
    method: 'get'
  })
}
