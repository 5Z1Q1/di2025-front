import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Students from '../views/Students.vue'
import Courses from '../views/Courses.vue'
import Selections from '../views/Selections.vue'
import CourseSelection from '../views/CourseSelection.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    name: 'Students',
    component: Students,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: { requiresAuth: true }
  },
  {
    path: '/selections',
    name: 'Selections',
    component: Selections,
    meta: { requiresAuth: true }
  },
  {
    path: '/course-selection',
    name: 'CourseSelection',
    component: CourseSelection,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    // 需要登录但未登录，重定向到登录页
    next('/login')
  } else {
    next()
  }
})

export default router
