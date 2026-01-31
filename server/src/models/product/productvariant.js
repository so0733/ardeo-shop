const mongoose = require('mongoose');   // Mongoose 불러오기

// 상품 색상 관련 옵션(Variant) 스키마 정의
const productVariantSchema = new mongoose.Schema({
  productId: {  // 상품 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },

  variantCode: {  // 상품 코드
    type: String,
    required: true,
    unique: true
  },

  color: {  // 색상명
    type: String,
    required: true
  },

  images: { // 상품 이미지
    thumbnail: {
      type: String
    },
    gallery: {
      type: [String]
    }
  }

}, { timestamps: true });

// ProductVariant 모델 생성 후 외부에서 사용
module.exports = mongoose.model('ProductVariant', productVariantSchema);