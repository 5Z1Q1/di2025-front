import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Avatar, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import styles from './BasicLayout.module.css';

const { Header, Sider, Content } = Layout;

const BasicLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: '课程管理',
    },
    ...(user?.role === 'admin' ? [
      {
        key: '/students',
        icon: <UserOutlined />,
        label: '学生管理',
      },
      {
        key: '/teachers',
        icon: <TeamOutlined />,
        label: '教师管理',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '系统设置',
      },
    ] : []),
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }) => {
    setLoading(true);
    navigate(key);
    // 模拟加载时间
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={200}
        className={styles.sider}
      >
        <div className={styles.logo}>
          {!collapsed && <span>教务管理系统</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout className={`${styles.mainLayout} ${collapsed ? styles.collapsed : ''}`}>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className={styles.trigger}
          />
          <div className={styles.userInfo}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <span className={styles.userDropdown}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles.userName}>{user?.name || '用户'}</span>
              </span>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <Spin size="large" />
            </div>
          )}
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout; 