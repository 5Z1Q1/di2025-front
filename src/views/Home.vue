<template>
  <NavBar>
    <div class="home">
      <h1>欢迎使用学生选课系统</h1>
      <el-row :gutter="20" class="card-container">
        <el-col :span="8">
          <el-card shadow="hover" @click="goToStudents">
            <template #header>
              <div class="card-header">
                <span>学生管理</span>
              </div>
            </template>
            <div class="card-content">
              <el-icon :size="40"><User /></el-icon>
              <p>管理学生信息</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click="goToCourses">
            <template #header>
              <div class="card-header">
                <span>课程管理</span>
              </div>
            </template>
            <div class="card-content">
              <el-icon :size="40"><Document /></el-icon>
              <p>管理课程信息</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" @click="goToCourseSelections">
            <template #header>
              <div class="card-header">
                <span>选课管理</span>
              </div>
            </template>
            <div class="card-content">
              <el-icon :size="40"><List /></el-icon>
              <p>管理选课信息</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </NavBar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Document, List } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

const goToStudents = () => {
  router.push('/students')
}

const goToCourses = () => {
  router.push('/courses')
}

const goToCourseSelections = () => {
  router.push('/selections')
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.card-container {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 20px 0;
}

.card-content p {
  margin-top: 10px;
  color: #666;
}

.el-card {
  cursor: pointer;
  transition: all 0.3s;
}

.el-card:hover {
  transform: translateY(-5px);
}
</style> 