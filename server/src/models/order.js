const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{ // 주문 상품 목록
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  
  totalPrice: { type: Number, required: true }, // 주문 총 금액
  
  shippingFee: { type: Number, default: 0 },  // 배송비
  
  shippingAddress: {  // 배송 정보
    receiver: String,
    phone: String,
    address: String,
    detailAddress: String,
    zipCode: String
  },

  status: { // 주문 상태
    type: String, 
    enum: ['pending', 'paid', 'shipping', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  
  paymentKey: String, // 결제 서비스에서 발급된 결제 키
  orderId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);