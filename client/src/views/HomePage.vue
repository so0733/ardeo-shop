<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import 'vue3-carousel/carousel.css';
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel';

// 캐러셀 이미지 불러오기
import img1 from '../assets/carousel_img1.png';
import img2 from '../assets/carousel_img2.png';
import img3 from '../assets/carousel_img3.png';

// 상품 이미지 불러오기
import img4 from '../assets/mainproduct/uni_img2.png';
import img5 from '../assets/mainproduct/uni_img3.png';
import img6 from '../assets/mainproduct/uni_img4.png';
import img7 from '../assets/mainproduct/wm_img6.png';
import img8 from '../assets/mainproduct/wm_img5.png';
import img9 from '../assets/mainproduct/m_img7.png';

// 서버 URL 환경 변수 가져오기
const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const router = useRouter(); 

// 캐러셀 이미지 목록
const images = ref([
  { id: 1, url: img1, link: '/product/UNI01ASTRS001'},
  { id: 2, url: img2, link: '/product/WM01ASBSH001' },
  { id: 3, url: img3, link: '/product/UNI01ASDS001' },
]);

// 메인 배너 캐러셀 설정 옵션
const config = {
  itemsToShow: 1,              // 한 번에 보여줄 슬라이드 개수
  snapAlign: 'center',         // 중앙 정렬
  autoplay: 5000,              // 5초 간격 자동 재생
  wrapAround: true,            // 무한 루프
  pauseAutoplayOnHover: true,  // 마우스 호버 시 자동 재생 정지
} as const;

// MD's PICK 상품 목록
const mdProducts = ref([
  {
    id: 1,
    productCode: 'UNI01ASTRS001',
    name: '아르데오 시그니처 액티브 러닝 스니커즈',
    originalPrice: 89000,
    imageUrl: img4,
    colors: ['#9e9e9e'],
  },
  {
    id: 2,
    productCode: 'UNI01ASDS001',
    name: '아르데오 시그니처 데일리 스니커즈',
    originalPrice: 159000,
    imageUrl: img5,
    colors: ['#1c2a44', '#9e9e9e', '#f1c40f', '#1f3d2b'],
  },
  {
    id: 3,
    productCode: 'UNI01ASPS001',
    name: '아르데오 시그니처 퓨어 스니커즈',
    originalPrice: 159000,
    imageUrl: img6,
    colors: ['#ffffff'],
  },
].map(item => ({
  ...item,
  tag: 'MD PICK',                         // 상품 태그
  discountRate: 20,                       // 할인율 (%)
  price: item.originalPrice * 0.8,        // 할인 적용가
})));

// WEEKLY BEST 상품
const weeklyProducts = ref([
  {
    id: 4,
    productCode: 'WM01ASMJH001',
    name: '아르데오 시그니처 메리제인 로우 힐',
    originalPrice: 219000,
    imageUrl: img7,
    colors: ['#fffff0'],
    discountRate: 30,
  },
  {
    id: 5,
    productCode: 'WM01ASBSH001',
    name: '아르데오 시그니처 블랙 스틸레토 힐',
    originalPrice: 219000,
    imageUrl: img8,
    colors: ['#000000'],
    discountRate: 30,
  },
  {
    id: 6,
    productCode: 'M01ASPL001',
    name: '아르데오 시그니처 페니 로퍼',
    originalPrice: 449000,
    imageUrl: img9,
    colors: ['#000000'],
    discountRate: 40,
  }
].map(item => {
  const rate = item.discountRate || 20;
  return {
    ...item,
    tag: 'BEST',                                      // WEEKLY BEST 태그
    discountRate: rate,                               // 할인율 (%)
    price: item.originalPrice * ((100 - rate) / 100), // 할인 적용가
  };
}));

// 가격 숫자를 천 단위 콤마 형식으로 변환
const formatPrice = (value: number) => value.toLocaleString();

// 페이지 이동함수
const goToDetail = (productCode: string) => {
  if (!productCode) return;
  router.push(`/product/${productCode}`);
};
const goToEventPage = () => {
  router.push('/benefit');
};
</script>

<template>
  <div class="main-container">
    <div class="carousel-section">
      <Carousel v-bind="config">
        <Slide v-for="image in images" :key="image.id">
          <div class="carousel__item" @click="router.push(image.link)">
            <img :src="image.url" alt="carousel-image" />
          </div>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>

    <div class="main-text">
      <h2>MD's PICK!</h2>
    </div>

    <div class="product-grid">
      <div v-for="item in mdProducts" :key="item.id" class="product-card" @click="goToDetail(item.productCode)">
        <div class="product-image">
          <img :src="`${SERVER_URL}/${item.imageUrl}`" :alt="item.name" />
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
    
    <div class="benefit-banner" @click="goToEventPage">
      <div class="banner-content">
        <p class="banner-title"><strong>가입만 해도 즉시 10% 할인 쿠폰 지급!</strong></p>
        <div class="coupon-icon">
          <span class="coupon-label">지금 가입하면 바로!</span>
          <span class="coupon-text">COUPON</span>
        </div>
      </div>
    </div>

    <div class="main-text">
      <h2>WEEKLY BEST</h2>
    </div>
    
    <div class="product-grid">
      <div v-for="item in weeklyProducts" :key="item.id" class="product-card" @click="goToDetail(item.productCode)">
        <div class="product-image">
          <img :src="`${SERVER_URL}/${item.imageUrl}`" :alt="item.name" />
          <div v-if="item.tag" class="trend-besttag">{{ item.tag }}</div>
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
    
    <div class="video-section">
      <div class="video-container">
        <video src="../assets/Ardeo_Video.mp4" autoplay muted loop playsinline></video>
      </div>
      
      <div class="brand-trust-content">
        <div class="trust-header">
          <span class="trust-badge">OUR PHILOSOPHY</span>
          <h2>본질에 집중해 완성한<br/>완벽한 한 걸음</h2>
          <p class="trust-sub-desc">단순한 신발 그 이상의 가치를 위해, 아르데오는 타협하지 않는 공정으로 신뢰를 쌓아갑니다.</p>
        </div>
        
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-num-box">01</div>
            <div class="trust-text">
              <h4>Handmade Craft</h4>
              <p>수십 년 경력의 장인들이 손으로 완성한 디테일, 신을수록 느껴지는 차이를 경험하세요.</p>
            </div>
          </div>
          
          <div class="trust-item">
            <div class="trust-num-box">02</div>
            <div class="trust-text">
              <h4>Premium Leather</h4>
              <p>엄격하게 선별된 최상위 등급의 가죽만을 사용하여 고급스러운 광택과 질감을 전달합니다.</p>
            </div>
          </div>
          
          <div class="trust-item">
            <div class="trust-num-box">03</div>
            <div class="trust-text">
              <h4>Ergonomic Design</h4>
              <p>인체공학적 설계를 바탕으로 발의 피로도를 최소화하여 하루 종일 최상의 컨디션을 유지합니다.</p>
            </div>
          </div>
          
          <div class="trust-item">
            <div class="trust-num-box">04</div>
            <div class="trust-text">
              <h4>Brand Loyalty</h4>
              <p>85%의 재구매율이 증명하는 품질. 한 번의 선택이 평생의 인연이 되는 브랜드가 되겠습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 메인 레이아웃 */
.main-container {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

/* Carousel 스타일 */
.carousel-section {
  width: 100%;
}

/* 슬라이더 내부 간격 */
.carousel__item {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* 슬라이더 이미지 스타일 */
.carousel__item img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 10px;
}

/* 좌/우 네비게이션 버튼 스타일 */
:deep(.carousel__prev),
:deep(.carousel__next) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 0 20px;
  backdrop-filter: blur(5px);
}

/* 네비게이션 버튼 hover 효과 */
:deep(.carousel__prev:hover),
:deep(.carousel__next:hover) {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* 하단 페이지네이션(bar) 스타일 */
:deep(.carousel__pagination) {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

:deep(.carousel__pagination-button) {
  width: 60px; /* 전체 막대기 길이 */
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3); /* 배경색 */
  border-radius: 3px;
  overflow: hidden; /* 내부 차오르는 막대기를 위해 필수 */
  position: relative;
}

/* 자동 재생 진행 상태를 표현하는 내부 바 */
:deep(.carousel__pagination-button::after) {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0; /* 처음엔 0 */
  background-color: #fff; /* 채워질 색상 */
}

/* 활성화된 버튼의 애니메이션 설정 */
:deep(.carousel__pagination-button--active::after) {
  /* 5초 동안 왼쪽에서 오른쪽으로 차오름 */
  animation: progress 5s linear forwards;
}

/* 캐러셀에 마우스를 올리면 애니메이션도 일시정지 */
.carousel-section:hover :deep(.carousel__pagination-button--active::after) {
  animation-play-state: paused;
}

/* 진행 바 애니메이션 */
@keyframes progress {
  from { width: 0; }
  to { width: 100%; }
}

/* 메인 텍스트 영역 */
.main-text {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.5px;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 40px;
  
}

/* 상품 그리드 레이아웃 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 60px;
}

/* 개별 카드 */
.product-card {
  width: 100%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* 이미지 영역 */
.product-image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4; /* 세로가 긴 이미지 비율 */
  overflow: hidden;
  margin-bottom: 15px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.3s ease;
}

.product-card:hover img {
  transform: scale(1.08);
  filter: brightness(0.9);
}

/* 트렌드 픽  태그 */
.trend-tag {
  position: absolute;
  top: 15px;
  right: -30px;
  background-color: #a6917e;
  color: white;
  font-size: 13px;
  font-weight: bold;
  line-height: 24px;
  padding: 4px 35px;
  transform: rotate(45deg);
}

.trend-besttag {
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

/* 정보 영역 */
.product-info {
  text-align: left;
}

/* 컬러 동그라미 */
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
  line-height: 1.4;
}

.price-area {
  margin-bottom: 5px;
}

.sale-price {
  font-weight: 800;
  font-size: 16px;
  margin-right: 8px;
}

.origin-price {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
  margin-right: 5px;
}

.discount-rate {
  color: #e60023;
  font-size: 14px;
  font-weight: bold;
}

/* 반응형: 모바일에서는 2열로 */
@media (max-width: 1024px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}

/* 배너 전체 컨테이너 */
.benefit-banner {
--banner-bg: #1a1a1a; 
  width: 100vw;           /* 화면 전체 너비 */
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;    /* 부모 컨테이너 중앙에서 왼쪽 끝으로 이동 */
  margin-right: -50vw;
  height: 160px;         /* 너비가 넓어지므로 높이를 살짝 키워주면 더 시원해 보입니다 */
  background-color: var(--banner-bg);
  margin-top: 80px;      /* 위아래 간격 확보 */
  margin-bottom: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;      /* 내부 요소 튀어나옴 방지 */
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
  max-width: 1300px;     /* 콘텐츠는 다시 메인 컨테이너 너비에 맞춤 */
  padding: 0 40px;
  justify-content: center; /* 중앙 정렬 */
}

/* 왼쪽 텍스트 */
.banner-title {
  color: #ffffff;
  font-size: 28px;       /* 텍스트 크기 상향 */
  letter-spacing: -1px;
  white-space: nowrap;   /* 줄바꿈 방지 */
}

.banner-title strong {
  font-weight: 700;
}

.benefit-banner:hover .coupon-icon {
  transform: scale(1.05) rotate(-2deg);
  transition: transform 0.3s ease;
}

/* 오른쪽 쿠폰 아이콘 (흰색 박스 부분) */
.coupon-icon {
  background-color: #fff;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 140px;
}

/* 쿠폰 특유의 양옆 반원 홈 파기 (선택 사항) */
.coupon-icon::before,
.coupon-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: #1a1a1a; /* 배경색과 동일하게 */
  border-radius: 50%;
  transform: translateY(-50%);
}
.coupon-icon::before { left: -6px; }
.coupon-icon::after { right: -6px; }

.coupon-label {
  font-size: 10px;
  font-weight: bold;
  color: #e7c26a;
  margin-bottom: 2px;
}

.coupon-text {
  font-size: 16px;
  font-weight: 800;
  color: #000;
}

/* 반응형 대응 */
@media (max-width: 768px) {
  .banner-title { font-size: 16px; }
  .coupon-icon { display: none; } /* 모바일에서 너무 좁으면 쿠폰 숨김 */
}

/* 영상 홍보 섹션 스타일 */
.video-section {
  display: flex;
  align-items: center;
  gap: 50px;
  margin: 100px 0;
  padding: 0 20px;
}

.video-container {
  flex: 0 0 400px;
  position: relative;
  aspect-ratio: 9 / 16; /* 1080x1920 비율 유지 */
  max-height: 700px;
  overflow: hidden;
  border-radius: 12px;
  background-color: #eee;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 반응형: 태블릿/모바일에서는 위아래로 배치 */
@media (max-width: 1024px) {
  .video-section {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }
}

/* 영상 홍보 섹션 보완 */
.video-section {
  display: flex;
  align-items: center;
  gap: 80px; /* 간격을 좀 더 넓혀 시원하게 배치 */
  margin: 120px 0;
  padding: 0 40px;
}

/* 브랜드 신뢰 섹션 전체 */
.brand-trust-content {
  flex: 1;
  padding: 40px 0;
}

/* 상단 헤더 영역 */
.trust-header {
  margin-bottom: 80px;
}

.trust-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  color: #6a8fe7;
  letter-spacing: 2px;
  margin-bottom: 20px;
  position: relative;
  padding-left: 40px;
}

/* 배지 옆의 작은 가로선 */
.trust-badge::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 30px;
  height: 1px;
  background-color: #6a8fe7;
}

.trust-header h2 {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  color: #111;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.trust-sub-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

/* 그리드 레이아웃 */
.trust-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 60px 40px;
}

.trust-item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee; /* 하단 라인으로 구분감 추가 */
  transition: all 0.3s ease;
}

/* 호버 시 살짝 위로 올라가는 효과 */
.trust-item:hover {
  transform: translateY(-10px);
  border-bottom: 1px solid #6a8fe7;
}

/* 숫자 디자인 */
.trust-num-box {
  font-family: 'Playfair Display', serif; /* 세리프체 권장 */
  font-size: 32px;
  font-weight: 700;
  color: #e5e5e5;
  line-height: 1;
  transition: color 0.3s ease;
}

.trust-item:hover .trust-num-box {
  color: #6a8fe7;
}

.trust-text h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #222;
}

.trust-text p {
  font-size: 15px;
  color: #777;
  line-height: 1.7;
  word-break: keep-all; /* 한글 줄바꿈 예쁘게 */
}

/* 반응형 처리 */
@media (max-width: 1024px) {
  .trust-header {
    text-align: center;
    margin-bottom: 50px;
  }
  .trust-badge { padding-left: 0; }
  .trust-badge::before { display: none; }
  
  .trust-header h2 { font-size: 32px; }
  
  .trust-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .trust-item {
    text-align: center;
    align-items: center;
  }
}
</style>