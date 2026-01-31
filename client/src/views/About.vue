<script setup>

// 브랜드 핵심 요소
const trustItems = [
  { title: 'Handmade Craft', desc: '수십 년 경력의 장인들이 손으로 직접 완성한 디테일, 신을수록 느껴지는 차이를 경험하세요.' },
  { title: 'Premium Leather', desc: '엄격하게 선별된 최상위 등급의 가죽만을 사용하여 고급스러운 광택과 질감을 전달합니다.' },
  { title: 'Ergonomic Design', desc: '인체공학적 설계를 바탕으로 발의 피로도를 최소화하여 하루 종일 최상의 컨디션을 유지합니다.' },
  { title: 'Brand Loyalty', desc: '85%의 재구매율이 증명하는 품질. 한 번의 선택이 평생의 인연이 되는 브랜드가 되겠습니다.' }
];

// 브랜드 핵심 가치
const values = [
  { label: 'Sincerity', title: '진정성', desc: '모든 제작 과정에서 정직함과 타협하지 않는 품질을 고집합니다.' },
  { label: 'Innovation', title: '혁신', desc: '전통적인 아름다움을 현대적인 감각으로 재해석하여 새로운 스타일을 제시합니다.' },
  { label: 'Balance', title: '조화', desc: '기능성과 미학의 균형을 찾아 일상에 자연스럽게 스며듭니다.' }
];
</script>


<template>
  <div class="about-container">
    <section class="hero-section">
      <div class="hero-overlay"></div>
      
      <div class="content-inner">
        <span class="hero-tag fade-in">ESTABLISHED 2026</span>
        <h1 class="brand-logo fade-in-up">ARDEO</h1>
        <p class="hero-desc fade-in-up delay-1">
          빛나는 당신의 일상을 위해,<br/>
          <span class="highlight">본질에서 시작된 한 걸음</span>을 완성합니다.
        </p>

        <div class="scroll-indicator fade-in delay-2">
          <div class="mouse"></div>
          <span>SCROLL</span>
        </div>
      </div>
    </section>

    <section class="vision-section">
      <div class="content-inner">
        <div class="vision-content">
          <div class="vision-title fade-in-scroll">
            <span class="label">OUR STORY</span>
            <h2>열망의 불꽃,<br/>ARDEO</h2>
          </div>
          
          <div class="vision-text">
            <p>
              아르데오(ARDEO)는 라틴어로 <strong>'타오르다', '열망하다'</strong>라는 의미를 담고 있습니다.<br/><br/>
              우리는 단순한 신발을 제작하지 않습니다. <br/>
              당신이 나아가는 모든 순간에 <br/>
              <strong>열정</strong>과 <strong>아름다움</strong>이 깃들기를 바라는 마음으로 시작되었습니다.<br/><br/>
              아르데오는 <strong>열망이 머무는 방식</strong>에 대해 고민합니다.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="trust-section">
      <div class="content-inner">
        <div class="trust-header">
          <span class="trust-badge">OUR PHILOSOPHY</span>
          <h2>본질에 집중해 완성한<br/>완벽한 한 걸음</h2>
          <div class="separator"></div>
          <p class="trust-sub-desc">단순한 신발 그 이상의 가치를 위해,<br/>아르데오는 타협하지 않는 공정으로 신뢰를 쌓아갑니다.</p>
        </div>
        
        <div class="trust-grid">
          <div class="trust-item" v-for="(item, idx) in trustItems" :key="idx">
            <div class="trust-num">0{{ idx + 1 }}</div>
            <div class="trust-text">
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="value-section">
      <div class="content-inner grid-layout">
        <div class="info-item" v-for="val in values" :key="val.label">
          <span class="info-label">{{ val.label }}</span>
          <h3>{{ val.title }}</h3>
          <p>{{ val.desc }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* 전체 레이아웃 */
.about-container { 
  width: 100%;
  background-color: #fff;
  color: #111;
  font-family: 'Pretendard', -apple-system, sans-serif;
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

.content-inner { 
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.label { 
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #222;
  margin-bottom: 24px;
  display: block;
}

/* 히어로 색션 스타일 */
.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #050505;
  color: #fff;
  position: relative;
}

.hero-tag { 
  font-size: 13px;
  letter-spacing: 6px;
  color: #777;
  margin-bottom: 20px;
  display: block;
}

/* ARDEO 로고 그라데이션 */
.brand-logo {
  font-size: clamp(3.5rem, 12vw, 8rem);
  font-weight: 900;
  letter-spacing: 20px;
  margin-bottom: 40px;
  margin-right: -20px;
  color: transparent;
  background: linear-gradient(to right, #ffffff, #6a8fe7, #ffffff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 5s linear infinite; /* 빛 흐르는 효과 */
}

/* 로고 그라데이션 이동 */
@keyframes shine {
  to { background-position: 200% center; }
}

.hero-desc { 
  font-size: 1.4rem;
  line-height: 1.8;
  color: #999;
  font-weight: 300;
}

.highlight { 
  color: #fff;
  font-weight: 400;
}

/* 비전 섹션 스타일 */
.vision-section { 
  padding: 180px 0;
  background: #fff;
}

.vision-content { 
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 60px;
}

.vision-title h2 { 
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.vision-text { 
  max-width: 550px;
  font-size: 1.2rem;
  line-height: 2;
  color: #444;
  padding-top: 15px;
}

.vision-text strong { 
  color: #111;
  font-weight: 600;
}

/* 트러스트 섹션 스타일 */
.trust-section { 
  padding: 180px 0;
  background-color: #f9f9f9;
}

.trust-header { 
  text-align: center;
  margin-bottom: 100px;
}

.trust-badge { 
  font-size: 11px;
  padding: 8px 20px;
  font-weight: bold;
  color: #111;
  border-radius: 2px;
  letter-spacing: 2px;
}

.trust-header h2 { 
  font-size: 3rem;
  font-weight: 700;
  margin: 40px 0 20px;
  line-height: 1.2;
}

.separator { 
  width: 40px;
  height: 2px;
  background: #6a8fe7;
  margin: 30px auto;
}

.trust-sub-desc { 
  color: #666;
  font-size: 1.15rem;
  font-weight: 300;
}

.trust-grid { 
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

/* 트러스트 카드 */
.trust-item { 
  background: #fff;
  padding: 50px;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 30px;
  transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.trust-item:hover { 
  transform: translateY(-15px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.08);
  border-color: #6a8fe7;
}

.trust-num { 
  font-size: 1rem;
  font-weight: 900;
  color: #6a8fe7;
  letter-spacing: 2px;
}

.trust-text h4 { 
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.trust-text p { 
  font-size: 1rem;
  line-height: 1.7;
  color: #666;
  word-break: keep-all;
}

/* 벨류 섹션 스타일 */
.value-section { 
  padding: 120px 0 180px;
}

.grid-layout { 
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
}

/* 가치 카드 */
.info-item { 
  text-align: left;
  padding-top: 40px;
  border-top: 2px solid #111;
}

.info-label { 
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #999;
  display: block;
  margin-bottom: 20px;
}

.info-item h3 { 
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.info-item p { 
  color: #555;
  font-size: 1.05rem;
  line-height: 1.8;
}

/* 스크롤 애니메이션 */
.fade-in-up { 
  animation: fadeInUp 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
}

.delay-1 { animation-delay: 0.4s; }
.delay-2 { animation-delay: 0.8s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 스크롤 인디케이터 */
.scroll-indicator { 
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: #666;
  font-size: 10px;
  letter-spacing: 2px;
}

/* 마우스 형태 */
.mouse { 
  width: 20px;
  height: 35px;
  border: 1px solid #444;
  border-radius: 20px;
  margin: 0 auto 10px;
  position: relative;
}

/* 스크롤 점 애니메이션 */
.mouse::after { 
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 6px;
  background: #6a8fe7;
  border-radius: 2px;
  animation: scroll 2s infinite;
}

@keyframes scroll {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 15px); }
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .vision-content { flex-direction: column; gap: 30px; }
  .trust-grid { grid-template-columns: 1fr; }
  .grid-layout { grid-template-columns: 1fr; }
  .vision-title h2 { font-size: 2.5rem; }
}
</style>
