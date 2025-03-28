/**
 * 格式化课程时间
 * @param {string} schedule 课程时间字符串
 * @returns {string} 格式化后的时间字符串
 */
export const formatSchedule = (schedule) => {
  // 示例：将 "周一 1-2节" 转换为更友好的格式
  const weekDays = {
    '周一': '星期一',
    '周二': '星期二',
    '周三': '星期三',
    '周四': '星期四',
    '周五': '星期五',
    '周六': '星期六',
    '周日': '星期日',
  };

  return schedule.replace(/(周[一二三四五六日])/, (match) => weekDays[match]);
};

/**
 * 计算课程容量使用率
 * @param {number} enrolled 已选人数
 * @param {number} capacity 总容量
 * @returns {number} 使用率（0-1）
 */
export const calculateUtilization = (enrolled, capacity) => {
  return Math.min(enrolled / capacity, 1);
};

/**
 * 获取课程状态
 * @param {number} enrolled 已选人数
 * @param {number} capacity 总容量
 * @returns {string} 课程状态
 */
export const getCourseStatus = (enrolled, capacity) => {
  if (enrolled >= capacity) {
    return '已满';
  }
  if (enrolled > capacity * 0.8) {
    return '即将满员';
  }
  return '可选';
};

/**
 * 检查课程时间冲突
 * @param {Array} selectedCourses 已选课程列表
 * @param {Object} newCourse 新课程
 * @returns {boolean} 是否存在冲突
 */
export const checkTimeConflict = (selectedCourses, newCourse) => {
  // 这里需要实现具体的时间冲突检测逻辑
  // 示例实现：
  return selectedCourses.some((course) => {
    return course.schedule === newCourse.schedule;
  });
};

/**
 * 格式化学院数据
 * @param {Object} data 原始数据
 * @param {string} college 学院名称
 * @returns {Object} 格式化后的数据
 */
export const formatCollegeData = (data, college) => {
  const collegeConfigs = {
    'A学院': {
      studentId: '学号',
      courseCode: '课程编号',
      // 其他字段映射...
    },
    'B学院': {
      studentId: '学生编号',
      courseCode: '课程代码',
      // 其他字段映射...
    },
    'C学院': {
      studentId: 'ID',
      courseCode: 'Code',
      // 其他字段映射...
    },
  };

  const config = collegeConfigs[college] || {};
  return {
    ...data,
    studentId: data[config.studentId] || data.studentId,
    courseCode: data[config.courseCode] || data.courseCode,
  };
};

/**
 * 生成课程时间表数据
 * @param {Array} courses 课程列表
 * @returns {Array} 时间表数据
 */
export const generateScheduleData = (courses) => {
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 1}节`);

  return weekDays.map((day) => ({
    day,
    slots: timeSlots.map((slot) => {
      const course = courses.find((c) => c.schedule === `${day} ${slot}`);
      return course || null;
    }),
  }));
}; 