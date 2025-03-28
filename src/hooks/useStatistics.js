import { useState, useEffect } from 'react';
import { message } from 'antd';
import { statisticsApi } from '../services/api';

// 模拟数据
const mockData = {
  totalStudents: 15000,
  totalCourses: 500,
  totalTeachers: 450,
  enrollmentRate: 85,
  courseDistribution: [
    { type: '必修课', value: 60 },
    { type: '选修课', value: 40 },
  ],
  studentDistribution: [
    { type: '本科生', value: 70 },
    { type: '研究生', value: 30 },
  ],
  studentTrend: [
    { date: '2020', value: 12000, type: '本科生' },
    { date: '2020', value: 3000, type: '研究生' },
    { date: '2021', value: 13000, type: '本科生' },
    { date: '2021', value: 3200, type: '研究生' },
    { date: '2022', value: 14000, type: '本科生' },
    { date: '2022', value: 3500, type: '研究生' },
    { date: '2023', value: 15000, type: '本科生' },
    { date: '2023', value: 3800, type: '研究生' },
  ],
  recentEnrollments: [
    {
      id: 1,
      courseName: '高等数学',
      studentName: '张三',
      enrollTime: '2024-03-20 10:00:00',
      status: '已确认',
    },
    {
      id: 2,
      courseName: '大学物理',
      studentName: '李四',
      enrollTime: '2024-03-20 09:30:00',
      enrollmentTime: '2024-03-20 09:30:00',
      status: '待确认',
    },
  ],
};

// 默认数据
const defaultData = {
  totalStudents: 0,
  totalCourses: 0,
  totalTeachers: 0,
  enrollmentRate: 0,
  courseData: [
    { name: '必修课', value: 0, type: '必修' },
    { name: '选修课', value: 0, type: '选修' },
  ],
  studentData: [
    { year: '2020', value: 0, type: '在校生' },
    { year: '2021', value: 0, type: '在校生' },
    { year: '2022', value: 0, type: '在校生' },
  ],
  enrollmentData: [
    { type: '已选课', value: 0 },
    { type: '未选课', value: 0 },
  ],
  recentEnrollments: [],
};

export const useStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取选课统计
        const enrollmentsRes = await statisticsApi.getEnrollmentStats();
        const enrollments = enrollmentsRes.data || {};

        // 获取课程容量统计
        const capacityRes = await statisticsApi.getCapacityStats();
        const capacity = capacityRes.data || {};

        // 获取学院统计
        const collegesRes = await statisticsApi.getCollegeStats();
        const colleges = collegesRes.data || {};

        // 计算总学生数和选课率
        const totalStudents = colleges.totalStudents || 0;
        const enrolledStudents = enrollments.totalEnrolled || 0;
        const enrollmentRate = totalStudents > 0 
          ? Math.round((enrolledStudents / totalStudents) * 100) 
          : 0;

        // 更新数据
        setData({
          totalStudents,
          totalCourses: capacity.totalCourses || 0,
          totalTeachers: capacity.totalTeachers || 0,
          enrollmentRate,
          courseData: [
            { name: '必修课', value: capacity.requiredCourses || 0, type: '必修' },
            { name: '选修课', value: capacity.electiveCourses || 0, type: '选修' },
          ],
          studentData: (colleges.yearlyStats || []).map(stat => ({
            year: stat.year,
            value: stat.count,
            type: '在校生'
          })),
          enrollmentData: [
            { type: '已选课', value: enrolledStudents },
            { type: '未选课', value: totalStudents - enrolledStudents },
          ],
          recentEnrollments: (enrollments.recentEnrollments || []).map(enrollment => ({
            id: enrollment.id,
            courseName: enrollment.courseName,
            studentName: enrollment.studentName,
            enrollmentTime: enrollment.enrollmentTime,
            status: enrollment.status,
          })),
        });
      } catch (err) {
        console.error('获取统计数据失败:', err);
        setError(err);
        // 使用模拟数据
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    error,
    ...data,
  };
};

export default useStatistics; 