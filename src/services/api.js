import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 修改为实际的后端地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          console.error('权限不足');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error('网络错误，请检查网络连接');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * 用户认证相关 API
 */
export const authApi = {
  // 用户登录
  login: (data) => api.post('/auth/login', data),
  // 用户注册
  register: (data) => api.post('/auth/register', data),
  // 获取当前用户信息
  getCurrentUser: () => api.get('/auth/current-user'),
  // 修改密码
  changePassword: (data) => api.post('/auth/change-password', data),
};

/**
 * 课程相关 API
 */
export const courseApi = {
  // 获取课程列表
  getCourses: (params) => api.get('/courses', { params }),

  // 获取课程详情
  getCourseById: (id) => api.get(`/courses/${id}`),

  // 创建新课程
  createCourse: (data) => api.post('/courses', data),

  // 更新课程信息
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),

  // 删除课程
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // 选课
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),

  // 退课
  withdrawCourse: (courseId) => api.post(`/courses/${courseId}/withdraw`),
};

/**
 * 学生相关 API
 */
export const studentApi = {
  // 获取学生信息
  getStudents: (params) => api.get('/students', { params }),

  // 获取学生选课列表
  getStudentById: (id) => api.get(`/students/${id}`),

  // 创建学生
  createStudent: (data) => api.post('/students', data),

  // 更新学生信息
  updateStudent: (id, data) => api.put(`/students/${id}`, data),

  // 删除学生
  deleteStudent: (id) => api.delete(`/students/${id}`),

  // 获取学生选课列表
  getStudentCourses: (id) => api.get(`/students/${id}/courses`),
};

/**
 * 教师相关 API
 */
export const teacherApi = {
  // 获取教师列表
  getTeachers: (params) => api.get('/teachers', { params }),

  // 获取教师详情
  getTeacherById: (id) => api.get(`/teachers/${id}`),

  // 创建教师
  createTeacher: (data) => api.post('/teachers', data),

  // 更新教师信息
  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data),

  // 删除教师
  deleteTeacher: (id) => api.delete(`/teachers/${id}`),

  // 获取教师课程列表
  getTeacherCourses: (id) => api.get(`/teachers/${id}/courses`),
};

/**
 * 选课相关 API
 */
export const enrollmentApi = {
  // 获取选课列表
  getEnrollments: (params) => api.get('/enrollments', { params }),

  // 获取选课详情
  getEnrollmentById: (id) => api.get(`/enrollments/${id}`),

  // 创建选课
  createEnrollment: (data) => api.post('/enrollments', data),

  // 更新选课
  updateEnrollment: (id, data) => api.put(`/enrollments/${id}`, data),

  // 删除选课
  deleteEnrollment: (id) => api.delete(`/enrollments/${id}`),

  // 批准选课
  approveEnrollment: (id) => api.post(`/enrollments/${id}/approve`),

  // 拒绝选课
  rejectEnrollment: (id) => api.post(`/enrollments/${id}/reject`),

  // 选课
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),

  // 退课
  drop: (courseId) => api.delete(`/enrollments/${courseId}`),

  // 获取选课统计
  getEnrollmentStats: () => api.get('/statistics/enrollments'),
};

/**
 * 统计相关 API
 */
export const statisticsApi = {
  // 获取选课统计
  getEnrollmentStats: () => api.get('/statistics/enrollments'),

  // 获取课程容量统计
  getCapacityStats: () => api.get('/statistics/capacity'),

  // 获取学院分布统计
  getCollegeStats: () => api.get('/statistics/colleges'),

  // 获取总体统计
  getOverview: () => api.get('/statistics/overview'),

  // 获取课程统计
  getCourseStats: () => api.get('/statistics/courses'),

  // 获取学生统计
  getStudentStats: () => api.get('/statistics/students'),

  // 获取教师统计
  getTeacherStats: () => api.get('/statistics/teachers'),
};

/**
 * 管理员相关 API
 */
export const adminApi = {
  // 获取系统设置
  getSystemSettings: () => api.get('/admin/settings'),

  // 更新系统设置
  updateSystemSettings: (data) => api.put('/admin/settings', data),

  // 获取学院设置
  getCollegeSettings: () => api.get('/admin/colleges'),

  // 更新学院设置
  updateCollegeSettings: (data) => api.put('/admin/colleges', data),

  // 获取用户列表
  getUsers: (params) => api.get('/admin/users', { params }),

  // 创建用户
  createUser: (data) => api.post('/admin/users', data),

  // 更新用户信息
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),

  // 删除用户
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api; 