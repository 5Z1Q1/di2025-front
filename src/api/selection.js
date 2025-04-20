import request from '../utils/request'

// 获取学生的选课记录
export function getStudentSelections(studentId) {
  console.log('正在请求学生选课记录，学号:', studentId)
  return request({
    url: `/selections/student/${studentId}`,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    transformResponse: [function (data) {
      console.log('收到响应数据:', data)
      return data
    }]
  })
}

// 获取可用课程列表
export function getAvailableCourses() {
  return request({
    url: '/courses',
    method: 'get',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 选课
export function selectCourse(studentId, courseId) {
  return request({
    url: '/selections/select',
    method: 'post',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: {
      studentId,
      courseId
    }
  })
}

// 修复 dropCourse 方法的 URL 拼接问题，确保不会重复添加 /api
export function dropCourse(studentId, courseId) {
  // 确保 studentId 和 courseId 的值正确
  if (!studentId || !courseId) {
    console.error('退课参数缺失:', { studentId, courseId });
    throw new Error('退课参数缺失');
  }

  // 修复 URL 拼接问题
  return request({
    url: `/selections/${studentId}/${courseId}`, // 移除多余的 /api
    method: 'delete',
  });
}

// 更新成绩
export function updateScore(studentId, courseId, score) {
  return request({
    url: `/selections/${studentId}/${courseId}/score`,
    method: 'put',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: { score }
  })
}

// 获取学生的跨学院选课记录
export function getCrossCollegeSelections(studentId) {
  return request({
    url: `/selections/cross-college/${studentId}`,
    method: 'get',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json;charset=UTF-8'
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

// 修复 URL 中多余的 /api
export async function getCrossCollegeCoursesByStudentId(studentId) {
  return request({
    url: `/selections/student/${studentId}/cross-college`,
    method: 'get',
  });
}