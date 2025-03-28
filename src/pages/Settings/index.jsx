import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Switch, Tabs, message, Divider, Space } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { COLLEGE_CONFIG } from '../../constants/config';

const { Option } = Select;

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟系统配置数据
  const initialValues = {
    system: {
      siteName: 'ABC教务系统',
      siteDescription: '跨学院教务管理系统',
      enableRegistration: true,
      enableCourseSelection: true,
      maxCreditsPerSemester: 30,
      minCreditsPerSemester: 15,
    },
    college: {
      'A学院': {
        enabled: true,
        fieldMapping: {
          studentId: '学号',
          courseCode: '课程编号',
          courseName: '课程名称',
          teacher: '教师姓名',
          credits: '学分',
        },
      },
      'B学院': {
        enabled: true,
        fieldMapping: {
          studentId: '学生编号',
          courseCode: '课程代码',
          courseName: '课程名',
          teacher: '授课教师',
          credits: '学分值',
        },
      },
      'C学院': {
        enabled: true,
        fieldMapping: {
          studentId: 'ID',
          courseCode: 'Code',
          courseName: 'Name',
          teacher: 'Teacher',
          credits: 'Credits',
        },
      },
    },
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      // 调用保存 API
      console.log('保存配置：', values);
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
      console.error('保存失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(initialValues);
    message.success('已重置为默认配置');
  };

  const SystemSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues.system}
      onFinish={handleSave}
    >
      <Form.Item
        name="siteName"
        label="系统名称"
        rules={[{ required: true, message: '请输入系统名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="siteDescription"
        label="系统描述"
        rules={[{ required: true, message: '请输入系统描述' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        name="enableRegistration"
        label="开放注册"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        name="enableCourseSelection"
        label="开放选课"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        name="maxCreditsPerSemester"
        label="每学期最大学分"
        rules={[{ required: true, message: '请输入最大学分' }]}
      >
        <Input type="number" min={1} max={40} />
      </Form.Item>
      <Form.Item
        name="minCreditsPerSemester"
        label="每学期最小学分"
        rules={[{ required: true, message: '请输入最小学分' }]}
      >
        <Input type="number" min={1} max={40} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            保存
          </Button>
          <Button onClick={handleReset} icon={<ReloadOutlined />}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const CollegeSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues.college}
      onFinish={handleSave}
    >
      {Object.entries(COLLEGE_CONFIG).map(([college, config]) => (
        <Card key={college} title={college} style={{ marginBottom: 16 }}>
          <Form.Item
            name={[college, 'enabled']}
            label="启用"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Divider>字段映射</Divider>
          {Object.entries(config.fieldMapping).map(([field, label]) => (
            <Form.Item
              key={field}
              name={[college, 'fieldMapping', field]}
              label={label}
              rules={[{ required: true, message: `请输入${label}` }]}
            >
              <Input />
            </Form.Item>
          ))}
        </Card>
      ))}
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            保存
          </Button>
          <Button onClick={handleReset} icon={<ReloadOutlined />}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const items = [
    {
      key: 'system',
      label: '系统设置',
      children: <SystemSettings />
    },
    {
      key: 'college',
      label: '学院配置',
      children: <CollegeSettings />
    }
  ];

  return (
    <Card title="系统设置">
      <Tabs items={items} />
    </Card>
  );
};

export default Settings; 