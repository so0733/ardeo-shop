const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  
  productId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  
  rating: { // 별점
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  content: {  // 리뷰 내용
    type: String,
    required: true,
    minlength: 10
  },
  images: [{ type: String }], // 리뷰 첨부 이미지 URL 배열
  
}, { timestamps: true });

// 한 사용자가 한 주문 내의 특정 상품에 대해 중복 리뷰를 쓰는 것을 방지
reviewSchema.index({ userId: 1, orderId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);