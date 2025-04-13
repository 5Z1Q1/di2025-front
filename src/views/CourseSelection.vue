<template>
  <NavBar>
    <div class="course-selection">
      <div class="header">
        <h1>学生选课</h1>
      </div>

      <!-- 课程列表 -->
      <el-table :data="availableCourses" style="width: 100%" border>
        <el-table-column prop="courseId" label="课程编号" width="120" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="college" label="开课学院" />
        <el-table-column prop="teacher" label="授课教师" />
        <el-table-column prop="credit" label="学分" width="80" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              size="small" 
              type="primary" 
              @click="handleSelect(scope.row)"
              :disabled="isSelected(scope.row.courseId)"
            >
              选课
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 已选课程 -->
      <div class="selected-courses">
        <h2>已选课程</h2>
        <el-table :data="selectedCourses" style="width: 100%" border>
          <el-table-column prop="courseId" label="课程编号" width="120" />
          <el-table-column prop="courseName" label="课程名称" />
          <el-table-column prop="college" label="开课学院" />
          <el-table-column prop="teacher" label="授课教师" />
          <el-table-column prop="credit" label="学分" width="80" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDrop(scope.row)"
              >
                退课
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </NavBar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAvailableCourses, selectCourse, dropCourse, getStudentSelections } from '../api/selection'
import NavBar from '../components/NavBar.vue'

// 可用课程列表
const availableCourses = ref([])
// 已选课程列表
const selectedCourses = ref([])

// 获取可用课程列表
const fetchAvailableCourses = async () => {
  try {
    const res = await getAvailableCourses()
    availableCourses.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('获取可用课程列表失败:', error)
    ElMessage.error('获取可用课程列表失败')
  }
}

// 获取已选课程列表
const fetchSelectedCourses = async () => {
  try {
    const studentId = localStorage.getItem('username')
    const res = await getStudentSelections(studentId)
    selectedCourses.value = Array.isArray(res) ? res : []
  } catch (error) {
    console.error('获取已选课程列表失败:', error)
    ElMessage.error('获取已选课程列表失败')
  }
}

// 判断课程是否已选
const isSelected = (courseId) => {
  return selectedCourses.value.some(course => course.courseId === courseId)
}

// 选课
const handleSelect = async (course) => {
  try {
    await ElMessageBox.confirm(
      `确定要选择课程 ${course.courseName} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    const studentId = localStorage.getItem('username')
    await selectCourse(studentId, course.courseId)
    ElMessage.success('选课成功')
    fetchSelectedCourses()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('选课失败:', error)
      ElMessage.error('选课失败')
    }
  }
}

// 退课
const handleDrop = async (course) => {
  try {
    await ElMessageBox.confirm(
      `确定要退选课程 ${course.courseName} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const studentId = localStorage.getItem('username')
    await dropCourse(studentId, course.courseId)
    ElMessage.success('退课成功')
    fetchSelectedCourses()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退课失败:', error)
      ElMessage.error('退课失败')
    }
  }
}

onMounted(() => {
  fetchAvailableCourses()
  fetchSelectedCourses()
})
</script>

<style scoped>
.course-selection {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.selected-courses {
  margin-top: 40px;
}

.selected-courses h2 {
  margin-bottom: 20px;
}
</style> 