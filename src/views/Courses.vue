<template>
  <NavBar>
    <div class="courses">
      <div class="header">
        <h1>课程管理</h1>
        <el-button type="primary" @click="handleAdd">添加课程</el-button>
      </div>

      <el-table :data="courses" style="width: 100%" border>
        <el-table-column prop="courseId" label="课程编号" width="120" />
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="teacher" label="授课教师" />
        <el-table-column prop="credit" label="学分" width="80" />
        <el-table-column prop="capacity" label="容量" width="80" />
        <el-table-column prop="shared" label="共享状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.shared ? 'success' : 'info'">
              {{ scope.row.shared ? '已共享' : '未共享' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              size="small" 
              :type="scope.row.shared ? 'warning' : 'success'"
              @click="handleShare(scope.row)"
            >
              {{ scope.row.shared ? '取消共享' : '共享' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加/编辑课程对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '添加课程' : '编辑课程'"
        width="500px"
      >
        <el-form :model="courseForm" label-width="100px">
          <el-form-item label="课程编号">
            <el-input v-model="courseForm.courseId" :disabled="dialogType === 'edit'" />
          </el-form-item>
          <el-form-item label="课程名称">
            <el-input v-model="courseForm.name" />
          </el-form-item>
          <el-form-item label="授课教师">
            <el-input v-model="courseForm.teacher" />
          </el-form-item>
          <el-form-item label="学分">
            <el-input-number v-model="courseForm.credit" :min="1" :max="10" />
          </el-form-item>
          <el-form-item label="容量">
            <el-input-number v-model="courseForm.capacity" :min="1" :max="200" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </NavBar>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  getAllCourses, 
  getCourse, 
  createCourse, 
  updateCourse, 
  shareCourse, 
  unshareCourse 
} from '../api/course'
import NavBar from '../components/NavBar.vue'

// 课程列表数据
const courses = ref([])

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'

// 课程表单数据
const courseForm = reactive({
  courseId: '',
  name: '',
  teacher: '',
  credit: 2,
  capacity: 50,
  shared: false
})

// 获取课程列表
const fetchCourses = async () => {
  try {
    const response = await getAllCourses()
    if (Array.isArray(response)) {
      courses.value = response
    } else {
      console.error('获取课程列表失败：响应数据格式错误')
      ElMessage.error('获取课程列表失败：数据格式错误')
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error(error.message || '获取课程列表失败')
  }
}

// 添加课程
const handleAdd = () => {
  dialogType.value = 'add'
  Object.assign(courseForm, {
    courseId: '',
    name: '',
    teacher: '',
    credit: 2,
    capacity: 50,
    shared: false
  })
  dialogVisible.value = true
}

// 编辑课程
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(courseForm, row)
  dialogVisible.value = true
}

// 共享/取消共享课程
const handleShare = async (row) => {
  try {
    if (row.shared) {
      await unshareCourse(row.courseId)
      ElMessage.success('取消共享成功')
    } else {
      await shareCourse(row.courseId)
      ElMessage.success('共享成功')
    }
    fetchCourses()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    if (dialogType.value === 'add') {
      await createCourse(courseForm)
      ElMessage.success('添加成功')
    } else {
      await updateCourse(courseForm.courseId, courseForm)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    fetchCourses()
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style> 