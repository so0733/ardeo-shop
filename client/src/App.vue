<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useUserStore } from './utils/userStore';
import { IoOutlineSearch, IoOutlineBag, IoOutlinePerson, BsChevronBarUp } from '@kalimahapps/vue-icons';  // 아이콘
import axios from 'axios';
import Footer from './views/Footer.vue';

const userStore = useUserStore();
const router = useRouter();

const isMenuOpen = ref(false);      // 마이페이지 드롭다운 상태
const isSearchOpen = ref(false);    // 검색창 활성화 상태
const showTopButton = ref(false);   // 상단 이동 버튼 표시 상태

const cartCount = ref(0);           // 장바구니 물품 수
const searchQuery = ref('');        // 검색어 입력값
const allProducts = ref<any[]>([]); // 전체 상품 목록
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// 로그아웃 처리 함수
const handleLogout = () => {
  userStore.logout();
  isMenuOpen.value = false;
  router.push('/');
};

// 드롭다운 메뉴 토글 열기/닫기
const toggleMenu = () => {  
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 외부 클릭 감지 로직
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  
  // 마이페이지 드롭다운 닫기
  if (isMenuOpen.value && !target.closest('.user-dropdown-container')) {
    isMenuOpen.value = false;
  }
  
  // 검색 드롭다운 닫기
  if (isSearchOpen.value && !target.closest('.user-dropdown-container')) {
    isSearchOpen.value = false;
    searchQuery.value = ''; // 닫을 때 검색어 초기화
  }
};

// 검색 기능
const filteredResults = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return [];
  
  // 상품명(한글/영어)에 검색어가 포함된 상품만 필터링 (최대 7개)
  return allProducts.value
    .filter(p => 
      p.name.ko.toLowerCase().includes(query) || 
      (p.name.en && p.name.en.toLowerCase().includes(query))
    )
    .slice(0, 7); 
});

// 검색창 토글 시 데이터가 없으면 불러오기
const toggleSearch = async () => {
  isSearchOpen.value = !isSearchOpen.value;
  if (isSearchOpen.value && allProducts.value.length === 0) {
    try {
      const response = await axios.get('/api/products');
      allProducts.value = response.data.products;
    } catch (error) {
      console.error("상품 로드 실패", error);
    }
  }
};

// 검색 결과 클릭 시 상세 페이지로 이동
const goToProduct = (productCode: string) => {
  router.push(`/product/${productCode}`);
  searchQuery.value = '';
  isSearchOpen.value = false;
};

// 장바구니 수량 조회 함수
const fetchCartCount = async () => {
  // 로그인이 되어 있지 않으면 0으로 초기화하고 중단
  if (!userStore.isLoggedIn.value) {
    cartCount.value = 0;
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // items 배열의 길이를 세거나, 각 아이템의 quantity 합계를 구함
    const items = response.data.items || [];
    cartCount.value = items.length; // 품목 종류 수

  } catch (error) {
    console.error("장바구니 수량 로드 실패", error);
    cartCount.value = 0;
  }
};

// 로그인 상태가 변할 때마다 수량을 다시 조회
watch(() => userStore.isLoggedIn.value, (newVal) => {
  if (newVal) {
    fetchCartCount();
  } else {
    cartCount.value = 0; // 로그아웃 시 배지 초기화
  }
}, { immediate: true });

// 스크롤 위치 감지 함수
const handleScroll = () => {
  showTopButton.value = window.scrollY > 300; // 300px 이상 스크롤되면 버튼 표시
};

// 최상단으로 이동하는 함수
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 부드럽게 이동
  });
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('cart-updated', fetchCartCount);  // 다른 페이지에서 장바구니 변경 시 자동 갱신
  window.addEventListener('scroll', handleScroll);

  fetchCartCount();   // 장바구니 수량 조회
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('cart-updated', fetchCartCount);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header class="discovery-header">
    <div class="header-inner">
      <div class="logo-area">
        <RouterLink to="/" class="logo-text">ARDEO</RouterLink>
      </div>

      <nav class="category-nav">
        <ul class="category-list">
          <li><RouterLink to="/category/best">BEST</RouterLink></li>
          <li><RouterLink to="/category/women">WOMEN</RouterLink></li>
          <li><RouterLink to="/category/men">MEN</RouterLink></li>
          <li><RouterLink to="/category/acc">ACC</RouterLink></li>
          <li><RouterLink to="/about">BRAND</RouterLink></li>
          <li><RouterLink to="/board">COMMUNITY</RouterLink></li>
        </ul>
      </nav>

      <div class="icon-menu">
        <div class="user-dropdown-container"> 
          <button class="icon-btn" @click="toggleSearch" aria-label="검색">
            <IoOutlineSearch class="icon" />
          </button>
          
          <div v-if="isSearchOpen" class="search-dropdown" @click.stop>
            <div class="serch-input-wrapper">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="상품명을 입력하세요" 
                class="search-bar-input"
                @keyup.esc="isSearchOpen = false"
                ref="searchInput"
                autofocus
              />
            </div>
            
            <ul v-if="filteredResults.length > 0" class="search-results">
              <li v-for="product in filteredResults" :key="product._id" @click="goToProduct(product.productCode)">
                <div class="search-item">
                  <img :src="`${API_BASE_URL}/${product.thumbnail}`" class="search-thumb" alt="상품" />
                  <div class="search-info">
                    <span class="search-name">{{ product.name.ko }}</span>
                    <span class="search-price">{{ product.finalPrice.toLocaleString() }}원</span>
                  </div>
                </div>
              </li>
            </ul>
            
            <div v-else-if="searchQuery" class="no-result">검색 결과가 없습니다.</div>
          </div>
        </div>

        <RouterLink to="/cart" class="icon-btn" aria-label="장바구니">
          <IoOutlineBag class="icon" />
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </RouterLink>

        <div class="user-dropdown-container">
          <button class="icon-btn" @click="toggleMenu" aria-label="마이페이지"> 
            <IoOutlinePerson class="icon" /> 
          </button>
          
          <div v-if="isMenuOpen" class="dropdown-box" @click.stop>
            <template v-if="userStore.isLoggedIn.value">
              <div class="user-info">{{ userStore.userName.value }}님</div>
              
              <div class="admin-badge">
                <span v-if="userStore.isAdmin.value">ADMIN</span>
              </div>
              
              <div class="divider"></div>

              <RouterLink to="/profile" @click="closeMenu">회원정보관리</RouterLink>
              
              <button @click="handleLogout">로그아웃</button>

              <RouterLink v-if="userStore.isAdmin.value" to="/admin" @click="closeMenu" class="admin-link">
                관리자 페이지
              </RouterLink>
            </template>

            <template v-else>
              <RouterLink to="/login" @click="closeMenu">로그인</RouterLink>
              <RouterLink to="/register" @click="closeMenu">회원가입</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="content-container">
    <RouterView />
  </main>

  <Footer />

  <Transition name="fade">
    <button 
      v-if="showTopButton" 
      class="top-button" 
      @click="scrollToTop"
      aria-label="맨 위로 이동"
    >
      <BsChevronBarUp class="top-icon" />
    </button>
  </Transition>

</template>

<style scoped>
/* 헤더 레이아웃 */
.discovery-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-container {
  margin-top: 80px;
}

/* 로고 텍스트 스타일 */
.logo-text {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: transparent;
  text-decoration: none;
  background: linear-gradient(to right, #000000, #6a8fe7); /* 왼쪽에서 오른쪽으로 그라데이션 */
  
  /* 그라데이션이 글자 모양대로 깎이도록 설정 */
  -webkit-background-clip: text; 
  background-clip: text;         
  -webkit-text-fill-color: transparent; /* 글자 내부를 배경색(그라데이션)으로 채움 */

  display: inline-block;
  transition: opacity 0.3s;
}

.logo-text:hover {
  opacity: 0.7;         /* 마우스를 올렸을 때 살짝 투명해지도록 설정 */
}

/* 카테고리 메뉴 목록 */
.category-list {
  display: flex;
  list-style: none;     /* 목록 점 제거 */
  gap: 25px;
  margin: 0;
  padding: 0;
}

/* 카테고리 링크 스타일 */
.category-list li a {
  text-decoration: none;
  color: #000;
  font-size: 15px;
  font-weight: 600;
}

/* 우측 아이콘 메뉴 레이아웃 */
.icon-menu {
  display: flex;
  gap: 8px;             /* 아이콘들 사이의 좁은 간격 */
  align-items: center;
}

/* 아이콘 버튼 공통 스타일 */
.icon-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 아이콘 크기 및 색상 */
.icon {
  width: 24px;
  height: 24px;
  color: #000;
}

/* 검색창 드롭다운 */
.search-dropdown {
  position: absolute;
  top: 55px;
  right: 0;
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  padding: 6px;
  z-index: 1100;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: dropdownSlide 0.3s ease-out;
}

/* 검색 입력창 */
.search-bar-input {
  width: 100%;
  padding: 10px 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  font-weight: 500;
  color: #222;
}

.search-bar-input::placeholder {
  color: #aaa;
  font-weight: 400;
}

/* 검색 결과 리스트 */
.search-results {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
}

.search-results li {
  padding: 12px 8px;
  margin-bottom: 4px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.search-results li:hover {
  background: #f1f4ff;
  padding-left: 12px;
}

/* 검색 결과 아이템 */
.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-thumb {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  background: #f1f1f1;
}

.search-info {
  display: flex;
  flex-direction: column;
}

.search-name {
  font-size: 13px;
  font-weight: 600;
  color: #222;
}

.search-price {
  font-size: 11px;
  color: #074CA1;
  font-weight: bold;
}

.no-result {
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: #999;
}

/* 장바구니 배지 스타일 */
.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff5a5a;
  color: #ffffff;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-weight: bold;
  pointer-events: none;
  border: 2px solid #fff;
}

/* 드롭다운 메뉴의 기준점 */
.user-dropdown-container {
  position: relative;
}

/* 실제 드롭다운 박스 스타일 */
.dropdown-box {
  position: absolute;
  top: 35px;
  right: 0;
  background: white;
  border: 1px solid #eee;
  padding: 10px 0;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  border-radius: 4px;
}

/* 드롭다운 내부 사용자 이름 표시부 */
.user-info {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #074CA1;
}

/* 드롭다운 메뉴 구분선 */
.divider {
  height: 1px;
  background-color: #eee;
  margin: 4px 0;
}

/* 드롭다운 내부 링크 및 버튼 스타일 */
.dropdown-box a, .dropdown-box button {
  padding: 10px 16px;
  text-decoration: none;
  color: #444;
  font-size: 13px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

/* 드롭다운 메뉴 항목 호버 시 효과 */
.dropdown-box a:hover, .dropdown-box button:hover {
  background-color: #f5f5f5;
  transform: none;
}

/* 메인 컨텐츠 영역 */
.content-container {
  margin-top: 80px;
}

/* 관리자 배지 */
.admin-badge {
  padding: 0 16px 8px 16px;
  display: flex;
}

.admin-badge span {
  background-color: #074CA1;
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 5px;
  text-transform: uppercase;
}

.admin-link {
  color: #074CA1 !important;
  font-weight: bold;
}

/* Top 버튼 스타일 */
.top-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.3s ease;
}

.top-button:hover {
  background-color: #6a8fe7;
  color: #fff;
  transform: translateY(-5px);
}

.top-icon {
  width: 24px;
  height: 24px;
}

/* 애니메이션 */
@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>