import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

// 创建axios实例
// main -> B Oracle -> 10.60.254.39:9002
// ccvg -> A SQL Server -> 10.60.254.43:9001
// zh   -> C MySQL -> 10.60.254.38:9004
const service = axios.create({
  baseURL: 'http://10.60.254.38:9004/api', // API 的基础URL
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 登录请求不需要token
    if (config.url === '/accounts/login') {
      return config
    }
    
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      // 将token添加到请求头，使用Bearer格式
      config.headers['Authorization'] = `Bearer ${token}`
      // 同时添加一个自定义的token头
      config.headers['token'] = token
    } else {
      // 如果没有token，使用router进行跳转
      router.push('/login')
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 如果响应数据是数组，直接返回
    if (Array.isArray(response.data)) {
      return response.data
    }
    // 如果响应数据是对象，检查是否有data字段
    if (response.data && typeof response.data === 'object') {
      return response.data
    }
    // 其他情况返回原始响应
    return response.data
  },
  error => {
    console.error('响应错误:', error)
    if (error.response && error.response.status === 401) {
      // token过期或无效，清除token并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else {
      // ElMessage.error(error.response?.data?.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export default service 