const express = require('express'); // Express 모듈 불러오기
const router = express.Router();    // Express 라우터 생성
const boardController = require('../controllers/boardController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); // 파일 업로드(Multer) 설정

// [GET] 게시글 목록 조회
router.get('/', boardController.getPosts);

// [GET] 게시글 상세 조회
router.get('/:id', boardController.getPostDetail);

// [POST] 게시글 작성 (로그인 필요)
router.post('/', authMiddleware, isAdmin, upload.single('image'), boardController.createPost);

// [PATCH] 게시글 수정 (관리자만 가능)
router.patch('/:id', authMiddleware, upload.single('image'), boardController.updatePost);

// [DELETE] 게시글 삭제 (관리자만 가능)
router.delete('/:id', authMiddleware, isAdmin, boardController.deletePost);

// 댓글 작성
router.post('/:id/comments', authMiddleware, boardController.addComment);

module.exports = router;
