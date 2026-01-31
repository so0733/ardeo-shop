const express = require('express'); // Express 모듈 불러오기
const router = express.Router();    // Express 라우터 생성
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

/** ------------------------------------------------
 * 공개 라우트 (누구나 접근 가능)
 * ------------------------------------------------ */

router.post('/register', authController.register);          // 회원가입
router.post('/login', authController.login);                // 로그인
router.post('/token/refresh', authController.refreshToken); // 토큰 갱신
router.post('/check-id', authController.checkId);           // 아이디 중복 확인
router.post('/find-id', authController.findId);             // 아이디 찾기
router.post('/verify-for-password', authController.verifyForPassword);  // 비번 재설정 전 사용자 확인
router.patch('/reset-password-unauthenticated', authController.resetPasswordUnauthenticated);   // 새비번 재설정

/** ------------------------------------------------
 * 보호된 라우트 (로그인 시에만 접근 가능)
 * ------------------------------------------------ */

router.get('/profile', authMiddleware, authController.getProfile);              // 회원 정보 조회
router.patch('/profile', authMiddleware, authController.updateProfile);         // 회원 정보 수정
router.patch('/password', authMiddleware, authController.updatePassword);       // 비밀번호 변경
router.delete('/profile', authMiddleware, authController.withdraw);             // 회원 탈퇴
router.post('/verify-password', authMiddleware, authController.verifyPassword); // 비밀번호 재확인

module.exports = router;
