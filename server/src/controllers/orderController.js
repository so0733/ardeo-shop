const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/cart');
const ProductVariant = require('../models/product/productvariant');
const axios = require('axios');

// [POST] 주문 생성
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingFee, shippingAddress, paymentId } = req.body;
    const userId = req.user.id;
    
    // PortOne API 시크릿 키
    const secretKey = process.env.PORTONE_API_SECRET;
    console.log("Secret Key 로드 확인:", secretKey ? "성공" : "실패");

    // 포트원 결제 조회 API 호출
    const paymentResponse = await axios.get(`https://api.portone.io/payments/${paymentId}`, {
      headers: {
        "Authorization": `PortOne ${secretKey.trim()}`,
        "Content-Type": "application/json"
      }
    });
    
    const paymentData = paymentResponse.data;

    // 결재 금액 검증
    if (paymentData.amount.total !== totalPrice) {
      throw new Error("결제 금액 위조가 의심됩니다.");
    }

    // 재고 검증 및 차감
    for (const item of items) {
      const variant = await ProductVariant.findById(item.variantId);

      if (!variant || variant.stock < item.quantity) {
        throw new Error(`상품 재고가 부족합니다.`);
      }

      variant.stock -= item.quantity;
      await variant.save();
    }

    // 주문 생성
    const newOrder = await Order.create({
      userId,
      orderId: paymentId,
      items,
      totalPrice,
      shippingFee,
      shippingAddress,
      status: 'paid',
      paymentKey: paymentId
    });

    // 장바구니에서 주문된 상품 제거
    const cartItemIds = items.filter(i => i.cartItemId).map(i => i.cartItemId);

    if (cartItemIds.length > 0) {
      await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { _id: { $in: cartItemIds } } } }
      );
    }

    res.status(201).json({ success: true, order: newOrder });

  } catch (error) {
    console.error("❌ 상세 에러 로그:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// [GET] 전체 주문 조회 (관리자)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'items.productId',
        select: 'name'
      })
      .populate({
        path: 'items.variantId',
        select: 'color'
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ success: false, message: "데이터 로드 중 서버 에러 발생" });
  }
};

// [PATCH] 주문 상태 변경
exports.updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { status } = req.body; // 'shipping', 'delivered', 'cancelled' 등

    // 주문 정보 조회
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("주문을 찾을 수 없습니다.");
    }

    // 중복 취소 방지
    if (order.status === 'cancelled' && status === 'cancelled') {
      throw new Error("이미 취소된 주문입니다.");
    }

    // 주문 취소 시 재고 복구
    if (status === 'cancelled') {
      for (const item of order.items) {
        await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { stock: item.quantity } }, // 수량 만큼 증가
          { session }
        );
      }
    }

    // 주문 상태 변경
    order.status = status;
    await order.save({ session });

    await session.commitTransaction();

    res.json({ success: true, message: `주문 상태가 ${status}로 변경되었습니다.`, order });

  } catch (error) {
    await session.abortTransaction();
    console.error("❌ 상태 변경 에러:", error);
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// [DELETE] 주문 강제 취소 / 삭제 (관리자)
exports.cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;

    // 주문 조회
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("주문을 찾을 수 없습니다.");
    }

    // 취소되지 않은 주문인 경우에만 재고 복구
    if (order.status !== 'cancelled') {
      for (const item of order.items) {
        await ProductVariant.findByIdAndUpdate(
          item.variantId,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
    }

    // 주문 삭제 (Hard Delete)
    await Order.findByIdAndDelete(orderId).session(session);

    await session.commitTransaction();
    res.json({ success: true, message: "주문이 삭제되었으며 재고가 복구되었습니다." });

  } catch (error) {
    await session.abortTransaction();
    console.error("❌ 주문 삭제 에러:", error);
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// [GET] 내 주문 목록 조회 (사용자)
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate({
        path: 'items.productId',
        select: 'name'
      })
      .populate({
        path: 'items.variantId',
        select: 'color images'
      })
      .sort({ createdAt: -1 }); // 최신 주문순

    res.json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    console.error("My Orders Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "주문 내역을 불러오는 중 오류가 발생했습니다." 
    });
  }
};