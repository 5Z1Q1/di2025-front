<template>
  <NavBar>
    <div class="selections">
      <div class="header">
        <h1>选课管理</h1>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="本学院选课" name="local">
          <el-table :data="localSelections" style="width: 100%" border>
            <el-table-column prop="studentId" label="学号" width="120" />
            <el-table-column prop="studentName" label="学生姓名" />
            <el-table-column prop="courseId" label="课程编号" width="120" />
            <el-table-column prop="courseName" label="课程名称" />
            <el-table-column prop="score" label="成绩" width="100">
              <template #default="scope">
                <span v-if="scope.row.score">{{ scope.row.score }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="handleDrop(scope.row)"
                  v-if="!scope.row.score"
                >
                  退课
                </el-button>
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="handleUpdateScore(scope.row)"
                  v-if="scope.row.score"
                >
                  修改成绩
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="跨学院选课" name="cross">
          <el-table :data="crossSelections" style="width: 100%" border>
            <el-table-column prop="studentId" label="学号" width="120" />
            <el-table-column prop="studentName" label="学生姓名" />
            <el-table-column prop="courseId" label="课程编号" width="120" />
            <el-table-column prop="courseName" label="课程名称" />
            <el-table-column prop="college" label="开课学院" />
            <el-table-column prop="score" label="成绩" width="100">
              <template #default="scope">
                <span v-if="scope.row.score">{{ scope.row.score }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button 
                  size="small" 
                  type="danger" 
                  @click="handleDrop(scope.row)"
                  v-if="!scope.row.score"
                >
                  退课
                </el-button>
                <el-button 
                  size="small" 
                  type="primary" 
                  @click="handleUpdateScore(scope.row)"
                  v-if="scope.row.score"
                >
                  修改成绩
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 修改成绩对话框 -->
      <el-dialog
        v-model="scoreDialogVisible"
        title="修改成绩"
        width="400px"
      >
        <el-form :model="scoreForm" label-width="80px">
          <el-form-item label="成绩">
            <el-input-number 
              v-model="scoreForm.score" 
              :min="0" 
              :max="100" 
              :step="1"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="scoreDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitScore">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </NavBar>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getStudentSelections,
  dropCourse,
  updateScore,
  getCrossCollegeSelections
} from '../api/selection'
import NavBar from '../components/NavBar.vue'

// 选课列表数据
const localSelections = ref([])
const crossSelections = ref([])
const activeTab = ref('local')

// 成绩对话框控制
const scoreDialogVisible = ref(false)
const currentSelection = ref(null)

// 成绩表单数据
const scoreForm = reactive({
  score: 0
})

// 获取本学院选课列表
const fetchLocalSelections = async () => {
  try {
    const res = await getStudentSelections()
    localSelections.value = res
  } catch (error) {
    console.error('获取选课列表失败:', error)
    ElMessage.error('获取选课列表失败')
  }
}

// 获取跨学院选课列表
const fetchCrossSelections = async () => {
  try {
    const res = await getCrossCollegeSelections()
    crossSelections.value = res
  } catch (error) {
    console.error('获取跨学院选课列表失败:', error)
    ElMessage.error('获取跨学院选课列表失败')
  }
}

// 退课
const handleDrop = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要退选该课程吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await dropCourse(row.studentId, row.courseId)
    ElMessage.success('退课成功')
    if (activeTab.value === 'local') {
      fetchLocalSelections()
    } else {
      fetchCrossSelections()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退课失败:', error)
      ElMessage.error('退课失败')
    }
  }
}

// 修改成绩
const handleUpdateScore = (row) => {
  currentSelection.value = row
  scoreForm.score = row.score || 0
  scoreDialogVisible.value = true
}

// 提交成绩
const submitScore = async () => {
  try {
    await updateScore(
      currentSelection.value.studentId,
      currentSelection.value.courseId,
      scoreForm.score
    )
    ElMessage.success('成绩更新成功')
    scoreDialogVisible.value = false
    if (activeTab.value === 'local') {
      fetchLocalSelections()
    } else {
      fetchCrossSelections()
    }
  } catch (error) {
    console.error('更新成绩失败:', error)
    ElMessage.error('更新成绩失败')
  }
}

onMounted(() => {
  fetchLocalSelections()
  fetchCrossSelections()
})
</script>

<style scoped>
.selection-container {
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
</style> 