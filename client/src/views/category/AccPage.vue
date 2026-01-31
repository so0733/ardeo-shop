<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 액세서리 상품 데이터
const accProducts = ref([]);

// 페이지 진입 시 최상단으로 이동
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="acc-page-container">
    <header class="page-header">
      <h1 class="page-title">Accessories</h1>
      <p class="page-subtitle">아르데오의 감각적인 액세서리 컬렉션을 곧 만나보세요.</p>
    </header>

    <div v-if="accProducts.length > 0" class="product-grid">
      </div>

    <div v-else class="preparing-container">
      <div class="preparing-content">
        <div class="preparing-icon">COMING SOON</div>

        <h2 class="preparing-title">새로운 컬렉션을 준비 중입니다.</h2>
        
        <p class="preparing-text">
          아르데오만의 디테일이 담긴 액세서리 라인이 업데이트될 예정입니다.<br />
          조금만 더 기다려 주세요.
        </p>
        
        <router-link to="/" class="back-home-btn">메인으로 돌아가기</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 페이지 컨테이너 */
.acc-page-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 100px 20px;
  min-height: 80vh;
}

/* 페이지 헤더 */
.page-header {
  text-align: center;
  margin-bottom: 80px;
}

.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  font-weight: 500;
  letter-spacing: -0.5px;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.page-subtitle {
  font-size: 15px;
  color: #888;
}

/* 준비 중 섹션 스타일 */
.preparing-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  border-top: 1px solid #f2f2f2;
}

.preparing-content {
  text-align: center;
}

.preparing-icon {
  font-size: 12px;
  letter-spacing: 4px;
  color: #b5a393;
  margin-bottom: 20px;
  font-weight: 600;
}

.preparing-title {
  font-size: 24px;
  font-weight: 400;
  color: #333;
  margin-bottom: 15px;
}

.preparing-text {
  font-size: 15px;
  line-height: 1.8;
  color: #999;
  margin-bottom: 40px;
}

/* 홈으로 돌아가기 버튼 */
.back-home-btn {
  display: inline-block;
  padding: 15px 40px;
  border: 1px solid #1a1a1a;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.3s ease;
}

.back-home-btn:hover {
  background-color: #074CA1;
  color: #fff;
}

/* 반응형 */
@media (max-width: 600px) {
  .page-title { font-size: 32px; }
  .preparing-title { font-size: 20px; }
}
</style>