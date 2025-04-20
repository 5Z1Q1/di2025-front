import request from '../utils/request'

// 获取所有课程
export function getAllCourses() {
  console.log('正在请求所有课程列表')
  return request({
    url: '/courses',
    method: 'get',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 10000,
    transformResponse: [function (data) {
      console.log('收到课程列表原始响应数据:', data)
      try {
        const parsedData = JSON.parse(data)
        console.log('解析后的课程列表数据:', parsedData)
        return parsedData
      } catch (error) {
        console.error('解析课程列表数据失败:', error)
        throw new Error('响应数据格式错误: ' + error.message)
      }
    }]
  })
}

// 获取单个课程
export function getCourse(courseId) {
  return request({
    url: `/courses/${courseId}`,
    method: 'get',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    transformResponse: [function (data) {
      console.log('收到单个课程原始响应数据:', data)
      try {
        const parsedData = JSON.parse(data)
        console.log('解析后的单个课程数据:', parsedData)
        return parsedData
      } catch (error) {
        console.error('解析单个课程数据失败:', error)
        throw new Error('响应数据格式错误: ' + error.message)
      }
    }]
  })
}

// 创建课程
export function createCourse(course) {
  console.log('正在创建课程:', course)
  return request({
    url: '/courses',
    method: 'post',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: course,
    transformResponse: [function (data) {
      console.log('创建课程响应数据:', data)
      try {
        const parsedData = JSON.parse(data)
        console.log('解析后的创建课程响应:', parsedData)
        return parsedData
      } catch (error) {
        console.error('解析创建课程响应失败:', error)
        throw new Error('响应数据格式错误: ' + error.message)
      }
    }]
  })
}

// 更新课程
export function updateCourse(courseId, course) {
  console.log('正在更新课程:', courseId, course)
  return request({
    url: `/courses/${courseId}`,
    method: 'put',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: course,
    transformResponse: [function (data) {
      console.log('更新课程响应数据:', data)
      try {
        const parsedData = JSON.parse(data)
        console.log('解析后的更新课程响应:', parsedData)
        return parsedData
      } catch (error) {
        console.error('解析更新课程响应失败:', error)
        throw new Error('响应数据格式错误: ' + error.message)
      }
    }]
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

// 删除课程
export function deleteCourse(courseId) {
  console.log('正在删除课程:', courseId)
  return request({
    url: `/courses/${courseId}`,
    method: 'delete',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    transformResponse: [function (data) {
      console.log('删除课程响应数据:', data)
      try {
        const parsedData = JSON.parse(data)
        console.log('解析后的删除课程响应:', parsedData)
        return parsedData
      } catch (error) {
        console.error('解析删除课程响应失败:', error)
        throw new Error('响应数据格式错误: ' + error.message)
      }
    }]
  })
}

// 请求更新共享课程
export function requestSharedCourses() {
  console.log('正在请求更新共享课程')
  return request({
    url: '/courses/request-shared-courses',
    method: 'get',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}