import request from '@/utils/request'

// 获取所有学生
export function getAllStudents() {
  return request({
    url: '/students',
    method: 'get',
    transformResponse: [
      function (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed
        } catch (error) {
          console.error('解析响应数据失败:', error)
          return data
        }
      }
    ]
  })
}

// 根据ID获取学生
export function getStudentById(studentId) {
  return request({
    url: `/students/${studentId}`,
    method: 'get'
  })
}

// 根据专业获取学生
export function getStudentsByMajor(major) {
  return request({
    url: `/students/major/${major}`,
    method: 'get'
  })
}

// 创建学生
export function createStudent(data) {
  return request({
    url: '/students',
    method: 'post',
    data
  })
}

// 更新学生信息
export function updateStudent(studentId, data) {
  return request({
    url: `/students/${studentId}`,
    method: 'put',
    data
  })
}

// 删除学生
export function deleteStudent(studentId) {
  return request({
    url: `/students/${studentId}`,
    method: 'delete'
  })
}

// 获取学生总数
export function countStudents() {
  return request({
    url: '/students/count',
    method: 'get'
  })
} 