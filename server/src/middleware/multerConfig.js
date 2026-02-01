const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 가져오신 설정값 적용
cloudinary.config({ 
    cloud_name:  'dqkmuuyhc',
    api_key: '634581722869796',
    api_secret: 'gI9f1yyBHrldjN33PXB2t1rry6c'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ardeo-shop', // Cloudinary 대시보드에 생성될 폴더명
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        // 자동 최적화 설정 (가져오신 가이드의 최적화 기능 포함)
        transformation: [
            { width: 800, height: 800, crop: 'limit' }, // 최대 크기 제한
            { quality: 'auto', fetch_format: 'auto' }     // 자동 품질/포맷 최적화
        ]
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB 제한
});

module.exports = upload;