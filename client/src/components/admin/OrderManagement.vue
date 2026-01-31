<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);           // 주문 목록
const selectedOrder = ref(null);  // 상세 모달에서 선택된 주문

const translateStatus = (status) => { // 주문 상태 한글 변환 함수
  const statusMap = {
    paid: '결제완료',
    shipping: '배송중',
    delivered: '배송완료',
    cancelled: '주문취소'
  };
  return statusMap[status] || status;
};

// 관리자 주문 목록 조회 함수
const fetchOrders = async () => {
  try {
    // 로컬스토리지에서 관리자 토큰 가져오기
    const token = localStorage.getItem('accessToken'); 
    
    if (!token) {
      console.warn("토큰이 없습니다. 로그인 상태를 확인하세요.");
      return;
    }

    // 관리자 전체 주문 목록 API 호출
    const response = await axios.get('http://localhost:5000/api/orders/admin/all', {
      headers: {
        Authorization: `Bearer ${token.trim()}`
      }
    });

    // 주문 목록 상태 업데이트
    if (response.data.success) {
      // 데이터가 없는 경우 빈 배열로 초기화하여 에러 방지
      orders.value = response.data.orders || [];
    }
  } catch (error) {
    console.error("주문 목록 로드 실패:", error.response?.status, error.response?.data);
    if (error.response?.status === 403) {
      alert("관리자 권한이 없거나 토큰이 만료되었습니다.");
    }
  }
};

// 주문 상태 변경 함수
const changeStatus = async (orderId, newStatus) => {
  // 상태 변경 확인
  if (!confirm(`주문 상태를 [${translateStatus(newStatus)}]로 변경하시겠습니까?`)) return;

  try {
    // 토큰 가져오기
    const token = localStorage.getItem('accessToken'); 
    
    // 주문 상태 변경 API 호출
    const response = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, 
      { status: newStatus }, 
      { 
        headers: {
          Authorization: `Bearer ${token?.trim()}`
        }
      }
    );
    
    // 성공 시 목록 다시 조회하기
    if (response.data.success) {
      alert("상태가 변경되었습니다.");
      fetchOrders();
    }
  } catch (error) {
    console.error("상태 변경 실패:", error.response?.data);
    alert(error.response?.data?.message || "변경 실패");
  }
};

// 주문 상세 모달 열기
const openDetail = (order) => {
  selectedOrder.value = order;
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// 연락처 포맷 함수
const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  const matchShort = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
  if (matchShort) {
    return `${matchShort[1]}-${matchShort[2]}-${matchShort[3]}`;
  }

  return phone;
};

// 컴포넌트 마운트 시 실행
onMounted(fetchOrders);
</script>

<template>
  <div class="table-container">
    <div class="table-header-area">
      <h3 class="table-title">주문 관리</h3>
      <span class="table-count">전체 {{ orders.length }}건</span>
      <button class="btn-refresh" @click="fetchOrders">새로고침 🔄</button>
    </div>

    <div class="table-wrapper">
      <table class="order-table">
        <thead>
          <tr>
            <th class="w-date">주문일시</th>
            <th class="w-id">주문번호</th>
            <th class="w-user">주문자 정보</th>
            <th class="w-price">결제금액</th>
            <th class="w-status">상태</th>
            <th class="w-action">관리</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="orders.length === 0" class="state-row">
            <td colspan="6">주문 내역이 없습니다.</td>
          </tr>

          <tr v-for="order in orders" :key="order._id" class="order-row">
            <td class="date-text">{{ formatDate(order.createdAt) }}</td>
            <td class="id-text"><code>{{ order.orderId }}</code></td>
            <td class="user-info">
              <div class="user-wrapper">
                <span class="user-name">{{ order.userId?.name }}</span>
                <span class="user-email">{{ order.userId?.email }}</span>
              </div>
            </td>
            <td class="price-text">
              <span class="final-price">{{ order.totalPrice.toLocaleString() }}원</span>
            </td>
            <td class="text-center">
              <span class="status-badge" :class="order.status">{{ translateStatus(order.status) }}</span>
            </td>
            <td class="action-column">
              <div class="action-wrapper">
                <select 
                  class="status-select"
                  :value="order.status" 
                  @change="changeStatus(order._id, $event.target.value)"
                  :disabled="order.status === 'cancelled'"
                >
                  <option value="paid">결제완료</option>
                  <option value="shipping">배송중</option>
                  <option value="delivered">배송완료</option>
                  <option value="cancelled">주문취소</option>
                </select>
                <button class="btn-detail" @click="openDetail(order)">상세보기</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-content">
        <header class="modal-header">
          <h3>주문 상세 정보</h3>
          <button class="close-x" @click="selectedOrder = null">×</button>
        </header>

        <div class="modal-body">
          <div class="info-section">
            <h4>📦 주문 상품</h4>
            
            <div class="item-list">
              <div v-for="item in selectedOrder.items" :key="item._id" class="order-item">
                <div class="item-info">
                  <p class="item-name">{{ item.productId?.name.ko }}</p>
                  <p class="item-meta">
                    옵션: {{ item.variantId?.color || '색상 없음' }} / 
                    {{ item.size }} | 
                    {{ item.quantity }}개
                  </p>
                </div>
                <div class="item-price">{{ (item.price * item.quantity).toLocaleString() }}원</div>
              </div>
            </div>  
          </div>

          <div class="info-section">
            <h4>🚚 배송지 정보</h4>
            <div class="address-box">
              <p><strong>수령인:</strong> {{ selectedOrder.shippingAddress.receiver }}</p>
              <p><strong>연락처:</strong> {{ formatPhone(selectedOrder.shippingAddress.phone) }}</p>

              <p><strong>주소:</strong> 
                ({{ selectedOrder.shippingAddress.zipCode }}) 
                {{ selectedOrder.shippingAddress.address }} 
                {{ selectedOrder.shippingAddress.detailAddress }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.table-container { 
  width: 100%; 
  font-family: 'Pretendard', -apple-system, sans-serif; 
  padding: 20px;
}

/* 테이블 상단 헤더 영역 */
.table-header-area { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  margin-bottom: 20px; 
}

.table-title { 
  font-size: 20px; 
  font-weight: 700; 
  color: #1e293b; 
  margin: 0; 
}

.table-count { 
  font-size: 14px; 
  color: #64748b; 
  font-weight: 500; 
  flex-grow: 1; 
}

/* 새로고침 버튼 */
.btn-refresh {
  padding: 8px 16px;
  margin-right: 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.btn-refresh:hover { background: #f8fafc; }

/* 테이블 스타일 */
.table-wrapper {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-right: 20px;
}

.order-table { 
  width: 100%; 
  border-collapse: collapse; 
  table-layout: fixed; 
}

.order-table th {
  padding: 14px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-align: center;
}

.order-table td { 
  padding: 16px; 
  font-size: 14px; 
  vertical-align: middle; 
  border-bottom: 1px solid #f1f5f9;
}

/* 테이블 컬럼 너비 */
.w-date { width: 15%; }
.w-id { width: 15%; }
.w-user { width: 25%; }
.w-price { width: 15%; }
.w-status { width: 12%; }
.w-action { width: 18%; }

/* 주문자 정보 스타일 */
.user-wrapper { 
  display: flex; 
  flex-direction: column; 
  gap: 2px; 
}

.user-name { 
  font-weight: 600; 
  color: #1e293b; 
}

.user-email { 
  font-size: 12px; 
  color: #94a3b8; 
}

/* 주문번호 */
.id-text code {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #475569;
}

/* 결제금액 */
.price-text { text-align: right; }

.final-price { 
  font-weight: 700; 
  color: #0f172a; 
  font-size: 15px; 
}

/* 주문 상태 배지 스타일 */
.status-badge { 
  display: inline-flex; 
  padding: 4px 10px; 
  border-radius: 6px; 
  font-size: 11px; 
  font-weight: 700; 
  border: 1px solid transparent;
}
.status-badge.paid {
  background: #eff6ff; 
  color: #2563eb; 
  border-color: #dbeafe; 
}
.status-badge.shipping {
  background: #fefce8; 
  color: #a16207; 
  border-color: #fef08a; 
}
.status-badge.delivered {
  background: #ecfdf5; 
  color: #059669; 
  border-color: #10b98133; 
}
.status-badge.cancelled {
  background: #fff1f2; 
  color: #e11d48; 
  border-color: #f43f5e33; 
}

/* 관리 버튼 & 상태 변경 영역 */
.action-wrapper { 
  display: flex; 
  gap: 8px; 
  align-items: center; 
  justify-content: center; 
}

.status-select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  color: #475569;
  outline: none;
}

.btn-detail {
  padding: 6px 12px;
  background: #eff6ff;
  color: #2563eb;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-detail:hover { background: #dbeafe; }

/* 주문 상세 모달 */
.modal-overlay { 
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%; 
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content { 
  background: white;
  border-radius: 16px;
  width: 550px; 
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}
.modal-header {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.modal-header h3 { 
  margin: 0; 
  font-size: 18px; 
  color: #1e293b; 
}

.close-x {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
}

.modal-body { 
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

/* 모달 내부 정보 */
.info-section h4 {
  margin-bottom: 12px;
  font-size: 15px;
  color: #475569;
  border-left: 4px solid #cbd5e1;
  padding-left: 10px;
}

/* 주문 상품 리스트 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #f1f5f9;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 600;
  margin: 0;
  color: #1e293b;
}

.item-meta {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.item-price {
  font-weight: 700;
  color: #1e293b;
}

/* 배송지 정보 박스 */
.address-box {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}

/* 모달 등장 애니메이션 */
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>