<template>
  <NavBar>
    <div class="student-container">
      <div class="header">
        <h1>学生管理</h1>
        <el-button type="primary" @click="handleAdd">添加学生</el-button>
      </div>

      <el-table :data="students" style="width: 100%" border v-loading="loading">
        <el-table-column prop="studentId" label="学号" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="gender" label="性别" width="100">
          <template #default="scope">
            {{ scope.row.gender === 'M' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="major" label="专业" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加/编辑学生对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '添加学生' : '编辑学生'"
        width="500px"
      >
        <el-form :model="studentForm" :rules="rules" ref="studentFormRef" label-width="100px">
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="studentForm.studentId" :disabled="dialogType === 'edit'" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="studentForm.name" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="studentForm.gender">
              <el-radio label="M">男</el-radio>
              <el-radio label="F">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="studentForm.major" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="studentForm.password" type="password" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } from '@/api/student'
import NavBar from '../components/NavBar.vue'

// 学生列表数据
const students = ref([])
const loading = ref(false)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const studentFormRef = ref(null)

// 学生表单数据
const studentForm = reactive({
  studentId: '',
  name: '',
  gender: 'M',
  major: '',
  password: ''
})

const rules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{9}$/, message: '学号必须是9位数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码长度在6到12个字符之间', trigger: 'blur' }
  ]
}

// 获取学生列表
const fetchStudents = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      return
    }
    const response = await getAllStudents()
    console.log('原始响应数据:', response)
    console.log('响应数据类型:', typeof response)
    console.log('响应数据结构:', JSON.stringify(response, null, 2))
    
    if (response) {
      // 检查响应数据的结构
      if (Array.isArray(response)) {
        students.value = response
      } else if (response.data && Array.isArray(response.data)) {
        students.value = response.data
      } else if (response.data && typeof response.data === 'object') {
        students.value = [response.data]
      } else {
        console.error('无法识别的响应格式:', response)
        throw new Error('获取学生列表失败：响应格式不正确')
      }
      console.log('最终设置的学生数据:', students.value)
    } else {
      throw new Error('获取学生列表失败：响应为空')
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      window.location.href = '/'
    } else {
      ElMessage.error(error.message || '获取学生列表失败')
    }
  } finally {
    loading.value = false
  }
}

// 添加学生
const handleAdd = () => {
  dialogType.value = 'add'
  studentForm.studentId = ''
  studentForm.name = ''
  studentForm.gender = 'M'
  studentForm.major = ''
  studentForm.password = ''
  dialogVisible.value = true
}

// 编辑学生
const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.assign(studentForm, row)
  dialogVisible.value = true
}

// 删除学生
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该学生吗？', '提示', {
      type: 'warning'
    })
    const token = localStorage.getItem('token')
    if (!token) {
      ElMessage.error('请先登录')
      return
    }
    await deleteStudent(row.studentId)
    ElMessage.success('删除成功')
    fetchStudents()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除学生失败:', error)
      if (error.response?.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        window.location.href = '/'
      } else {
        ElMessage.error('删除学生失败')
      }
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!studentFormRef.value) return
  
  await studentFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          ElMessage.error('请先登录')
          return
        }
        
        const studentData = {
          studentId: studentForm.studentId,
          name: studentForm.name,
          gender: studentForm.gender,
          major: studentForm.major,
          password: studentForm.password
        }
        
        if (dialogType.value === 'add') {
          const response = await createStudent(studentData)
          if (response.status === 201) {
            ElMessage.success('添加成功')
          } else {
            throw new Error('添加失败')
          }
        } else {
          const response = await updateStudent(studentForm.studentId, studentData)
          if (response.status === 200) {
            ElMessage.success('更新成功')
          } else {
            throw new Error('更新失败')
          }
        }
        dialogVisible.value = false
        fetchStudents()
      } catch (error) {
        console.error('保存学生信息失败:', error)
        if (error.response?.status === 401) {
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/'
        } else {
          ElMessage.error('保存学生信息失败')
        }
      }
    }
  })
}

onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.student-container {
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 