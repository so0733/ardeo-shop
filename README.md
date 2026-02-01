# 🛒 Ardeo Shop

**Vite + Express + MongoDB 기반의 Full-Stack 쇼핑몰 웹 플랫폼**

Ardeo Shop은 보안성과 사용자 경험(UX)에 초점을 맞춘 프로젝트로, 실무 수준의 **JWT 이중 토큰 인증** 및 **복합 데이터 트랜잭션** 구조를 직접 설계하여 구현한 풀스택 웹 애플리케이션입니다.

---

## 🔗 Live Demo & Repository

- **Frontend (Vercel):** [https://ardeo-shop.vercel.app/](https://ardeo-shop.vercel.app/)
- **Repository:** `https://github.com/so0733/ardeo-shop`

---

## ✨ 핵심 포인트

- **보안 중심 인증:** Access Token(Header) & Refresh Token(Http-only Cookie) 기반의 이중 보안 인증 체계
- **무결성 데이터 관리:** Mongoose Session을 활용하여 상품/옵션/재고 등록 시 트랜잭션 보장 및 실패 시 물리적 이미지 파일 자동 롤백
- **확장 가능한 데이터 모델링:** 상품 코드 체계화 및 1:N:M(상품:옵션:재고) 관계의 복합 스키마 설계
- **고도화된 관리자 시스템:** 실시간 재고 대시보드, 주문 상태 제어, 공지사항 및 리뷰 관리 기능

---

## 🛠 Tech Stack

### Frontend

- **Framework:** Vue 3
- **Bundler:** Vite
- **State Management:** Pinia (User Store)
- **UI/UX:** CSS3, vue3-carousel, Kalimahapps Icons
- **HTTP Client:** Axios

### Backend

- **Runtime:** Node.js (Express)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Auth:** JSON Web Token (JWT), bcrypt
- **File Handling:** Multer (Local Storage)

---

## 🔐 Authentication Flow (JWT)

- **Access Token:** 유효기간 1시간, `Authorization` 헤더를 통한 매 요청 검증
- **Refresh Token:** 유효기간 7일, DB 저장 및 `HTTP-only Secure Cookie`로 안전하게 관리
- **Security:** 비밀번호 암호화(bcrypt), 관리자 권한 미들웨어(`isAdmin`), CORS 정책 적용

---

## 📂 Project 구조

```text
ardeo-shop
├─ client                          # 프론트엔드 (Vue 3 + Vite)
│  ├─ index.html                   # SPA 진입 HTML (Vite 번들 주입)
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public                       # 정적 파일 (빌드 시 그대로 복사)
│  │  ├─ logo.svg
│  │  └─ vite.svg
│  ├─ src
│  │  ├─ App.vue                   # 최상위 루트 컴포넌트
│  │  ├─ assets                    # 이미지, 아이콘 등 리소스
│  │  ├─ components                # 재사용 UI 컴포넌트
│  │  │  ├─ admin                  # 관리자 UI
│  │  │  │  ├─ ProductEditModal.vue # 상품 수정 모달
│  │  │  │  ├─ Products.vue         # 상품 관리
│  │  │  │  └─ ProductTable.vue     # 상품 목록 테이블
│  │  │  ├─ auth                   # 인증 / 회원 UI
│  │  │  │  ├─ FindId.vue           # 아이디 찾기
│  │  │  │  ├─ LoginForm.vue        # 로그인 폼
│  │  │  │  ├─ ProfileView.vue      # 회원 프로필 조회
│  │  │  │  ├─ RegisterForm.vue     # 회원가입 폼
│  │  │  │  └─ ResetPassword.vue    # 비밀번호 재설정
│  │  │  ├─ cart                   # 장바구니 / 주문 UI
│  │  │  │  ├─ CartView.vue         # 장바구니 화면
│  │  │  │  ├─ OrderForm.vue        # 주문서 작성
│  │  │  │  └─ OrderSuccess.vue     # 주문 완료 화면
│  │  │  ├─ mypage                 # 마이페이지 UI
│  │  │  │  └─ ProfileForm.vue      # 회원정보 수정 폼
│  │  │  └─ product                # 상품 관련 UI
│  │  │     └─ ProductDetail.vue    # 상품 상세 페이지
│  │  ├─ env.d.ts                  # Vite 환경 변수 타입 선언
│  │  ├─ main.ts                   # Vue 앱 엔트리 포인트
│  │  ├─ member
│  │  │  ├─ terms.ts               # 회원가입 약관 데이터
│  │  │  └─ TermsModal.vue         # 약관 모달 컴포넌트
│  │  ├─ router
│  │  │  └─ index.ts               # Vue Router 설정
│  │  ├─ style.css                 # 전역 스타일
│  │  ├─ utils
│  │  │  └─ userStore.ts           # 사용자 상태 관리
│  │  └─ views                     # 페이지 단위 뷰
│  │     ├─ About.vue               # 회사소개 페이지
│  │     ├─ AdminPage.vue           # 관리자 페이지
│  │     ├─ Footer.vue              # 공통 푸터
│  │     └─ HomePage.vue            # 메인 페이지
│  ├─ tsconfig.app.json            # 앱 전용 TS 설정
│  ├─ tsconfig.json                # TypeScript 기본 설정
│  ├─ tsconfig.node.json           # Node/Vite용 TS 설정
│  └─ vite.config.ts               # Vite 설정 파일
├─ package-lock.json
├─ package.json
└─ server                          # 백엔드 (Node.js + Express)
   ├─ .env                         # 환경 변수 (DB, JWT 시크릿 등)
   ├─ package-lock.json
   ├─ package.json
   ├─ src
   │  ├─ app.js                    # Express 서버 엔트리 포인트
   │  ├─ config
   │  │  └─ db.js                  # DB 연결 설정
   │  ├─ controllers               # 비즈니스 로직 처리
   │  │  ├─ authController.js       # 인증 컨트롤러
   │  │  ├─ cartController.js       # 장바구니 컨트롤러
   │  │  ├─ orderController.js      # 주문 컨트롤러
   │  │  └─ productController.js    # 상품 컨트롤러
   │  ├─ middleware                # 미들웨어
   │  │  ├─ authMiddleware.js       # JWT 인증 / 인가
   │  │  └─ multerConfig.js         # 파일 업로드 설정
   │  ├─ models                    # DB 모델 정의 (Mongoose)
   │  │  ├─ cart.js                 # 장바구니 모델
   │  │  ├─ order.js                # 주문 모델
   │  │  ├─ product
   │  │  │  ├─ inventory.js         # 재고 관리 모델
   │  │  │  ├─ product.js           # 상품 정보 모델
   │  │  │  └─ productvariant.js    # 상품 옵션 모델
   │  │  └─ user.js                 # 사용자 모델
   │  └─ routes                    # API 라우팅 설정
   │     ├─ auth.js                 # 인증 관련 경로
   │     ├─ cart.js                 # 장바구니 관련 경로
   │     ├─ order.js                # 주문 관련 경로
   │     └─ product.js              # 상품 관련 경로
   └─ uploads                      # 업로드된 이미지 파일 저장 폴더

```

---

## 📅 Development Timeline & Milestone

<details> <summary><b>1주차: 시스템 기초 설계 및 인증 서버 구축 (01.01 ~ 01.05)</b></summary>

2026.01.01: Express 서버 환경 구축, MongoDB Atlas 연동 및 아키텍처 설계

2026.01.02: 회원가입/로그인 API 구현 (bcrypt 비밀번호 해싱 적용)

2026.01.03: JWT 기반 회원 정보 조회/수정 및 탈퇴 로직 구현

2026.01.05: Refresh Token 시스템 도입 (DB 저장 및 Http-only Cookie 방식), 인증 미들웨어 완성

</details>

<details> <summary><b>2주차: 상품 데이터 모델링 및 관리자 API 고도화 (01.06 ~ 01.10)</b></summary>

2026.01.06: 상품-옵션-재고(1:N:M) 멀티 컬렉션 스키마 설계 및 Multer 업로드 환경 구축

2026.01.07: 상품 통합 등록 API 구현 (Mongoose Transaction 적용 및 파일 롤백 처리)

2026.01.08: 프론트엔드 최적화 상품 조회 API (Promise.all 트리 구조 데이터 반환)

2026.01.10: 관리자 전용 상품 수정/삭제(Soft Delete) 및 재고 Upsert 로직 최적화

</details>

<details> <summary><b>3주차: 프론트엔드 핵심 UI 및 사용자 경험(UX) 구현 (01.11 ~ 01.16)</b></summary>

2026.01.11: 회원가입 UI (주소 API 연동, 실시간 유효성 검사, 자동 포맷팅)

2026.01.12: 로그인 UI 및 Pinia 전역 상태 관리 설정

2026.01.13: 아이디 찾기/비밀번호 재설정 (2단계 인증 플로우)

2026.01.14: 메인 헤더 및 캐러셀 UI (GNB 고정, 외부 클릭 감지 인터랙션)

2026.01.15: 상품 카드 시스템 및 반응형 푸터 구축

2026.01.16: 브랜드 스토리 기반 회사소개(About) 페이지 (Scroll Reveal 애니메이션)

</details>

<details> <summary><b>4주차: 마이페이지 및 관리자 대시보드 구축 (01.19 ~ 01.23)</b></summary>

2026.01.19: 마이페이지 회원 정보 조회 및 비밀번호 변경 모달(Teleport 적용)

2026.01.20: 회원 정보 수정/삭제 기능 및 토큰 기반 세션 관리

2026.01.21: 관리자 전용 레이아웃 (Sticky 사이드바, 반응형 대시보드 카드)

2026.01.22: 상품 등록 모달 UI (이미지 미리보기, 동적 옵션/재고 필드 생성)

2026.01.23: 관리자 상품 목록 테이블 (아코디언 상세 조회, 실시간 수정 API 연동)

</details>

<details> <summary><b>5주차: 이커머스 핵심 기능(주문/결제/장바구니) 및 최종 배포 (01.24 ~ 01.31)</b></summary>

2026.01.24: 상품 상세 페이지 (옵션 선택기, 실시간 금액 계산 로직)

2026.01.25: 장바구니 시스템 (수량 조절 API 연동, 배송비 조건부 계산)

2026.01.26: PortOne 결제 시스템 연동 (서버 사이드 결제 검증 및 재고 차감 트랜잭션)

2026.01.27: 관리자 주문 관리 UI (주문 상태 단계별 변경 및 한글 상태 변환)

2026.01.28: 리뷰 시스템 (다중 이미지 업로드, 별점 기능, 구매 확정 후 작성 제한)

2026.01.29: 공지사항 게시판 (관리자 전용 CRUD, 조회수 로직 구현)

2026.01.30: 시스템 최적화 (실시간 검색 시스템, 장바구니 배지 동기화, 메모리 누수 방지)

2026.01.31: 서비스 배포 (Vercel/Render) 및 이미지 경로/CORS 트러블슈팅

</details>
---

## 🎨 Design System

- **Primary Color:** `#6a8fe7` (Stability Blue)
- **Accent Color:** `#e7c26a` (Warm Yellow)
- **Typography:** Responsive font size using `clamp()`
- **Interactions:** Hover Scale, Fade-in Up Motion, Glassmorphism (Search Dropdown)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x 이상
- MongoDB Atlas 계정

### Installation

1. **Repository Clone**

```bash
git clone https://github.com/so0733/ardeo-shop.git
cd ardeo-shop

```

2. **Backend Setup**

```bash
cd server
npm install
npm run dev

```

3. **Frontend Setup**

```bash
cd client
npm install
npm run dev

```

---

## 📑 More Information

프로젝트에 대한 더 자세한 기획 내용, 트러블슈팅 기록, 그리고 상세 페이지별 스크린샷은 아래 **Notion** 페이지에서 확인하실 수 있습니다.

👉 **[Ardeo Shop Project 상세 기록 보기 (Notion)](https://www.notion.so/so0733/Ardeo-Shop-Project-2b8bc31f9013805dbcdae7089c4f0124?source=copy_link)**

---

