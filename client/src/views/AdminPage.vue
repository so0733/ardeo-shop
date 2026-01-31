<script setup lang="ts">
import { ref, computed } from 'vue';
import Products from '../components/admin/Products.vue';
import OrderManagement from '../components/admin/OrderManagement.vue';
import ReviewList from '../components/admin/ReviewList.vue';
import BoardList from '../components/admin/BoardList.vue';

// 활성화된 메뉴 ID
const activeMenu = ref('dashboard');

// 메뉴 구조 정의
const menuItems = [
  { 
    label: '데이터 분석', 
    icon: '📊',
    children: [
      { id: 'dashboard', label: '대시보드' }
    ]
  },
  { 
    label: '상품/재고 관리', 
    icon: '📦',
    children: [
      { id: 'products', label: '상품 목록/관리' }
    ]
  },
  { 
    label: '운영 관리', 
    icon: '⚙️',
    children: [
      { id: 'orders', label: '주문 상태 관리' },
      { id: 'claims', label: '클레임 관리' },
      { id: 'users', label: '고객 관리' }
    ]
  },
  { 
    label: '콘텐츠 관리', 
    icon: '📝',
    children: [
      { id: 'notice', label: '게시판' },
      { id: 'review', label: '상품 리뷰' }
    ]
  }
];

//  메뉴 ID와 표시될 타이틀 매핑
const menuTitles: Record<string, string> = {
  dashboard: '운영 현황 및 데이터 분석',
  products: '상품 및 재고 관리',
  orders: '주문 상태 관리 (결제/배송)',
  claims: '클레임 관리 (취소/반품/교환)',
  users: '고객 관리 (등급/적립금/블랙리스트)',
  notice: '게시글 관리',
  review: '상품 리뷰 관리',
};

// 현재 선택된 메뉴 ID에 따라 화면 타이틀을 동적으로 계산
const currentMenuLabel = computed(() => {
  return menuTitles[activeMenu.value] || '관리 시스템';
});

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// 메뉴 클릭 시 자동으로 사이드바 닫기 (모바일용)
const selectMenu = (id: string) => {
  activeMenu.value = id;
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="admin-layout">
    <button class="mobile-toggle" @click="toggleSidebar">
      {{ isSidebarOpen ? '✕' : '☰' }}
    </button>
    
    <aside class="sidebar" :class="{ 'is-open': isSidebarOpen }">
      <nav class="nav-menu">
        <div v-for="group in menuItems" :key="group.label" class="menu-group">
          <div class="group-header">
            <span class="icon">{{ group.icon }}</span>
            <span class="label">{{ group.label }}</span>
          </div>
          <ul class="sub-menu">
            <li 
              v-for="sub in group.children" 
              :key="sub.id"
              :class="{ active: activeMenu === sub.id }"
              @click="selectMenu(sub.id)"
            >
              {{ sub.label }}
            </li>
          </ul>
        </div>
      </nav>
    </aside>

    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>

    <main class="main-content">
      <header class="content-header">
        <h1>{{ currentMenuLabel }}</h1>
      </header>
      
      <div class="content-body">
        <section v-if="activeMenu === 'dashboard'" class="dashboard-grid">
          <div class="stat-card">매출 분석 (카테고리별)</div>
          <div class="stat-card">재고 회전율</div>
          <div class="stat-card">판매량 순위</div>
          <div class="stat-card">장바구니 이탈률</div>
        </section>

        <div v-else-if="activeMenu === 'products'" class="product-management-container">
          <Products />
        </div>
        
        <div v-else-if="activeMenu === 'orders'" class="product-management-container">
          <OrderManagement />
        </div>
                
        <div v-else-if="activeMenu === 'review'" class="product-management-container">
          <ReviewList />
        </div>
        
        <div v-else-if="activeMenu === 'notice'" class="product-management-container">
          <BoardList />
        </div>

        <div v-else class="data-table-placeholder">
          <p><strong>{{ activeMenu.toUpperCase() }}</strong> 관리 페이지 준비 중입니다.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 스타일 */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fb;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  color: #333;
}

/* 사이드바 스타일 */
.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

/* 내비게이션 메뉴 스타일 */
.nav-menu {
  padding: 16px 12px;
  overflow-y: auto;
}

.menu-group {
  margin-bottom: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px 8px;
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sub-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sub-menu li {
  padding: 10px 12px 10px 40px;
  margin: 2px 0;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-menu li:hover {
  background-color: #f9fafb;
  color: #6a8fe7;
}

.sub-menu li.active {
  background-color: #eef2ff;
  color: #6a8fe7;
  font-weight: 700;
}

/* 메인 콘텐츠 영역 스타일 */
.main-content {
  flex: 1;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.product-management-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 20px;
}

.content-header {
  margin-bottom: 30px;
}

.content-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #111827;
}

/* 대시보드 스타일 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 40px 20px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e5e7eb;
  font-weight: 700;
  color: #6b7280;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #6a8fe7;
}
.form-input, .form-select {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.data-table-placeholder {
  padding: 100px;
  text-align: center;
  background: white;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  color: #9ca3af;
}

/* 유틸리티 */
.text-left { text-align: left !important; }
.text-right { text-align: right !important; }

.mobile-toggle {
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1001;
  background: #6a8fe7;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

@media (max-width: 1024px) {
  .mobile-toggle {
    display: block; /* 버튼 표시 */
  }

  .sidebar {
    position: fixed;
    left: -260px; /* 화면 왼쪽으로 숨김 */
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .sidebar.is-open {
    left: 0; /* 열릴 때 화면으로 들어옴 */
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .main-content {
    padding: 70px 20px 20px; /* 상단 버튼 공간 확보 */
    max-width: 100%;
  }

  .dashboard-grid {
    grid-template-columns: 1fr; /* 모바일에선 한 줄씩 */
  }
}
</style>