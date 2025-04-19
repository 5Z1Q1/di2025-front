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
        <el-table-column prop="score" label="成绩" width="80" />
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
import { getAvailableCourses, selectCourse, dropCourse, getStudentSelections, getCrossCollegeCoursesByStudentId } from '../api/selection'
import { getCourse } from '../api/course'
import NavBar from '../components/NavBar.vue'

// 可用课程列表
const availableCourses = ref([])
// 已选课程列表
const selectedCourses = ref([])

// 获取可用课程列表
const fetchAvailableCourses = async () => {
  try {
    const res = await getAvailableCourses()
    console.log('获取到的可用课程数据:', res)
    
    // 确保返回的数据是数组
    if (Array.isArray(res)) {
      availableCourses.value = res.map(course => ({
        courseId: course.courseId,
        courseName: course.courseName || '未知课程',
        college: course.college || '未知学院',
        teacher: course.teacher || '未知教师',
        credit: course.credit || 0,
        capacity: course.capacity || 0,
        hours: course.hours || 0,
        location: course.location || '未知地点',
        shared: course.shared === 'Y'
      }))
    } else {
      console.error('获取可用课程列表失败：响应数据格式错误')
      ElMessage.error('获取可用课程列表失败：数据格式错误')
      availableCourses.value = []
    }
    console.log('处理后的可用课程数据:', availableCourses.value)
  } catch (error) {
    console.error('获取可用课程列表失败:', error)
    ElMessage.error('获取可用课程列表失败')
    availableCourses.value = []
  }
}

// 修改 fetchSelectedCourses 方法，确保正确处理普通选课数据和跨学院选课数据
const fetchSelectedCourses = async () => {
  try {
    console.log('获取已选课程列表...')
    const studentId = localStorage.getItem('username');
    console.log('学号:', studentId)

    // 获取本学院选课数据
    let res = await getStudentSelections(studentId)
    console.log('获取到的本学院选课数据:', res)

    if (typeof res === 'string') {
      try {
        res = JSON.parse(res);
      } catch (error) {
        console.error('本学院选课数据解析失败:', error);
        ElMessage.error('本学院选课数据解析失败');
        return;
      }
    }

    if (!res || !('courseSelections' in res)) {
      console.error('获取本学院选课数据失败：响应数据无效', res);
      ElMessage.error('获取本学院选课数据失败：响应数据无效');
      return;
    }

    const courseSelections = Array.isArray(res.courseSelections) ? res.courseSelections : [];

    // 获取跨学院选课数据
    let crossRes = await getCrossCollegeCoursesByStudentId(studentId);
    console.log('获取到的跨学院选课数据（原始数据）:', crossRes)

    if (typeof crossRes === 'string') {
      try {
        crossRes = JSON.parse(crossRes);
      } catch (error) {
        console.error('跨学院选课数据解析失败:', error);
        ElMessage.error('跨学院选课数据解析失败');
        return;
      }
    }

    console.log('解析后的跨学院选课数据:', crossRes);

    const crossSelections = Array.isArray(crossRes) ? crossRes : [];

    // 合并本学院和跨学院选课数据
    const allSelections = [...courseSelections, ...crossSelections];

    selectedCourses.value = allSelections.map(selection => ({
      courseId: selection.courseId,
      courseName: availableCourses.value.find(course => course.courseId === selection.courseId)?.courseName || '未知课程',
      college: availableCourses.value.find(course => course.courseId === selection.courseId)?.college || '未知学院',
      teacher: availableCourses.value.find(course => course.courseId === selection.courseId)?.teacher || '未知教师',
      credit: parseFloat(availableCourses.value.find(course => course.courseId === selection.courseId)?.credit) || 0,
      score: selection.score || '未评分'
    }));

    console.log('处理后的选课数据:', selectedCourses.value)
  } catch (error) {
    console.error('获取已选课程列表失败:', error)
    ElMessage.error('获取已选课程列表失败')
    selectedCourses.value = []
  }
}

// 判断课程是否已选
const isSelected = (courseId) => {
  return selectedCourses.value.some(course => course.courseId === courseId)
}

// 在 handleSelect 方法中添加页面刷新逻辑
const handleSelect = async (course) => {
  try {
    console.log('开始选课:', course);
    await ElMessageBox.confirm(
      `确定要选择课程 ${course.courseName} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    );
    const studentId = localStorage.getItem('username');
    await selectCourse(studentId, course.courseId);
    ElMessage.success('选课成功');

    // 刷新页面
    window.location.reload();
    
  } catch (error) {
    // if (error !== 'cancel') {
    //   console.error('选课失败:', error);
    //   ElMessage.error('选课失败');
    // }
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
    const studentId = localStorage.getItem('username')?.slice(0, -1);
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

// 确保 fetchAvailableCourses 完成后再调用 fetchSelectedCourses
onMounted(async () => {
  await fetchAvailableCourses();
  await fetchSelectedCourses();
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