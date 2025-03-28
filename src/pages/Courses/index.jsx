import React, { useState } from 'react';
import { Table, Card, Form, Input, Select, Button, Space, Tag, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const Courses = () => {
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 模拟课程数据
  const courseData = [
    {
      id: '1',
      code: 'CS101',
      name: '计算机导论',
      teacher: '张教授',
      college: 'A学院',
      capacity: 100,
      enrolled: 80,
      schedule: '周一 1-2节',
      location: '教学楼A101',
      credits: 3,
      status: '可选',
    },
    {
      id: '2',
      code: 'MATH201',
      name: '高等数学',
      teacher: '李教授',
      college: 'B学院',
      capacity: 120,
      enrolled: 120,
      schedule: '周二 3-4节',
      location: '教学楼B203',
      credits: 4,
      status: '已满',
    },
    // 更多课程数据...
  ];

  const columns = [
    {
      title: '课程代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '开课学院',
      dataIndex: 'college',
      key: 'college',
      render: (college) => {
        const colors = {
          'A学院': 'red',
          'B学院': 'blue',
          'C学院': 'green',
        };
        return <Tag color={colors[college]}>{college}</Tag>;
      },
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (_, record) => `${record.enrolled}/${record.capacity}`,
    },
    {
      title: '上课时间',
      dataIndex: 'schedule',
      key: 'schedule',
    },
    {
      title: '上课地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '学分',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          '可选': 'green',
          '已满': 'red',
          '已选': 'blue',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleSelect(record)}>
            选课
          </Button>
          <Button type="link" danger onClick={() => handleDrop(record)}>
            退课
          </Button>
        </Space>
      ),
    },
  ];

  const handleSelect = (course) => {
    confirm({
      title: '确认选课',
      icon: <ExclamationCircleOutlined />,
      content: `确定要选择课程 ${course.name} 吗？`,
      onOk() {
        message.success('选课成功！');
      },
    });
  };

  const handleDrop = (course) => {
    confirm({
      title: '确认退课',
      icon: <ExclamationCircleOutlined />,
      content: `确定要退选课程 ${course.name} 吗？`,
      onOk() {
        message.success('退课成功！');
      },
    });
  };

  const handleSearch = (values) => {
    console.log('搜索条件：', values);
    // 实现搜索逻辑
  };

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="keyword" label="关键词">
            <Input placeholder="课程名称/教师" />
          </Form.Item>
          <Form.Item name="college" label="开课学院">
            <Select placeholder="选择学院" style={{ width: 120 }}>
              <Option value="A学院">A学院</Option>
              <Option value="B学院">B学院</Option>
              <Option value="C学院">C学院</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={columns}
          dataSource={courseData}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default Courses; 