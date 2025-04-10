import request from '../utils/request'

// 获取所有课程
export function getAllCourses() {
  return request({
    url: '/courses',
    method: 'get'
  })
}

// 获取课程详情
export function getCourseById(courseId) {
  return request({
    url: `/courses/${courseId}`,
    method: 'get'
  })
}

// 创建课程
export function createCourse(data) {
  return request({
    url: '/courses',
    method: 'post',
    data
  })
}

// 更新课程
export function updateCourse(courseId, data) {
  return request({
    url: `/courses/${courseId}`,
    method: 'put',
    data
  })
}

// 获取共享课程
export function getSharedCourses() {
  return request({
    url: '/courses/getShared',
    method: 'get'
  })
}

// 共享课程
export function shareCourse(courseId) {
  return request({
    url: '/courses/share',
    method: 'post',
    params: { courseId }
  })
}

// 取消共享课程
export function unshareCourse(courseId) {
  return request({
    url: '/courses/unshare',
    method: 'post',
    params: { courseId }
  })
}

// 获取课程数量
export function countCourses() {
  return request({
    url: '/courses/count',
    method: 'get'
  })
} 