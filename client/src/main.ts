import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 작성하신 라우터 파일을 가져옵니다 (경로 확인 필요)

const app = createApp(App)

// 핵심: 앱에 라우터 플러그인을 설치해야 합니다.
app.use(router) 

app.mount('#app')