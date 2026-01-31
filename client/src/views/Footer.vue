<script setup lang="ts">
import { ref } from 'vue';
import { FaBandsSquareYoutube, FaBandsSquareInstagram } from '@kalimahapps/vue-icons';
import TermsModal from '../member/TermsModal.vue';

// 모달 상태 관리
const isModalOpen = ref(false);
const selectedTermKey = ref('service');

const openTerms = (key: string) => {
  selectedTermKey.value = key;
  isModalOpen.value = true;
};
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-inner">
        <div class="footer-column">
          <h3>CUSTOMER CENTER</h3>
          <div class="tel">1588-0000(유료)</div>
          <p class="info-text">
            운영시간 10:00 - 17:30 / 점심시간 13:00 - 14:00<br />
            토/일/공휴일(임시공휴일 포함) 휴무
          </p>
        </div>
        
        <div class="footer-column">
          <h3>BANK INFO</h3>
          <p class="info-text">
            <strong>입금계좌</strong><br />
            신한은행 110-419-000000
          </p>
          <p class="info-text"><strong>예금주명: (주)아르데오</strong></p>
        </div>
        
        <div class="footer-column">
          <h3>DELIVERY</h3>
          <p class="info-text">
            <strong>우체국 택배 1588-1300</strong><br />
            (반품주소)<br />
            부산광역시 부산진구 백양대로 156 (당감동)
          </p>
        </div>
        
        <div class="footer-column sns">
          <h3>SNS</h3>
          <div class="sns-icons">
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" class="icon-btn youtube" aria-label="유튜브(새 창 열림)">
              <FaBandsSquareYoutube class="icon" />
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" class="icon-btn instagram" aria-label="인스타그램(새 창 열림)">
              <FaBandsSquareInstagram class="icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-inner">
        <div class="footer-logo">ARDEO</div>
        
        <div class="company-info">
          <ul class="footer-links">
            <li>
              <router-link to="/about" class="about-link">회사소개</router-link>
            </li>
            <li @click="openTerms('service')">이용약관</li>
            <li class="privacy" @click="openTerms('privacy')">개인정보처리방침</li>
          </ul>
          <p>
            법인명(상호) : 주식회사 아르데오 &nbsp; 대표자(성명) : ○○○ &nbsp; 주소 : 부산시 부산진구 백양관문로 10
          </p>
          <p>
            사업자등록번호 : 000-00-00000 (사업자정보확인) &nbsp; 통신판매신고 : 제2026-부산진구-0000호 &nbsp; 상품등록번호 : 0000000000000 &nbsp; 개인정보 보호 책임자 : ○○○ (○○○@gmail.com)
          </p>
          <p class="copyright">ⓒ (주)아르데오 Co., Ltd. Designed by so cheol hyeon.</p>
        </div>

        <TermsModal :is-open="isModalOpen" :term-key="selectedTermKey" @close="isModalOpen = false" />
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 푸터 전체 레이아웃 */
.footer {
  width: 100%;
  background-color: #fff;
  color: #000;
  margin-top: 100px;
  border-top: 1px solid #eee;
}

/* 내부 공통 레이아웃 */
.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  display: flex;
  justify-content: space-between;
}

/* 상단 영역 스타일 */
.footer-column h3 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #000;
  letter-spacing: 0.5px;
}

/* 고객센터 전화번호 스타일 */
.tel {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

/* 설명 텍스트 스타일 */
.info-text {
  font-size: 13px;
  line-height: 1.8;
  color: #777;
  margin-bottom: 15px;
}

/* SNS 아이콘 레이아웃 */
.sns-icons {
  display: flex;
  gap: 12px;
}

/* 아이콘 버튼 공통 스타일 (a 태그) */
.icon-btn {
  text-decoration: none;
  background: #f8f8f8;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #555;
}

.icon {
  width: 24px;
  height: 24px;
  transition: all 0.3s ease;
}

/* 유튜브 호버 스타일 */
.icon-btn.youtube:hover {
  background-color: #FF0000;
}

/* 인스타그램 호버 스타일 */
.icon-btn.instagram:hover {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
}

/* 호버 시 아이콘 효과 */
.icon-btn:hover .icon {
  color: #fff;
  transform: scale(1.1);
}

/* 클릭 시 눌림 효과 */
.icon-btn:active {
  transform: translateY(2px);
}

/* 하단 영역 스타일 */
.footer-bottom {
  border-top: 1px solid #f5f5f5;
  padding-bottom: 60px;
}

.footer-bottom .footer-inner {
  align-items: flex-start;
  padding-top: 40px;
}

/* 푸터 로고 스타일 */
.footer-logo {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: transparent;
  background: linear-gradient(to right, #000000, #6a8fe7);
  -webkit-background-clip: text; 
  background-clip: text;          
  -webkit-text-fill-color: transparent;
  margin-right: 80px;
}

/* 하단 링크 목록 */
.footer-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0;
  margin-bottom: 20px;
}

.footer-links li {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.about-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  line-height: 1;
}

.footer-links li:hover {
  text-decoration: underline;
}

.footer-links li.privacy {
  color: #ff4d4f;
  font-weight: 700;
}

/* 회사 공지 텍스트 */
.company-info p {
  font-size: 12px;
  color: #999;
  line-height: 1.8;
  margin-bottom: 4px;
}

/* 저작권 문구 */
.copyright {
  margin-top: 12px !important;
  color: #bbb !important;
}

/* 반응형 (태블릿/모바일) */
@media (max-width: 1024px) {
  .footer-inner {
    flex-direction: column;
    gap: 50px;
    padding: 40px 20px;
  }
  
  .footer-bottom .footer-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-logo {
    margin-right: 0;
    margin-bottom: 30px;
  }

  .footer-links {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>