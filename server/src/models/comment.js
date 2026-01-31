const mongoose = require('mongoose');   // Mongoose 불러오기

// 댓글 스키마 정의
const commentSchema = new mongoose.Schema({
    boardId: {  // 게시글의 ID
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    author: {   // 작성자
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {  // 내용
        type: String,
        required: true
    },
}, { timestamps: true });

// Comment 모델 생성 후 외부에서 사용
module.exports = mongoose.model('Comment', commentSchema);