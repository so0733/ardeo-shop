import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 배포 환경이면 .env.production의 URL을 사용, 아니면 로컬 주소 사용
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
axios.defaults.withCredentials = true // 쿠키 사용 시 필수

const app = createApp(App)
app.use(router)
app.mount('#app')
app.config.globalProperties.$serverUrl = axios.defaults.baseURL;