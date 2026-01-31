<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const orderData = ref<any>({  // 주문 데이터
  items: [],
  totalProductPrice: 0,
  shippingFee: 0,
  finalOrderPrice: 0
});

const shippingAddress = ref({ // 배송지 정보
  receiver: '',
  phone: '',
  zipCode: '',
  address: '',
  detailAddress: ''
});

// 배송지 자동 입력 함수
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const response = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 200) {
      const user = response.data.user;
      
      // 불러온 정보를 배송지 입력란에 매핑
      shippingAddress.value.receiver = user.name || '';
      shippingAddress.value.phone = user.phone || '';
      
      if (user.address) {
        shippingAddress.value.zipCode = user.address.zipCode || '';
        shippingAddress.value.address = user.address.basicAddress || '';
        shippingAddress.value.detailAddress = user.address.detailAddress || '';
      }
    }
  } catch (error) {
    console.error("사용자 정보를 불러오는데 실패했습니다.", error);
  }
};

// 카카오 주소 검색 로드 함수
const loadDaumPostcode = () => {
  return new Promise<void>((resolve) => {
    if (window.daum && window.daum.Postcode) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

// 주소 찾기 버튼 클릭 시 실행될 함수
const execDaumPostcode = async () => {
  await loadDaumPostcode();
  
  new window.daum.Postcode({
    oncomplete: (data: any) => {
      let fullAddress = data.address;
      let extraAddress = '';

      if (data.userSelectedType === 'R') {
        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
          extraAddress += data.bname;
        }
        if (data.buildingName !== '' && data.apartment === 'Y') {
          extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
      }

      shippingAddress.value.zipCode = data.zonecode;
      shippingAddress.value.address = fullAddress;
      
      const detailInput = document.querySelector('input[placeholder="상세 주소"]') as HTMLInputElement;
      if (detailInput) detailInput.focus();
    },
  }).open();
};

/** 초기 주문 데이터 및 유저 정보 로드 */
onMounted(async() => {
  const savedData = history.state.orderData;
  if (!savedData) {
    alert("잘못된 접근입니다.");
    router.back();
    return;
  }

  try {
    orderData.value = JSON.parse(savedData);
  } catch (e) {
    console.error("데이터 파싱 에러", e);
    router.back();
  }

  await fetchUserProfile();
});

declare global {
  interface Window {
    PortOne?: any;
  }
}

// 포트원 SDK 로드
const loadPortoneSDK = () => {
  return new Promise<void>((resolve) => {
    if (window.PortOne) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.portone.io/v2/browser-sdk.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

/** 결제 및 주문 생성 */
const handlePayment = async () => {
  await loadPortoneSDK();

  if (!shippingAddress.value.receiver || !shippingAddress.value.address || !shippingAddress.value.phone) {
    alert("배송 정보를 모두 입력해주세요.");
    return;
  }

  const PortOne = (window as any).PortOne; 
  if (!PortOne) return;

  try {
    const payment = await PortOne.requestPayment({
      storeId: "store-b00795c4-b4b2-411e-9e43-a58c04ca3e08",
      channelKey: "channel-key-dcf49c11-1eb9-4f79-9deb-a0353724d897",
      paymentId: `ord_${Date.now()}`,
      orderName: "ARDEO-SHOP 주문",
      totalAmount: orderData.value.finalOrderPrice,
      currency: "CURRENCY_KRW",
      payMethod: "CARD",
      customer: {
        fullName: shippingAddress.value.receiver,
        phoneNumber: shippingAddress.value.phone,
        address: {
          addressLine1: shippingAddress.value.address,
          addressLine2: shippingAddress.value.detailAddress,
        },
        zipcode: shippingAddress.value.zipCode,
      },
    });

    if (payment.code !== undefined) {
      alert(`결제 실패: ${payment.message}`);
      return;
    }

    const payload = {
      paymentId: payment.paymentId,
      totalPrice: orderData.value.finalOrderPrice,
      shippingFee: orderData.value.shippingFee,
      shippingAddress: {
        receiver: shippingAddress.value.receiver,
        phone: shippingAddress.value.phone,
        address: shippingAddress.value.address,
        detailAddress: shippingAddress.value.detailAddress,
        zipCode: shippingAddress.value.zipCode
      },
      items: orderData.value.items.map((item: any) => ({
        productId: item.productId._id || item.productId, 
        variantId: item.variantId._id || item.variantId,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        cartItemId: item._id // 장바구니 삭제를 위한 ID
      }))
    };

    const response = await axios.post('http://localhost:5000/api/orders', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });

    if (response.status === 201) {
      alert("주문 및 결제가 완료되었습니다!");
      router.push('/order-success');
    }

  } catch (err: any) {
    console.error("주문 저장 에러 상세:", err.response?.data || err.message);
    alert("결제는 성공했으나 주문 정보 저장에 실패했습니다. 백엔드 로그를 확인하세요.");
  }
};

const getImageUrl = (path: string) => path ? `http://localhost:5000/${path.replace(/\\/g, '/')}` : '/default.png';
</script>

<template>
  <div class="order-page">
    <h2>ORDER</h2>
    
    <div class="order-container">
      <div class="order-left">
        <section class="shipping-section">
          <h3>배송 정보</h3>
          <div class="input-form">
            <div class="input-row">
              <label>받으시는 분</label>
              <input v-model="shippingAddress.receiver" placeholder="이름을 입력하세요" />
            </div>
            
            <div class="input-row">
              <label>연락처</label>
              <input v-model="shippingAddress.phone" placeholder="숫자만 입력하세요" />
            </div>

            <div class="input-row">
              <label>주소</label>
              <div class="address-grid">
                <div class="zip-code-row">
                  <input v-model="shippingAddress.zipCode" placeholder="우편번호" readonly />
                  <button class="sub-btn" @click="execDaumPostcode">주소찾기</button>
                </div>
                <input v-model="shippingAddress.address" placeholder="기본 주소" readonly />
                <input v-model="shippingAddress.detailAddress" placeholder="상세 주소를 입력하세요" />
              </div>
            </div>
          </div>
        </section>

        <section class="items-section">
          <h3>주문 상품 ({{ orderData.items.length }})</h3>
          <div class="item-list">
            <div v-for="item in orderData.items" :key="item._id" class="item-card">
              <img :src="getImageUrl(item.variantId?.images?.thumbnail)" class="thumb" />
              <div class="details">
                <p class="name">{{ item.productId.name.ko }}</p>
                <p class="option">{{ item.variantId.color }} / {{ item.size }}</p>
                <p class="qty-price">{{ item.quantity }}개 | <strong>{{ (item.price * item.quantity).toLocaleString() }}원</strong></p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside class="order-right">
        <div class="summary-sticky">
          <div class="summary-box">
            <h3>결제 금액</h3>
            <div class="summary-row">
              <span>총 상품금액</span>
              <span>{{ orderData.totalProductPrice?.toLocaleString() }}원</span>
            </div>
            <div class="summary-row">
              <span>배송비</span>
              <span>+ {{ orderData.shippingFee.toLocaleString() }}원</span>
            </div>
            <div class="divider"></div>
            <div class="summary-row total">
              <span>최종 결제금액</span>
              <span class="final-price">{{ orderData.finalOrderPrice.toLocaleString() }}원</span>
            </div>
          </div>
          <button class="pay-btn" @click="handlePayment">결제하기</button>
          <button class="back-btn" @click="router.back()">뒤로가기</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* 공통 스타일: 장바구니 페이지와 통일감 부여 */
.order-page {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
  color: #333;
}

h2 {
  font-size: 28px;
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: 50px;
  font-weight: 700;
}

h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 2px solid #1a1a1a;
}

.order-container {
  display: flex;
  gap: 50px;
  align-items: flex-start;
}

.order-left { flex: 1; }
.order-right { width: 380px; position: sticky; top: 100px; }

/* 입력 폼 스타일 */
.input-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-row label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
}

.input-row input {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.input-row input:focus {
  outline: none;
  border-color: #6a8fe7;
}

.address-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.zip-code-row {
  display: flex;
  gap: 10px;
}

.zip-code-row input { width: 120px; }

.sub-btn {
  padding: 0 20px;
  background: #eff6ff;
  color: #2563eb;
  border: 1.5px solid #074CA1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
}

.sub-btn:hover {
  background: #dbeafe;
}

/* 상품 목록 스타일 */
.item-list {
  background: #fdfdfd;
  border-radius: 8px;
}

.item-card {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.thumb {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  background: #f5f5f5;
}

.details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.details .name { font-weight: 600; margin-bottom: 5px; }
.details .option { font-size: 13px; color: #888; margin-bottom: 8px; }
.details .qty-price { font-size: 14px; }

/* 우측 요약박스 스타일 */
.summary-box {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 15px;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 20px 0;
}

.summary-row.total {
  margin-bottom: 0;
  font-weight: 700;
}

.final-price {
  font-size: 24px;
  color: #6a8fe7;
}

/* 버튼 스타일 */
.pay-btn {
  width: 100%;
  height: 60px;
  background: #074CA1;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 700;
  margin-top: 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.pay-btn:hover { background: #063d82; }

.back-btn {
  width: 100%;
  height: 50px;
  background: #eff6ff;
  border: 1px solid #eee;
  color: #666;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  margin-top: 10px;
  cursor: pointer;
}

.back-btn:hover {
  background: #e9e9e9;
  color: #333;
  transform: translateY(-2px);
}
/* 반응형 모바일 */
@media (max-width: 1024px) {
  .order-container { flex-direction: column; }
  .order-right { width: 100%; position: static; }
  .summary-sticky { margin-top: 20px; }
}
</style>