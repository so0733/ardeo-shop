require('dotenv').config(); // dotenv로 .env 파일의 환경 변수를 읽어들임
const mongoose = require('mongoose');   // Mongoose 불러오기


// .env 파일 안에 저장된 MongoDB 주소를 불러옴
const dbURI = process.env.MONGODB_URI;

// MongoDB 연결 함수
const connectDB = async () => { // 데이터베이스 연결을 시도하는 비동기 함수를 정의
    if (!dbURI) {
        console.error("❌ 오류 : MongoDB 주소가 .env 파일에 설정되어있지 않습니다.");
        process.exit(1);    // 종료
    }
    
    try {
        await mongoose.connect(dbURI);
        console.log('✅ MongoDB 연결 성공!!!');
    } catch (error) {
        console.error('❌ MongoDB 연결 실패 :', error.message);
        process.exit(1);    // 종료
    }
};

// 외부에서 사용 가능하도록 함수 내보내기
module.exports = connectDB;