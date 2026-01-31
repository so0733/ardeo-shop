const express = require('express');                 // Express 불러오기
const connectDB = require('./config/db');           // MongoDB 연결 함수 불러오기
const cookieParser = require('cookie-parser');      // 클라이언트 쿠키를 읽기 위한 미들웨어
const cors = require('cors');                       // CORS 설정 미들웨어
const authRoutes = require('./routes/auth');        // 회원가입/로그인 관련 라우터 불러오기
const productRoutes = require('./routes/product');  // 상품 관련 라우터 불러오기
const cartRoutes = require('./routes/cart');        // 장바구니 관련 라우터 불러오기
const orderRoutes = require('./routes/order');      // 주문 관련 라우터 불러오기
const reviewRoutes = require('./routes/review');    // 리뷰 관련 라우터 불러오기
const boardRoutes = require('./routes/board');      // 게시판 관련 라우터 불러오기
const app = express();                              // Express 앱 생성하기

connectDB();            //  MongoDB 연결 (비동기 처리)

const corsOptions = {
    // 프론트엔드 주소로 변경 [Vite 기본 포트:5173]
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,  // 쿠키 포함 요청 허용
    methods: ['GET', 'POST', 'PATCH', 'DELETE'] // 허용 HTTP 메서드
};

// CORS 미들웨어 적용
app.use(cors(corsOptions));

// 미들웨어 설정
app.use(express.json());    // JSON 요청 본문 처리
app.use(express.urlencoded({extended: true })); // HTML form 방식의 데이터 처리
app.use(cookieParser());    // 쿠키 파싱 미들웨어

// 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/board', boardRoutes);

// 서버 포트 설정
const PORT = process.env.PORT || 5000;

// 기본 라우터(테스트용)
app.get('/', (req, res) => {
    res.send('서버 실행 및 MongoDB 연결 시도 중 입니다.');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`📡 서버가 http://localhost:${PORT} 에서 실행 중 입니다.`);
});