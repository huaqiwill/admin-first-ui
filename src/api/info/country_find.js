import request from '@/utils/request'

// 查询国家发现生物列表
export function listCountry_find(query) {
  return request({
    url: '/info/country_find/list',
    method: 'get',
    params: query
  })
}

// 查询国家发现生物详细
export function getCountry_find(id) {
  return request({
    url: '/info/country_find/' + id,
    method: 'get'
  })
}

// 新增国家发现生物
export function addCountry_find(data) {
  return request({
    url: '/info/country_find',
    method: 'post',
    data: data
  })
}

// 修改国家发现生物
export function updateCountry_find(data) {
  return request({
    url: '/info/country_find',
    method: 'put',
    data: data
  })
}

// 删除国家发现生物
export function delCountry_find(id) {
  return request({
    url: '/info/country_find/' + id,
    method: 'delete'
  })
}
