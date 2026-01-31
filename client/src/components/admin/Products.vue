<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductTable from './ProductTable.vue';

const products = ref([]);       // 서버에서 가져온 상품 목록
const isLoading = ref(false);   // 로딩 상태 표시

// 전체 상품 목록 조회
const fetchProducts = async () => {
  isLoading.value = true;
  try {
   const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    const response = await axios.get('http://localhost:5000/api/products/', {
      headers: { Authorization: `Bearer ${token}` }
    });

    products.value = response.data.products || [];
  } catch (error) {
    console.error('목록 조회 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 컴포넌트 마운트 시 상품 목록 조회
onMounted(() => {
  fetchProducts();
});

const isModalOpen = ref(false);       // 모달 상태

const availableSizes = Array.from(    // 선택 가능한 사이즈 목록 (220 ~ 295, 5 단위)
  { length: ((295 - 220) / 5) + 1 },
  (_, i) => String(220 + i * 5)
);

// 상품 초기 상태 생성 함수
const getInitialProductData = () => ({
  name: { ko: '', en: '' },
  productCode: '',
  category: 'Sneakers',
  basePrice: 0,
  discountRate: 0,
  material: '',
  heelHeight: '',
  origin: '대한민국',
  gender: 'Unisex',
  careInstructions: '',               // 취급 주의사항
  status: '판매중',
  thumbnail: null as File | null,     // 공통 썸네일 파일
  thumbPreview: '',                   // 썸네일 미리보기 URL
  gallery: [] as File[],              // 공통 갤러리 이미지
  galleryPreviews: [] as string[]     // 갤러리 미리보기 URL
});

// 상품 데이터 반응형 객체
const productData = reactive(getInitialProductData());

// 상품 옵션 관리
const variants = ref([createEmptyVariant()]);

// 빈 variant 생성 함수
function createEmptyVariant() {
  return {
    variantCode: '', 
    color: '',
    sizes: [] as { size: string, stockQuantity: number }[]  // 사이즈별 재고
  };
}

// 최종 판매가 계산 (할인 적용)
const formattedFinalPrice = computed(() => {
  const final = Math.floor((productData.basePrice * (1 - productData.discountRate / 100)) / 10) * 10;
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(final);
});

// 공통 썸네일 업로드
const handleCommonThumbnail = (event: any) => {
  const file = event.target.files[0];
  if (file) {
    productData.thumbnail = file;
    productData.thumbPreview = URL.createObjectURL(file); // 미리보기 생성
  }
};

// 공통 갤러리 업로드
const handleCommonGallery = (event: any) => {
  const files = Array.from(event.target.files) as File[];
  productData.gallery.push(...files);
  productData.galleryPreviews.push(...files.map(f => URL.createObjectURL(f)));
};

// 공통 썸네일 제거
const removeCommonThumbnail = () => {
  if (productData.thumbPreview) URL.revokeObjectURL(productData.thumbPreview);
  productData.thumbnail = null;
  productData.thumbPreview = '';
};

// 공통 갤러리 이미지 제거
const removeCommonGallery = (gi: number) => {
  if (productData.galleryPreviews[gi]) URL.revokeObjectURL(productData.galleryPreviews[gi]);
  productData.gallery.splice(gi, 1);
  productData.galleryPreviews.splice(gi, 1);
};

// variant 옵션 추가
const addVariant = () => variants.value.push(createEmptyVariant());

// variant 옵션 삭제 (최소 1개 유지)
const removeVariant = (i: number) => {
  if (variants.value.length > 1) variants.value.splice(i, 1);
};

// 사이즈 선택/해제 토글
const toggleSize = (vi: number, size: string) => {
  const variant = variants.value[vi];
  if (!variant) return;
  const idx = variant.sizes.findIndex(s => s.size === size);
  idx > -1 ? variant.sizes.splice(idx, 1) : variant.sizes.push({ size, stockQuantity: 100 }); // 기본값 100개 설정 편리성
};

// 사이즈 선택 여부 확인
const isSizeSelected = (vi: number, size: string) => {
  return variants.value[vi]?.sizes.some(s => s.size === size) || false;
};

// 모달 닫기
const closeModal = () => { isModalOpen.value = false; };

const handleCancel = () => {  // 취소 버튼
  resetForm();
  closeModal();
};

const resetForm = () => {     // 폼 전체 초기화
  // 썸네일 미리보기 메모리 해제
  if (productData.thumbPreview) URL.revokeObjectURL(productData.thumbPreview);
  
  // 갤러리 미리보기 메모리 해제
  productData.galleryPreviews.forEach(url => URL.revokeObjectURL(url));
  
  // 초기화
  Object.assign(productData, getInitialProductData());
  variants.value = [createEmptyVariant()];
};

// 상품 등록 처리 함수
const submitProduct = async () => {
  if (!productData.productCode || !productData.name.ko) {
    alert('상품 코드와 한국어 상품명은 필수입니다.');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    
    // 서버에 보낼 데이터 구조
    const rawData = {
      productData: {
        name: productData.name,
        productCode: productData.productCode,
        category: productData.category,
        basePrice: productData.basePrice,
        discountRate: productData.discountRate,
        material: productData.material,
        heelHeight: productData.heelHeight,
        origin: productData.origin,
        gender: productData.gender,
        careInstructions: productData.careInstructions,
        status: productData.status
      },
      variants: variants.value.map(v => ({
        variantCode: v.variantCode,
        color: v.color,
        sizes: v.sizes
      }))
    };

    formData.append('data', JSON.stringify(rawData));

    // 공통 썸네일 첨부
    if (productData.thumbnail) {
      formData.append('common_thumb', productData.thumbnail);
    }

    // 공통 갤러리 첨부
    productData.gallery.forEach(file => {
      formData.append('common_gallery', file);
    });

    // 서버 전송
    const response = await axios.post('http://localhost:5000/api/products/complex', formData, { 
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('상품 등록 성공 정보:', response.data); 
    alert('상품이 성공적으로 등록되었습니다.');
    
    // 등록 후 목록 새로고침 및 폼 초기화
    fetchProducts();
    resetForm();
    isModalOpen.value = false;

  } catch (e: any) {
    console.error('등록 실패:', e.response?.data);
    const errorMsg = e.response?.data?.error || e.response?.data?.message || '알 수 없는 에러';
    alert('등록 실패: ' + errorMsg);
  }
};
</script>

<template>
  <div class="products-container">
    <button class="add-btn-main" @click="isModalOpen = true">상품 등록</button>

    <div>
      <ProductTable :products="products" :loading="isLoading" @refresh="fetchProducts"/>
    </div>

    <Transition name="modal-fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <div class="header-title">
              <h3>상품 등록</h3>
            </div>
            <button class="circle-remove-btn" @click="closeModal">×</button>
          </div>

          <div class="modal-body">
            <section class="glass-section">
              <div class="section-title">📦 기본 정보</div>
              
              <div class="grid-row-two">
                <div class="floating-group">
                  <input v-model="productData.name.ko" class="modern-input" placeholder=" " required />
                  <label>상품명 (KO)</label>
                </div>
                <div class="floating-group">
                  <input v-model="productData.name.en" class="modern-input" placeholder=" " />
                  <label>상품명 (EN)</label>
                </div>
                <div class="floating-group">
                  <input v-model="productData.productCode" class="modern-input" placeholder=" " />
                  <label>상품코드</label>
                </div>
                <div class="floating-group">
                  <select v-model="productData.category" class="modern-input select-input">
                    <option value="Sneakers">Sneakers</option>
                    <option value="Heels">Heels</option>
                    <option value="Loafer">Loafer</option>
                  </select>
                  <label>카테고리</label>
                </div>
              </div>

              <div class="grid-row-three">
                <div class="floating-group">
                  <input v-model.number="productData.basePrice" type="number" class="modern-input" placeholder=" " />
                  <label>정가 (₩)</label>
                </div>
                <div class="floating-group">
                  <input v-model.number="productData.discountRate" type="number" class="modern-input" placeholder=" " />
                  <label>할인율 (%)</label>
                </div>
                <div class="highlight-field">
                  <span class="static-label">최종 판매가</span>
                  <div class="price-display">{{ formattedFinalPrice }}</div>
                </div>
              </div>

              <div class="grid-row-two" style="margin-top: 10px;">
                <div class="floating-group">
                  <input v-model="productData.material" class="modern-input" placeholder=" " />
                  <label>제품 소재</label>
                </div>
                <div class="floating-group unit-wrapper">
                  <input v-model.number="productData.heelHeight" type="number" step="0.5" min="0" class="modern-input unit-input" placeholder=" " />
                  <label>굽높이</label>
                  <span class="unit-text">cm</span>
                </div>
              </div>
              
              <div class="grid-row-two">
                 <div class="floating-group">
                    <select v-model="productData.gender" class="modern-input select-input">
                      <option value="Unisex">남녀공용 (Unisex)</option>
                      <option value="Men">남성 (Men)</option>
                      <option value="Women">여성 (Women)</option>
                    </select>
                    <label>성별</label>
                </div>
                <div class="floating-group">
                  <input v-model="productData.origin" class="modern-input" placeholder=" " />
                  <label>원산지</label>
                </div>
              </div>

              <div class="floating-group" style="margin-top: 10px;">
                <textarea v-model="productData.careInstructions" class="modern-textarea" placeholder=" "></textarea>
                <label>상품설명 및 관리법</label>
              </div>

              <div class="section-title">🖼️ 상품 이미지</div>
              <div class="image-upload-container">
                <div v-if="productData.thumbPreview" class="preview-item">
                  <img :src="productData.thumbPreview" />
                  <button class="remove-img-btn" @click="removeCommonThumbnail">×</button>
                  <div class="img-badge">대표</div>
                </div>
                <label v-else class="image-add-label">
                  <input type="file" hidden @change="handleCommonThumbnail" accept="image/*" />
                  <div class="upload-placeholder"><span>+</span><span>대표</span></div>
                </label>

                <div v-for="(img, gIndex) in productData.galleryPreviews" :key="gIndex" class="preview-item">
                  <img :src="img" />
                  <button class="remove-img-btn" @click="removeCommonGallery(gIndex)">×</button>
                </div>
                <label class="image-add-label">
                  <input type="file" hidden multiple @change="handleCommonGallery" accept="image/*" />
                  <div class="upload-placeholder"><span>+</span><span>갤러리</span></div>
                </label>
              </div>
            </section>

            <div class="section-header-flex">
              <div class="section-title">🎨 색상 및 재고 설정</div>
              <button class="pill-add-btn" @click="addVariant">+ 옵션 추가</button>
            </div>

            <TransitionGroup name="list">
              <div v-for="(variant, vIndex) in variants" :key="vIndex" class="option-card">
                <div class="option-card-header">
                  <input v-model="variant.variantCode" class="color-name-input" style="width: 150px;" placeholder="상품코드+색상" />
                  <input v-model="variant.color" class="color-name-input" placeholder="색상명" />
                  <button v-if="variants.length > 1" class="circle-remove-btn" @click="removeVariant(vIndex)">×</button>
                </div>

                <div class="size-chip-grid">
                  <label v-for="size in availableSizes" :key="size" class="size-chip" :class="{ 'is-selected': isSizeSelected(vIndex, size) }">
                    <input type="checkbox" :value="size" @change="toggleSize(vIndex, size)" />
                    {{ size }}
                  </label>
                </div>

                <div v-if="variant.sizes.length > 0" class="stock-input-grid">
                  <div v-for="(s, sIndex) in variant.sizes" :key="sIndex" class="stock-item">
                    <span class="stock-size-label">{{ s.size }}</span>
                    <input v-model.number="s.stockQuantity" type="number" min="0" />
                    <span class="stock-unit">개</span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
          
          <div class="modal-actions">
            <button class="btn-secondary" @click="handleCancel">취소</button>
            <button class="btn-primary" @click="submitProduct">상품 등록 완료</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 스타일 */
.products-container {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  padding: 20px;
}

/* 상품 등록 버튼 */
.add-btn-main {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
  padding: 12px 24px;
  margin-bottom: 10px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.add-btn-main:hover {
  background: #dbeafe;
  transform: translateY(-2px);
}

/* 모달 레이아웃 스타일 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
}

.modal-content {
  width: 720px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 24px 32px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #0f172a;
  font-weight: 800;
}

.modal-body {
  padding: 32px;
  overflow-y: auto;
  scrollbar-width: thin;
  background: #f8fafc;
}

/* 카드형 섹션 */
.glass-section {
  margin-bottom: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #edf2f7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-weight: 800;
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

/* 그리드 레이아웃 */
.grid-row-three {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 16px;
  align-items: end;
}

.grid-row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
/* 플로팅 라벨 입력 필드 */
.floating-group {
  position: relative;
  margin-bottom: 24px;
  width: 100%;
}

.floating-group label {
  position: absolute;
  left: 14px;
  top: 12px;
  color: #94a3b8;
  pointer-events: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
}

/* 공통 인풋 스타일 */
.modern-input, .modern-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #fff;
  color: #0f172a;
  transition: all 0.2s;
}

.modern-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  outline: none;
}

.modern-input:focus ~ label,
.modern-input:not(:placeholder-shown) ~ label {
  transform: translateY(-26px) scale(0.85);
  left: 10px;
  background: #fff;
  padding: 0 6px;
  color: #2563eb;
  font-weight: 700;
  z-index: 10;
}

.modern-textarea { resize: none; min-height: 80px; }
.modern-textarea:focus ~ label,
.modern-textarea:not(:placeholder-shown) ~ label {
  transform: translateY(-26px) scale(0.85);
  left: 10px;
  background: #fff;
  padding: 0 6px;
  color: #2563eb;
  font-weight: 700;
}

/* 최종 가격 표시 영역 */
.highlight-field {
  position: relative; 
  margin-bottom: 23px;
}
.highlight-field .price-display {
  height: 48px;
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 1.1rem;
  color: #ef4444;
  background: #fef2f2;
  padding: 0 16px;
  border-radius: 12px;
  border: 1.5px solid #fee2e2;
  box-sizing: border-box;
}

.static-label {
  position: absolute;
  transform: translateY(-24px) scale(0.85);
  left: 10px;
  padding: 0 6px;
  background: #fff;
  color: #64748b;
  font-weight: 700;
}

/* 굽높이 단위 표시 스타일 */
.unit-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.unit-input {
  padding-right: 45px !important;
  text-align: right;
}

.unit-text {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 700;
  pointer-events: none;
  font-size: 0.95rem;
}

.unit-input::-webkit-outer-spin-button,
.unit-input::-webkit-inner-spin-button {
  margin-right: 25px;
}

.unit-input:focus ~ .unit-text,
.unit-input:not(:placeholder-shown) ~ .unit-text {
  color: #2563eb;
}

/* 옵션(Variant) 카드 */
.option-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.option-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.color-name-input {
  flex: 1;
  border: none;
  border-bottom: 2px solid #e2e8f0;
  padding: 8px 4px;
  font-weight: 800;
  font-size: 1.1rem;
  background: transparent;
  transition: 0.2s;
}
.color-name-input:focus {
  border-bottom-color: #2563eb;
  outline: none;
}

/* 이미지 업로드 영역 */
.image-upload-container {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.preview-item {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.7);
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}
.remove-img-btn:hover { background: #ef4444; }

.img-badge {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  padding: 4px 0;
}

.image-add-label {
  width: 110px;
  height: 110px;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
  color: #64748b;
}
.image-add-label:hover {
  border-color: #2563eb;
  background: #eff6ff;
  color: #2563eb;
}

.upload-placeholder span:first-child { font-size: 24px; font-weight: 300; }
.upload-placeholder span:last-child { font-size: 12px; font-weight: 700; }

/* 사이즈 선택 칩 */
.size-selector-label {
  font-size: 0.95rem;
  font-weight: 800;
  color: #334155;
  margin: 20px 0 12px 0;
}

.size-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.size-chip {
  padding: 10px 18px;
  border-radius: 12px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: #475569;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.size-chip:hover { border-color: #cbd5e1; background: #f8fafc; }

.size-chip.is-selected {
  background: #074CA1;
  color: #fff;
  border-color: #074CA1;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
  transform: translateY(-2px);
}

.size-chip input { display: none; }

/* 재고 수량 입력 그리드 */
.stock-input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;
}

.stock-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  transition: 0.2s;
}

.stock-item:focus-within {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stock-size-label { font-weight: 800; font-size: 0.85rem; color: #2563eb; min-width: 32px; }

.stock-item input {
  border: none;
  background: transparent;
  width: 100%;
  text-align: right;
  font-weight: 700;
  font-size: 1rem;
  color: #0f172a;
  outline: none;
}

.stock-unit { font-size: 0.85rem; font-weight: 700; color: #94a3b8; }

/* 공통 버튼 */
.pill-add-btn {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  border: 1.5px solid #074CA1;
  padding: 8px 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.2s;
}
.pill-add-btn:hover { 
  background: #dbeafe;
  transform: scale(1.05);
}

.circle-remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: none;
  color: #94a3b8;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

/* 하단 액션바 */
.modal-actions {
  padding: 24px 32px;
  background: #fff;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.btn-primary {
  background: #074CA1;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-primary:hover { background: #063d82; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); }

.btn-secondary {
  background: #eff6ff;
  color: #2563eb;
  border: 1.5px solid #074CA1;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
}

/* 애니메이션 */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.4s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from { opacity: 0; transform: translateY(30px); }
.list-leave-to { opacity: 0; transform: scale(0.9); }

.image-section-label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 12px;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

</style>