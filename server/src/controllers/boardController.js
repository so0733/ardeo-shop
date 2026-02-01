const Board = require('../models/board');   // Board 스키마 불러오기
const Comment = require('../models/comment');

// [POST] 게시글 작성
exports.createPost = async (req, res) => {
    try {
        // 클라이언트에서 전달된 게시글 데이터
        const { title, content, category, isPrivate } = req.body;

        // 공지사항 작성 권한 체크
        if (category === 'notice' && req.user.role !== 'admin') {
            return res.status(403).json({ message: '공지사항은 관리자만 작성 가능합니다.' });
        }

        // 새로운 게시글 객체 생성
        const newPost = new Board({
            title,
            content,
            category,
            isPrivate: isPrivate === 'true' || isPrivate === true,
            author: req.user.id, // 인증 미들웨어(authMiddleware)에서 받은 사용자 ID
            imageUrl: req.file ? req.file.path : null
        });

        // DB에 게시글 저장
        await newPost.save();

        // 성공 응답
        res.status(201).json({ 
            message: '게시글이 등록되었습니다.',
            post: newPost
        });
    } catch (error) {
        // 서버 에러 처리
        res.status(500).json({ message: '게시글 등록 실패' });
    }
};

// [GET] 게시글 목록 조회
exports.getPosts = async (req, res) => {
    try {
        // 1. search 변수를 구조분해 할당에 추가합니다.
        const { category, page = 1, limit = 10, search } = req.query;
        
        const query = {};

        // 카테고리 필터링
        if (category) query.category = category;
        
        // 2. search가 있을 때만 정규표현식 쿼리를 추가합니다.
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const posts = await Board.find(query)
            .populate('author', 'name userId')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Board.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        // 3. 에러 발생 시 서버 콘솔에 원인을 출력하여 확인 가능하게 합니다.
        console.error("목록 조회 에러:", error);
        res.status(500).json({ message: '목록 조회 실패', error: error.message });
    }
};

// [GET] 게시글 상세 조회
exports.getPostDetail = async (req, res) => {
    try {
        // 게시글 ID로 상세 조회
        const post = await Board.findById(req.params.id).populate('author', 'name userId');
        
        // 게시글이 존재하지 않을 경우
        if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

        // 조회수 증가
        post.views += 1;
        await post.save();

        // 성공 응답
        res.status(200).json({ post });
    } catch (error) {
        // 서버 에러 처리
        res.status(500).json({ message: '상세 조회 실패' });
    }
};

// [PATCH] 게시글 수정
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, isPrivate } = req.body;

        const post = await Board.findById(id);
        if (!post) return res.status(404).json({ message: '게시글이 없습니다.' });

        // 권한 확인
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }

        // 업데이트할 객체 생성
        const updateData = {
            title,
            content,
            category,
            isPrivate: isPrivate === 'true' || isPrivate === true
        };

        // 새로운 파일이 업로드된 경우에만 이미지 경로 수정
        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        const updatedPost = await Board.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: '수정 완료', post: updatedPost });
    } catch (error) {
        console.error("수정 중 서버 에러:", error); // 서버 터미널에서 구체적인 에러 확인 가능
        res.status(500).json({ message: '서버 내부 에러로 수정 실패', error: error.message });
    }
};

// [DELETE] 게시글 삭제
exports.deletePost = async (req, res) => {
    try {
        // 게시글 조회
        const post = await Board.findById(req.params.id);

        // 게시글이 없을 경우
        if (!post) return res.status(404).json({ message: '게시글이 없습니다.' });

        // 작성자 권한 확인
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }

        // 게시글 삭제
        await Board.findByIdAndDelete(req.params.id);
        // 성공 응답
        res.status(200).json({ message: '삭제 완료' });
    } catch (error) {
        // 서버 에러 처리
        res.status(500).json({ message: '삭제 실패' });
    }
};

// [POST] 댓글 작성
exports.addComment = async (req, res) => {
    try {
        // 댓글 내용
        const { content } = req.body;
        
        // 새로운 댓글 객체 생성
        const newComment = new Comment({
            boardId: req.params.id,
            author: req.user.id,
            content
        });

        // 댓글 저장
        await newComment.save();
        
        // 성공 응답
        res.status(201).json({ message: '댓글 등록 성공', comment: newComment });
    } catch (error) {
        // 서버 에러 처리
        res.status(500).json({ message: '댓글 등록 실패' });
    }
};