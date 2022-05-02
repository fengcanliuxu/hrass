import request from '@/utils/request'

// 获取组织架构
export function getDepartments() {
 return request({
    url: '/company/department'
  })
}
// 根据id删除架构部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
// 添加部门
export function addDepartments(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

// 获取某一个部门详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 保存保存编辑的数据
export function updataDepartments (data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}
