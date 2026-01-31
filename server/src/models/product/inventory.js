const mongoose = require('mongoose');   // Mongoose 불러오기

// 상품 재고(Variant) 스키마 정의
const inventorySchema = new mongoose.Schema({
  variantId: {      // 상품 옵션 ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true
  },

  sku: {            // 재고 식별 코드
    type: String,
    required: true,
    unique: true
  },
  
  size: {           // 신발 사이즈
    type: String,
    required: true
  },

  stockQuantity: {  // 재고 수량
    type: Number,
    default: 0,
    min: [0, '재고는 0개 미만이 될 수 없습니다.']
  }
}, { timestamps: true });

inventorySchema.index({ variantId: 1, size: 1 }, { unique: true });

// Inventory 모델 생성 후 외부에서 사용
module.exports = mongoose.model('Inventory', inventorySchema);