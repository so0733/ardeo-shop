<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import img1 from '../../assets/mainproduct/wm_img6.png';
import img2 from '../../assets/mainproduct/wm_img5.png';
import img3 from '../../assets/mainproduct/m_img7.png';

const router = useRouter();

// BEST 상품 데이터
const bestProducts = ref([
  {
    id: 1,
    productCode: 'WM01ASMJH001',
    name: '아르데오 시그니처 메리제인 로우 힐',
    originalPrice: 219000,
    imageUrl: img1,
    colors: ['#fffff0'],
    discountRate: 30,
  },
  {
    id: 2,
    productCode: 'WM01ASBSH001',
    name: '아르데오 시그니처 블랙 스틸레토 힐',
    originalPrice: 219000,
    imageUrl: img2,
    colors: ['#000000'],
    discountRate: 30,
  },
  {
    id: 3,
    productCode: 'M01ASPL001',
    name: '아르데오 시그니처 페니 로퍼',
    originalPrice: 449000,
    imageUrl: img3,
    colors: ['#000000'],
    discountRate: 40,
  }

].map(item => { // 할인율을 적용한 판매가(price) 계산
  const rate = item.discountRate || 20;
  return {
    ...item,
    tag: 'BEST',
    price: item.originalPrice * ((100 - rate) / 100),
  };
}));

// 가격 표시용 포맷 함수
const formatPrice = (value: number) => value.toLocaleString();

// 상품 상세 페이지 이동
const goToDetail = (productCode: string) => {
  if (!productCode) return;
  router.push(`/product/${productCode}`);
};

// 페이지 진입 시 최상단으로 이동
onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="best-page-container">
    <header class="page-header">
      <h1 class="page-title">Ardeo’s Best</h1>
      <p class="page-subtitle">지금 가장 주목받는 아르데오의 베스트 아이템</p>
    </header>

    <div class="product-grid">
      <div v-for="item in bestProducts" :key="item.id" class="product-card" @click="goToDetail(item.productCode)">
        <div class="product-image">
          <img :src="item.imageUrl" :alt="item.name" />
          <div v-if="item.tag" class="trend-tag">{{ item.tag }}</div>
        </div>

        <div class="product-info">
          <div class="color-swatches">
            <span v-for="color in item.colors" :key="color" :style="{ backgroundColor: color }"></span>
          </div>
          
          <p class="product-name">{{ item.name }}</p>
          
          <div class="price-area">
            <span class="sale-price">{{ formatPrice(item.price) }}원</span>
            <span class="origin-price">{{ formatPrice(item.originalPrice) }}원</span>
            <span class="discount-rate">{{ item.discountRate }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 페이지 전체 레이아웃 */
.best-page-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 80px 20px;
}

/* 페이지 헤더 영역 */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

/* 메인 타이틀 */
.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  font-weight: 500;
  letter-spacing: -0.5px;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
}

/* 상품 리스트 그리드 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px 20px;
}

.product-card {
  width: 100%;
  cursor: pointer;
}

/* 상품 이미지 영역 */
.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  margin-bottom: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover img {
  transform: scale(1.05);
}

/* 태그 스타일 */
.trend-tag {
  position: absolute;
  top: 0;
  left: 10px;
  background: #a6917e;
  color: white;
  width: 40px;
  padding: 10px 0 15px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%); /* V자 꼬리 핵심 */
}

/* 상품 정보 영역 */
.product-info {
  text-align: left;
}

/* 컬러 스와치 영역 */
.color-swatches {
  display: flex;
  gap: 5px;
  margin-bottom: 8px;
}

.color-swatches span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.product-name {
  font-size: 15px;
  color: #333;
  margin-bottom: 8px;
}

/* 가격 영역 */
.sale-price { font-weight: 800; font-size: 16px; margin-right: 8px; }
.origin-price { color: #999; text-decoration: line-through; font-size: 14px; margin-right: 5px; }
.discount-rate { color: #e60023; font-size: 14px; font-weight: bold; }

/* 반응형 */
@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .product-grid { grid-template-columns: repeat(1, 1fr); }
  .page-title { font-size: 28px; }
}
</style>