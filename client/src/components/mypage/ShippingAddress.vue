<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface AddressItem {   // 배송지 타입 정의
  id: number;
  addressName?: string;   // 별칭
  name: string;           // 받는 분 이름
  phone: string;          // 연락처
  isDefault: boolean;     // 기본 배송지 여부
  address: {              // 상세 주소
    zipCode: string;
    basicAddress: string;
    detailAddress: string;
  };
}
const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const addresses = ref<AddressItem[]>([]); // 배송지 리스트 상태

// 사용자 배송지 목록 조회
const fetchAddresses = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${SERVER_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    addresses.value = response.data;  // 조회한 배송지 상태 업데이트
  } catch (error) {
    console.error('배송지 로드 에러:', error);
  }
};

// 전화번호 포맷팅 함수
const formatPhone = (phone: string) => {
  if (!phone) return '';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

// 페이지 진입 시 배송지 목록 로드
onMounted(() => {
  fetchAddresses();
});
</script>

<template>
  <div class="shipping-wrapper">

    <div class="address-grid">
      <div v-if="addresses.length === 0" class="no-data">
        등록된 배송지 정보가 없습니다.
      </div>

      <div v-for="item in addresses" :key="item.id" class="address-card" :class="{ 'default-border': item.isDefault }">
        <div class="card-header">
          <span class="addr-name">{{ item.addressName || '배송지' }}</span>
          <span v-if="item.isDefault" class="default-badge">기본배송지</span>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">받는 분</span>
            <span class="value">{{ item.name }}</span>
          </div>

          <div class="info-row">
            <span class="label">연락처</span>
            <span class="value">{{ formatPhone(item.phone) }}</span>
          </div>

          <div class="info-row">
            <span class="label">주소</span>
            <span class="value">
              <span class="zip">({{ item.address.zipCode }})</span><br />
              {{ item.address.basicAddress }}<br />
              <span class="detail">{{ item.address.detailAddress }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 배송지 페이지 전체 컨테이너 */
.shipping-wrapper {
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* 배송지 카드 */
.address-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.address-card {
  position: relative;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 24px;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.address-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

/* 기본 배송지 카드 강조 */
.default-border {
  border-color: #074CA1;
  background-color: #fcfdff;
}

/* 카드 헤더 영역 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 배송지 이름 */
.addr-name {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

/* 기본 배송지 뱃지 스타일 */
.default-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  background: #074CA1;
  color: #fff;
  border-radius: 20px;
}

/* 카드 바디 영역 */
.card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.5;
}

.info-row .label {
  width: 70px;
  color: #a0a0a0;
  font-weight: 500;
  flex-shrink: 0;
}

.info-row .value {
  flex: 1;
  color: #2d2d2d;
  font-weight: 600;
}

/* 주소 세부 스타일 */
.zip {
  display: inline-block;
  font-size: 13px;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.detail {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-weight: 400;
}

/* 데이터가 없을 경우 */
.no-data {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: #cbd5e1;
  font-size: 16px;
  border: 2px dashed #f1f5f9;
  border-radius: 16px;
}
</style>