<template>
  <NavBar>
    <div class="home">
      <h1>欢迎使用学生选课系统</h1>
      <el-row :gutter="20" class="card-container">
        <el-col :span="8">
          <el-card class="box-card" @click="handleCardClick('student')">
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
          <el-card class="box-card" @click="handleCardClick('course')">
            <template #header>
              <div class="card-header">
                <span>课程管理</span>
              </div>
            </template>
            <div class="card-content">
              <el-icon :size="40"><Reading /></el-icon>
              <p>管理课程信息</p>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="box-card" @click="handleCardClick('course-selection')">
            <template #header>
              <div class="card-header">
                <span>学生选课</span>
              </div>
            </template>
            <div class="card-content">
              <el-icon :size="40"><Select /></el-icon>
              <p>选择课程</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </NavBar>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Reading, List, Select } from '@element-plus/icons-vue'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

const handleCardClick = (type) => {
  switch (type) {
    case 'student':
      router.push('/students')
      break
    case 'course':
      router.push('/courses')
      break
    case 'selection':
      router.push('/selections')
      break
    case 'course-selection':
      router.push('/course-selection')
      break
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.card-container {
  margin-top: 20px;
}

.box-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.box-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
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
</style> 