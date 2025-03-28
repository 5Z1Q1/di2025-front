import React from 'react';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import { UserOutlined, BookOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';
import { useStatistics } from '../../hooks/useStatistics';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { data, loading } = useStatistics();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  const courseConfig = {
    data: data?.courseDistribution || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{percentage}%',
    },
    interactions: [{ type: 'element-active' }],
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const studentConfig = {
    data: data?.studentDistribution || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{percentage}%',
    },
    interactions: [{ type: 'element-active' }],
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const trendConfig = {
    data: data?.studentTrend || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '选课时间',
      dataIndex: 'enrollTime',
      key: 'enrollTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === '已确认' ? '#52c41a' : '#faad14' }}>
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.dashboard}>
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="outlined" className={styles.statsCard}>
            <Statistic
              title="总学生数"
              value={data?.totalStudents || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="outlined" className={styles.statsCard}>
            <Statistic
              title="总课程数"
              value={data?.totalCourses || 0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="outlined" className={styles.statsCard}>
            <Statistic
              title="总教师数"
              value={data?.totalTeachers || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="outlined" className={styles.statsCard}>
            <Statistic
              title="选课率"
              value={data?.enrollmentRate || 0}
              prefix={<CheckCircleOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.chartRow}>
        <Col xs={24} lg={12}>
          <Card title="课程分布" variant="outlined">
            <Pie {...courseConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="学生分布" variant="outlined">
            <Pie {...studentConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.chartRow}>
        <Col span={24}>
          <Card title="学生增长趋势" variant="outlined">
            <Line {...trendConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.tableRow}>
        <Col span={24}>
          <Card title="最近选课记录" variant="outlined">
            <Table
              columns={columns}
              dataSource={data?.recentEnrollments || []}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 