import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    role: 'admin',
    name: '管理员'
  },
  {
    id: 2,
    username: 'student',
    password: '123456',
    role: 'student',
    name: '张三'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 检查认证状态
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 登录
  const login = async (values) => {
    try {
      // 模拟登录验证
      const mockUser = mockUsers.find(
        u => u.username === values.username && u.password === values.password
      );

      if (mockUser) {
        const { password, ...userData } = mockUser;
        localStorage.setItem('token', 'mock-token');
        setUser(userData);
        message.success('登录成功');
        return userData;
      } else {
        throw new Error('用户名或密码错误');
      }
    } catch (error) {
      message.error(error.message || '登录失败');
      throw error;
    }
  };

  // 注册
  const register = async (values) => {
    try {
      // 模拟注册
      if (mockUsers.some(u => u.username === values.username)) {
        throw new Error('用户名已存在');
      }

      const newUser = {
        id: mockUsers.length + 1,
        ...values,
        name: values.username
      };
      mockUsers.push(newUser);
      message.success('注册成功');
      return newUser;
    } catch (error) {
      message.error(error.message || '注册失败');
      throw error;
    }
  };

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('已退出登录');
  };

  // 修改密码
  const changePassword = async (values) => {
    try {
      // 模拟修改密码
      const mockUser = mockUsers.find(u => u.id === user.id);
      if (mockUser && mockUser.password === values.oldPassword) {
        mockUser.password = values.newPassword;
        message.success('密码修改成功');
      } else {
        throw new Error('原密码错误');
      }
    } catch (error) {
      message.error(error.message || '密码修改失败');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 