<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/students">
          <el-icon><User /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
        <el-menu-item index="/courses">
          <el-icon><Document /></el-icon>
          <span>课程管理</span>
        </el-menu-item>
        <el-menu-item index="/selections">
          <el-icon><List /></el-icon>
          <span>选课管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>教务管理系统</h2>
          <div class="logout-button" @click="handleLogout">
            <img src="/images/logout.svg" alt="登出" title="登出" />
          </div>
        </div>
      </el-header>
      <el-main>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { HomeFilled, User, Document, List } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 处理登出
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 清除token
    localStorage.removeItem('token')
    // 跳转到登录页
    router.push('/')
  })
}
</script>

<style scoped>
.el-aside {
  background-color: #545c64;
}

.el-menu {
  border-right: none;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-button {
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
}

.logout-button img {
  width: 24px;
  height: 24px;
}

.logout-button:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}
</style>
