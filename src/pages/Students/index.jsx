import React, { useState } from 'react';
import { Table, Card, Form, Input, Select, Button, Space, Tag, Modal, message, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { COLLEGE_CONFIG } from '../../constants/config';

const { Option } = Select;
const { confirm } = Modal;

const Students = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // 模拟学生数据
  const studentData = [
    {
      id: '1',
      studentId: '2024001',
      name: '张三',
      college: 'A学院',
      major: '计算机科学',
      grade: '2024',
      status: '在读',
      email: 'zhangsan@example.com',
      phone: '13800138000',
    },
    {
      id: '2',
      studentId: '2024002',
      name: '李四',
      college: 'B学院',
      major: '数学',
      grade: '2024',
      status: '在读',
      email: 'lisi@example.com',
      phone: '13800138001',
    },
  ];

  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '学院',
      dataIndex: 'college',
      key: 'college',
      render: (college) => {
        const config = COLLEGE_CONFIG[college];
        return <Tag color={config?.color}>{college}</Tag>;
      },
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
    },
    {
      title: '年级',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          '在读': 'green',
          '休学': 'orange',
          '退学': 'red',
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setModalVisible(true);
  };

  const handleDelete = (student) => {
    confirm({
      title: '确认删除',
      content: `确定要删除学生 ${student.name} 吗？`,
      onOk() {
        message.success('删除成功');
        // 调用删除 API
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingStudent) {
        // 更新学生信息
        console.log('更新学生信息：', values);
        message.success('更新成功');
      } else {
        // 添加新学生
        console.log('添加新学生：', values);
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingStudent(null);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleSearch = async (values) => {
    try {
      setLoading(true);
      console.log('搜索条件：', values);
      // 实现搜索逻辑
    } finally {
      setLoading(false);
    }
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
            <Input placeholder="学号/姓名" />
          </Form.Item>
          <Form.Item name="college" label="学院">
            <Select placeholder="选择学院" style={{ width: 120 }}>
              {Object.keys(COLLEGE_CONFIG).map((college) => (
                <Option key={college} value={college}>
                  {college}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select placeholder="选择状态" style={{ width: 120 }}>
              <Option value="在读">在读</Option>
              <Option value="休学">休学</Option>
              <Option value="退学">退学</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                搜索
              </Button>
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => {
                  setEditingStudent(null);
                  form.resetFields();
                  setModalVisible(true);
                }}
              >
                添加学生
              </Button>
            </Space>
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
          dataSource={studentData}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingStudent ? '编辑学生' : '添加学生'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingStudent(null);
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="studentId"
            label="学号"
            rules={[{ required: true, message: '请输入学号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="college"
            label="学院"
            rules={[{ required: true, message: '请选择学院' }]}
          >
            <Select>
              {Object.keys(COLLEGE_CONFIG).map((college) => (
                <Option key={college} value={college}>
                  {college}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="major"
            label="专业"
            rules={[{ required: true, message: '请输入专业' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="年级"
            rules={[{ required: true, message: '请输入年级' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="在读">在读</Option>
              <Option value="休学">休学</Option>
              <Option value="退学">退学</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话"
            rules={[
              { required: true, message: '请输入电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students; 