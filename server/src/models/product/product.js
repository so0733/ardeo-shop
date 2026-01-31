const mongoose = require('mongoose');   // Mongoose 불러오기

// 상품 정보 스키마 정의
const productSchema = new mongoose.Schema({
  name: {             // 상품명
    ko: { type: String, required: true },
    en: { type: String }
  },

  productCode: {      // 상품코드
    type: String,
    required: true,
    unique: true
  },

  category: {         // 카테고리
    type: String,
    required: true,
    default: 'Sneakers'
  },

  basePrice: {        // 정가
    type: Number,
    required: true
  },

  discountRate: {     // 할인율
    type: Number,
    default: 0,
    min: [0, '할인율은 0% 이상이어야 합니다.'],
    max: [100, '할인율은 100%를 초과할 수 없습니다.']
  },

  finalPrice: {       // 최종 판매가 (정가-할인)
    type: Number,
    default: 0
  },

  material: {         // 제품 소재
    type: String,
    required: true
  },

  heelHeight: {       // 굽높이
    type: String
  },

  gender: {           // 성별
    type: String,
    enum: ['Unisex', 'Men', 'Women']
  },

  origin: {           // 원산지
    type: String,
    default: '대한민국'
  },

  careInstructions: { // 취급 시 주의사항
    type: String
  },

  status: {           // 판매 상태
    type: String,
    enum: ['판매중', '품절', '중단'],
    default: '판매중'
  },
  
  metrics: {          // 상품 통계 정보
    viewCount: { type: Number, default: 0 }, // 조회 수
    salesCount: { type: Number, default: 0 } // 판매 수량
  },

  rating: {           // 상품 평점 정보
    avg: { type: Number, default: 0 },  // 평균 평점
    count: { type: Number, default: 0 } // 평점 수
  },
  
  isDeleted: {        // 논리적 삭제 여부
    type: Boolean,
    default: false
  }

}, { timestamps: true });

// 최종 판매가 통화 포맷 가상 필드
productSchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(this.finalPrice);
});

// 가격 또는 할인율 변경 시 최종가 자동 계산
productSchema.pre('save', function(next) {
  if (this.isModified('basePrice') || this.isModified('discountRate')) {
    if (this.basePrice != null && this.discountRate != null) {
      const calculated = this.basePrice * (1 - this.discountRate / 100);
      this.finalPrice = Math.floor(calculated / 10) * 10; // 10원 단위 절삭
    }
  }
});

// Product 모델 생성 후 외부에서 사용
module.exports = mongoose.model('Product', productSchema);