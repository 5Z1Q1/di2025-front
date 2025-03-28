/**
 * 学院配置
 */
export const COLLEGE_CONFIG = {
  'A学院': {
    color: '#ff4d4f',
    prefix: 'A',
    fieldMapping: {
      studentId: '学号',
      courseCode: '课程编号',
      courseName: '课程名称',
      teacher: '教师姓名',
      credits: '学分',
    },
  },
  'B学院': {
    color: '#1890ff',
    prefix: 'B',
    fieldMapping: {
      studentId: '学生编号',
      courseCode: '课程代码',
      courseName: '课程名',
      teacher: '授课教师',
      credits: '学分值',
    },
  },
  'C学院': {
    color: '#52c41a',
    prefix: 'C',
    fieldMapping: {
      studentId: 'ID',
      courseCode: 'Code',
      courseName: 'Name',
      teacher: 'Teacher',
      credits: 'Credits',
    },
  },
};

/**
 * 课程状态配置
 */
export const COURSE_STATUS = {
  AVAILABLE: {
    key: 'available',
    text: '可选',
    color: '#52c41a',
  },
  ALMOST_FULL: {
    key: 'almost_full',
    text: '即将满员',
    color: '#faad14',
  },
  FULL: {
    key: 'full',
    text: '已满',
    color: '#ff4d4f',
  },
  SELECTED: {
    key: 'selected',
    text: '已选',
    color: '#1890ff',
  },
};

/**
 * 时间配置
 */
export const TIME_CONFIG = {
  weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  timeSlots: Array.from({ length: 12 }, (_, i) => `${i + 1}节`),
  weekDayMapping: {
    '周一': '星期一',
    '周二': '星期二',
    '周三': '星期三',
    '周四': '星期四',
    '周五': '星期五',
    '周六': '星期六',
    '周日': '星期日',
  },
};

/**
 * API 配置
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  endpoints: {
    courses: '/courses',
    students: '/students',
    enrollments: '/enrollments',
    statistics: '/statistics',
  },
};

/**
 * 权限配置
 */
export const PERMISSION_CONFIG = {
  roles: {
    admin: 'admin',
    teacher: 'teacher',
    student: 'student',
  },
  permissions: {
    viewAllCourses: 'view:all:courses',
    editCourses: 'edit:courses',
    manageStudents: 'manage:students',
    viewStatistics: 'view:statistics',
  },
}; 