const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 파일 저장 디렉토리 경로
const uploadDir = 'uploads/';

// 업로드 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// multer 디스크 저장소 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);    // 파일 저장 위치 지정
    },
    filename: (req, file, cb) => {
        // 파일명 중복 방지를 위한 고유 파일명 생성 [현재시간-랜덤숫자.확장자] 형식으로 저장
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 업로드 허용 파일 타입 필터링 (이미지만 허용)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 허용된 이미지 타입
    } else {
        cb(new Error('이미지 파일(jpg, png, webp)만 업로드 가능합니다.'), false);
    }
};

// multer 업로드 인스턴스 생성
const upload = multer({
    storage: storage,       // 저장소 설정
    fileFilter: fileFilter, // 파일 타입 검증
    limits: {
        fileSize: 5 * 1024 * 1024 // 최대 업로드 용량 제한 (5MB)
    }
});

module.exports = upload;