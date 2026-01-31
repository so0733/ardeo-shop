<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import img1 from '../../assets/mainproduct/uni_img1.png';
import img2 from '../../assets/mainproduct/uni_img2.png';
import img3 from '../../assets/mainproduct/uni_img3.png';
import img4 from '../../assets/mainproduct/uni_img4.png';
import img5 from '../../assets/mainproduct/wm_img5.png';
import img6 from '../../assets/mainproduct/wm_img6.png';

const router = useRouter();

// Women 상품 데이터
const bestProducts = ref([
  {
    id: 1,
    productCode: 'WM01ASMJH001',
    name: '아르데오 시그니처 메리제인 로우 힐',
    originalPrice: 219000,
    imageUrl: img6,
    colors: ['#fffff0'],
    discountRate: 30,
    tag:'BEST'
  },
  {
    id: 2,
    productCode: 'WM01ASBSH001',
    name: '아르데오 시그니처 블랙 스틸레토 힐',
    originalPrice: 219000,
    imageUrl: img5,
    colors: ['#000000'],
    discountRate: 30,
    tag:'BEST'
  },
  {
    id: 3,
    productCode: 'UNI01ASPS001',
    name: '아르데오 시그니처 퓨어 스니커즈',
    originalPrice: 159000,
    imageUrl: img4,
    colors: ['#FFFFFF'],
    discountRate: 20,
    tag:'NEW'
  },
  {
    id: 4,
    productCode: 'UNI01ASTRS001',
    name: '아르데오 시그니처 트레일핏 러닝 스니커즈',
    originalPrice: 99000,
    imageUrl: img1,
    colors: ['#000000','#006400', '#8B4513'],
    discountRate: 20,
    tag:''
  },
  {
    id: 5,
    productCode: 'UNI01ASARS001',
    name: '아르데오 시그니처 액티브 러닝 스니커즈',
    originalPrice: 89000,
    imageUrl: img2,
    colors: ['#9e9e9e'],
    discountRate: 20,
    tag:''
  },
  {
    id: 6,
    productCode: 'UNI01ASDS001',
    name: '아르데오 시그니처 데일리 스니커즈',
    originalPrice: 159000,
    imageUrl: img3,
    colors: ['#1c2a44', '#9e9e9e', '#f1c40f', '#1f3d2b'],
    discountRate: 20,
    tag:''
  },

].map(item => { // 할인율을 적용한 판매가(price) 계산
  const rate = item.discountRate || 20;
  return {
    ...item,
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
      <h1 class="page-title">Ardeo Women’s Best</h1>
      <p class="page-subtitle">지금 가장 사랑받는 여성 슈즈 컬렉션</p>
    </header>

    <div class="product-grid">
      <div v-for="item in bestProducts" :key="item.id" class="product-card" @click="goToDetail(item.productCode)">
        <div class="product-image">
          <img :src="item.imageUrl" :alt="item.name" />

          <div v-if="item.tag" :class="['trend-tag', item.tag.toLowerCase()]">
            {{ item.tag }}
          </div>
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
  padding: 100px 20px;
  background-color: #fff;
}

/* 페이지 헤더 영역 */
.page-header {
  text-align: center;
  margin-bottom: 80px;
}

.sub-title {
  display: block;
  font-size: 13px;
  letter-spacing: 3px;
  color: #b5a393;
  margin-bottom: 10px;
  font-weight: 600;
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

.divider {
  width: 40px;
  height: 1px;
  background-color: #1a1a1a;
  margin: 0 auto 25px;
}

.page-subtitle {
  font-size: 15px;
  color: #888;
  line-height: 1.6;
}

/* 상품 리스트 그리드 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px 30px;
}

.product-card {
  width: 100%;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.product-card:hover {
  opacity: 0.9;
}

/* 상품 이미지 영역 */
.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3.5 / 4.5;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.2s cubic-bezier(0.15, 0, 0.05, 1);
}

.product-card:hover img {
  transform: scale(1.08);
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

.trend-tag.new { 
  background: #f2b84b;
}

/* 상품 정보 영역 */
.product-info {
  text-align: center;
}

/* 컬러 스와치 영역 */
.color-swatches {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.color-swatches span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid #ebebeb;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 400;
  letter-spacing: -0.3px;
}

/* 가격 영역 */
.price-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.discount-rate {
  color: #b5a393;
  font-size: 15px;
  font-weight: 700;
}

.sale-price {
  font-weight: 600;
  font-size: 15px;
  color: #1a1a1a;
}

.origin-price {
  color: #bbb;
  text-decoration: line-through;
  font-size: 13px;
}

/* 반응형 */
@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 15px; }
  .page-title { font-size: 36px; }
}

@media (max-width: 600px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .page-header { margin-bottom: 50px; }
  .page-title { font-size: 28px; }
}
</style>