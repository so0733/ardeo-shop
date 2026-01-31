import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/board',
  withCredentials: true // 쿠키 전송용
});

export const boardApi = {
  // 목록 조회
  getPosts: (params: { category?: string; page?: number; search?: string }) => 
    api.get('/', { params }),

  // 상세 조회
  getPost: (id: string) => api.get(`/${id}`),
  
  // 게시글 작성 (FormData 사용)
  createPost: (formData: FormData, token: string) => 
    api.post('/', formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  ),
  
  // 게시글 수정 (PATCH)
  updatePost: (id: string, formData: FormData, token: string) => 
    api.patch(`/${id}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  ),
  
  // 게시글 삭제
  deletePost: (id: string, token: string) => 
    api.delete(`/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
};