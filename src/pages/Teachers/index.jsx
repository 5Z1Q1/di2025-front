import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { teacherApi } from '../../services/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // 获取教师列表
  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const data = await teacherApi.getTeachers();
      setTeachers(data);
    } catch (error) {
      message.error('获取教师列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 处理表单提交
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await teacherApi.updateTeacher(editingId, values);
        message.success('更新成功');
      } else {
        await teacherApi.createTeacher(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchTeachers();
    } catch (error) {
      message.error(editingId ? '更新失败' : '添加失败');
    }
  };

  // 处理删除
  const handleDelete = async (id) => {
    try {
      await teacherApi.deleteTeacher(id);
      message.success('删除成功');
      fetchTeachers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 打开编辑模态框
  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 打开添加模态框
  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const columns = [
    {
      title: '教师编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '职称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '所属院系',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该教师吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加教师
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? '编辑教师' : '添加教师'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="title"
            label="职称"
            rules={[{ required: true, message: '请输入职称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="所属院系"
            rules={[{ required: true, message: '请输入所属院系' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Teachers; 