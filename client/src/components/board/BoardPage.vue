<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { boardApi } from '../../utils/boardApi';

// 게시글 데이터 타입 정의
interface Post {
  _id: string;
  title: string;
  category: string;
  author: {
    name: string;
    userId: string;
  };
  views: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

const posts = ref<Post[]>([]);      // 게시글 목록 상태
const category = ref('');           // 현재 선택된 카테고리 상태

// 게시글 목록 조회 함수
const fetchPosts = async () => {
  try {
    const params: any = {};
    if (category.value) params.category = category.value;
    
    // API 호출
    const res = await boardApi.getPosts(params);

    // 백엔드 응답 구조({ posts: [], totalPages: ... })에 맞춰 할당
    if (res.data && res.data.posts) {
      posts.value = res.data.posts;
    }
  } catch (err: any) {
    // 에러 발생 시 상세 원인 파악을 위한 로그
    const errorMsg = err.response?.data?.message || '서버와 통신할 수 없습니다.';
    console.error('목록 로드 실패:', errorMsg);
    alert(errorMsg);
  }
};

onMounted(fetchPosts);          // 컴포넌트 마운트 시 실행
</script>

<template>
  <div class="board-container">
    <div class="board-header">
      <select v-model="category" @change="fetchPosts" class="category-select">
        <option value="">전체 카테고리</option>
        <option value="notice">📢 공지사항</option>
        <option value="qna">❓ Q&A</option>
        <option value="event">🎈 이벤트</option>
      </select>
    </div>

    <table class="board-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>작성자</th>
          <th>조회수</th>
          <th>날짜</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(post, index) in posts" :key="post._id">
          <td>{{ index + 1 }}</td>
          <td><span :class="['badge', post.category]">{{ post.category.toUpperCase() }}</span></td>
          <td class="title-cell">
            <router-link :to="`/board/${post._id}`">{{ post.title }}</router-link>
            <span v-if="post.isPrivate"> 🔒</span>
          </td>
          <td>{{ post.author.name }}</td>
          <td>{{ post.views }}</td>
          <td>{{ new Date(post.createdAt).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* 게시판 전체 레이아웃 */
.board-container { 
  max-width: 1100px; 
  margin: 60px auto; 
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
  color: #222;
}

/* 상단 헤더 - 카테고리 선택 영역 */
.board-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #111;
  padding-bottom: 15px;
}

.category-select {
  padding: 8px 12px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  outline: none;
}

/* 게시글 목록 테이블 */
.board-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 50px;
}

.board-table th {
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.board-table td {
  padding: 18px 15px;
  border-bottom: 1px solid #f2f2f2;
  text-align: center;
  font-size: 14px;
}

/* 제목 셀 강조 */
.title-cell {
  text-align: left !important;
  font-weight: 500;
}

.title-cell a {
  text-decoration: none;
  color: #333;
  transition: color 0.2s;
}

.title-cell a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 카테고리 배지 (Notice, QnA, Event) */
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.badge.notice { background: #fff1f1; color: #e74c3c; }
.badge.qna    { background: #f1f3ff; color: #3f51b5; }
.badge.event  { background: #fff9db; color: #f39c12; }

/* 🔒 잠금 아이콘 스타일 */
.title-cell span {
  font-size: 12px;
  color: #aaa;
  margin-left: 5px;
}
</style>