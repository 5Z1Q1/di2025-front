import React, { useState } from 'react';
import { Form, Input, Button, Card, Radio, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isRegister) {
        await register(values);
        message.success('注册成功，请登录');
        setIsRegister(false);
        form.resetFields();
      } else {
        await login(values);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      message.error(error.message || (isRegister ? '注册失败' : '登录失败'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title={isRegister ? '注册' : '登录'}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          {isRegister && (
            <Form.Item
              name="role"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Radio.Group>
                <Radio value="student">学生</Radio>
                <Radio value="admin">管理员</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {isRegister ? '注册' : '登录'}
            </Button>
          </Form.Item>

          <div className={styles.switch}>
            <Button
              type="link"
              onClick={() => {
                setIsRegister(!isRegister);
                form.resetFields();
              }}
            >
              {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 