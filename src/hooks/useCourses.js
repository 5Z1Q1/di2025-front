import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { courseApi } from '../services/api';
import { formatSchedule, calculateUtilization, getCourseStatus } from '../utils/dataUtils';

export const useCourses = (initialParams = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [params, setParams] = useState(initialParams);

  // 获取课程列表
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourses({
        ...params,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      
      const formattedCourses = response.data.map(course => ({
        ...course,
        schedule: formatSchedule(course.schedule),
        utilization: calculateUtilization(course.enrolled, course.capacity),
        status: getCourseStatus(course.enrolled, course.capacity),
      }));

      setCourses(formattedCourses);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('获取课程列表失败');
      console.error('获取课程列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [params, pagination.current, pagination.pageSize]);

  // 选课
  const enrollCourse = async (courseId) => {
    try {
      await courseApi.enrollCourse(courseId);
      message.success('选课成功');
      fetchCourses(); // 刷新课程列表
    } catch (error) {
      message.error('选课失败');
      console.error('选课失败:', error);
    }
  };

  // 退课
  const dropCourse = async (courseId) => {
    try {
      await courseApi.dropCourse(courseId);
      message.success('退课成功');
      fetchCourses(); // 刷新课程列表
    } catch (error) {
      message.error('退课失败');
      console.error('退课失败:', error);
    }
  };

  // 更新查询参数
  const updateParams = useCallback((newParams) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
    }));
    setPagination(prev => ({
      ...prev,
      current: 1, // 重置页码
    }));
  }, []);

  // 更新分页
  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

  // 初始加载
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    pagination,
    params,
    enrollCourse,
    dropCourse,
    updateParams,
    updatePagination,
    refresh: fetchCourses,
  };
};

export default useCourses; 