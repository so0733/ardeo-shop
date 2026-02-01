<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { boardApi } from '../../utils/boardApi';
import BoardWrite from '../admin/BoardWrite.vue';

const route = useRoute();
const router = useRouter();

const post = ref<any>(null);            // 게시글 상세 데이터 상태
const loading = ref(true);              // 로딩 상태
const isEditModalOpen = ref(false);     // 수정 모달 상태

// 현재 로그인한 사용자 정보
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const token = localStorage.getItem('accessToken');  // API 인증 토큰

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getImageUrl = (path: string) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${SERVER_URL}${path}`;
};
// 게시글 상세 조회
const fetchPostDetail = async () => {
  try {
    const id = route.params.id as string;
    const res = await boardApi.getPost(id);
    post.value = res.data.post;
  } catch (err) {
    console.error('상세 로드 실패', err);
    alert('존재하지 않는 게시글이거나 권한이 없습니다.');
    router.push('/board');
  } finally {
    loading.value = false;
  }
};

// 게시글 수정
const handleEditSaved = () => {
  isEditModalOpen.value = false;
  fetchPostDetail(); // 수정 후 데이터 다시 불러오기
};

// 게시글 삭제
const handleDelete = async () => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;
  if (!token) return;

  try {
    await boardApi.deletePost(post.value._id, token);
    alert('삭제되었습니다.');
    router.push('/board');
  } catch (err) {
    alert('삭제에 실패했습니다.');
  }
};

// 컴포넌트 마운트 시 실행
onMounted(fetchPostDetail);
</script>

<template>
  <div class="detail-container" v-if="!loading && post">
    <div class="post-header">
      <span :class="['category-badge', post.category]">{{ post.category.toUpperCase() }}</span>
      <h2 class="title">{{ post.title }}</h2>
      
      <div class="post-info">
        <span class="author"><strong>작성자</strong> {{ post.author.name }}</span>
        <span class="divider">|</span>
        <span class="date"><strong>날짜</strong> {{ new Date(post.createdAt).toLocaleString() }}</span>
        <span class="divider">|</span>
        <span class="views"><strong>조회수</strong> {{ post.views }}</span>
      </div>
    </div>

    <div class="post-content">
      <div v-if="post.imageUrl" class="image-box">
        <img :src="getImageUrl(post.imageUrl)" alt="첨부 이미지" />
      </div>
      
      <p class="text">{{ post.content }}</p>
    </div>

    <div class="bottom-actions">
      <button class="list-btn" @click="router.push('/board')">목록으로</button>
      
      <div v-if="post.author.userId === currentUser.userId || currentUser.role === 'admin'" class="admin-btns">
        <button class="edit-btn" @click="isEditModalOpen = true">수정</button>
        <button class="delete-btn" @click="handleDelete">삭제</button>
      </div>
      
      <Teleport to="body">
        <div v-if="isEditModalOpen" class="modal-overlay">
          <div class="modal-card">
            <header class="modal-header">
              <h3>게시글 수정</h3>
              <button @click="isEditModalOpen = false">&times;</button>
            </header>
            
            <div class="modal-body">
              <BoardWrite :editData="post" @saved="handleEditSaved" @close="isEditModalOpen = false" />
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
  
  <div v-else-if="loading" class="loading">데이터를 불러오는 중...</div>
</template>

<style scoped>
/* 게시글 상세 컨테이너 */
.detail-container {
  max-width: 850px;
  margin: 50px auto;
  padding: 40px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  font-family: 'Pretendard', sans-serif;
}

.post-header {
  border-bottom: 2px solid #111;
  padding-bottom: 25px;
  margin-bottom: 30px;
}

/* 카테고리 배지 */
.category-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 15px;
}

.category-badge.notice {
  background: #fff1f1;
  color: #e74c3c;
}

.category-badge.qna {
  background: #f1f3ff;
  color: #3f51b5;
}

.category-badge.event {
  background: #fff9db;
  color: #f39c12;
}

/* 제목 */
.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #111;
}

/* 작성자 / 날짜 / 조회수 정보 */
.post-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #666;
}

/* 정보 구분자 */
.divider {
  color: #eee;
}

/* 내용 */
.post-content {
  min-height: 300px;
  line-height: 1.8;
  font-size: 17px;
  color: #333;
  margin-bottom: 50px;
}

/* 본문 이미지 영역 */
.image-box {
  margin-bottom: 30px;
  text-align: center;
}

.image-box img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text {
  white-space: pre-wrap;
}

/* 하단 버튼 영역 */
.bottom-actions {
  display: flex;
  justify-content: space-between;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

/* 공통 버튼 스타일 */
button {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

/* 목록으로 버튼 */
.list-btn {
  background: #fff;
  border: 1px solid #ddd;
  color: #444;
}

/* 관리자 버튼 그룹 */
.admin-btns {
  display: flex;
  gap: 10px;
}

/* 수정 버튼 */
.edit-btn {
  background: #eff6ff;
  border: none;
  color: #2563eb;
}

/* 삭제 버튼 */
.delete-btn {
  background: #fef2f2;
  border: none;
  color: #dc2626;
}

button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

/* 로딩 상태 */
.loading {
  text-align: center;
  padding: 100px;
  color: #888;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* 모달 카드 */
.modal-card {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* 모달 헤더 */
.modal-header {
  padding: 15px 20px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

/* 모달 닫기 버튼 */
.modal-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #888;
}

/* 모달 본문 */
.modal-body {
  padding: 20px;
}
</style>