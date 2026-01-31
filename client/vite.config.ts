import { defineConfig } from 'vite' // Vite에서 defineConfig 함수를 가져옴
import vue from '@vitejs/plugin-vue'  // Vue 파일(.vue)을 처리하는 플러그인을 가져옴
import { fileURLToPath, URL } from 'node:url' // ESM 환경에서 경로 계산을 위해 URL → 파일 경로 변환

// Vite 설정을 정의하고 내보냄
export default defineConfig({
  plugins: [vue()], // Vue 개발 환경을 지원

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // 실제 백엔드 서버 주소
        changeOrigin: true,
      }
    }
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // '@'를 src 폴더로 매핑해 경로를 간단하게 사용
    }
  }
})