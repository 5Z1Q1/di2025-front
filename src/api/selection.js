import request from '../utils/request'

// 获取学生的选课记录
export function getStudentSelections(studentId) {
  return request({
    url: `/selections/student/${studentId}`,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

// 获取可用课程列表
export function getAvailableCourses() {
  return request({
    url: '/courses/available',
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

// 选课
export function selectCourse(studentId, courseId) {
  return request({
    url: '/selections/select',
    method: 'post',
    data: {
      studentId,
      courseId
    }
  })
}

// 退课
export function dropCourse(studentId, courseId) {
  return request({
    url: `/selections/${studentId}/${courseId}`,
    method: 'delete'
  })
}

// 更新成绩
export function updateScore(studentId, courseId, score) {
  return request({
    url: `/selections/${studentId}/${courseId}/score`,
    method: 'put',
    data: { score }
  })
}

// 获取学生的跨学院选课记录
export function getCrossCollegeSelections(studentId) {
  return request({
    url: `/selections/cross-college/${studentId}`,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

// 获取所有跨院系选课记录
export function getAllCrossCollegeSelections() {
  return request({
    url: '/selections/cross-college',
    method: 'get'
  })
}

// 按学院获取跨院系选课记录
export function getCrossCollegeSelectionsByCollege(college) {
  return request({
    url: `/selections/cross-college/college/${college}`,
    method: 'get'
  })
} 