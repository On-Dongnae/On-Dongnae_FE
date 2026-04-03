# 📱 온-동네 (On-Dongnae) - Frontend

**온-동네**는 지역 공동체 기반의 게이미피케이션 및 친환경 활동 플랫폼입니다. 사용자의 활동을 '온도'라는 수치로 환산하여 동네 간의 선한 경쟁을 유도하고, AI가 자동으로 미션을 검증하고 추천하는 현대적인 웹 애플리케이션입니다.

> [!NOTE]
> 본 리포지토리는 온-동네 서비스의 **프론트엔드** 코드베이스를 담고 있습니다.

## ✨ 핵심 기능 (Core Features)

### 1. 게이미피케이션 미션 시스템
- **인증 제출**: 사진 업로드 및 활동 설명 제출 프로세스.
- **AI 자동 검증 유저 피드백**: AI 분석 결과(신뢰도, 분석된 객체, 이미지 품질)를 시각적으로 전달.
- **히든 미션**: 사용자 활동 패턴에 기반하여 AI가 찾아낸 맞춤형 히든 미션 표시.

### 2. 커뮤니티 & 소셜 피드
- **활동 공유**: 미션 수행 결과를 피드 형태로 공유하고 이웃과 소통.
- **모임 모집**: 지역 기반의 오프라인 모임을 개설하고 참여.
- **반응형 피드**: 모바일에 최적화된 스크롤 및 인터랙션 제공.

### 3. 온드(온도) & 랭킹 시스템
- **동네 온도 순위**: 서울 각 구별 평균 온도 랭킹 시각화.
- **개인 랭킹**: 활동량에 따른 상위 사용자 목록 제공.
- **랭킹 맵**: 지도를 활용한 동네별 기여도 시각화.

### 4. 관리자 통합 대시보드
- **KPI 모니터링**: 오늘 인증 요청, 자동 승인율, AI 실패율 등 핵심 데이터 대시보드.
- **전문화된 인증 관리**: AI 분석 결과를 바탕으로 한 효율적인 수동 인증 검토 및 처리.
- **미션 및 유저 관리**: 서비스 정책에 따른 미션 생성/수정 및 유저 상태 관리.

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 |
| :--- | :--- |
| **Framework** | React 18 (Vite) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS / Shadcn/UI (Radix UI) |
| **State Management** | Zustand (Global) / TanStack Query v5 (Server) |
| **Routing** | React Router DOM v6 |
| **Visualization** | Leaflet (Maps) / Recharts (Charts) |
| **Form/Validation** | React Hook Form / Zod |
| **Icons & Toasts** | Lucide React / Sonner |

## 📂 프로젝트 구조 (Structure)

```bash
src/
├── components/     # 재사용 가능한 UI 컴포넌트 (admin, common, news 등)
├── hooks/          # 커스텀 훅 (인증, 필터링 등)
├── lib/            # api 설정 (Axios), 유틸리티 함수
├── mocks/          # 로컬 테스트를 위한 Mock 데이터
├── pages/          # 페이지 단위 컴포넌트 (서비스 / 관리자 분리)
├── services/       # API 서비스 레이어 (비즈니스 로직 분리)
├── store/          # Zustand 상태 저장소
├── types/          # TypeScript 인터페이스 정의
└── App.tsx         # 라우팅 및 전역 Provider 설정
```

## 🚀 시작하기 (Getting Started)

### 사전 요구 사항
- Node.js (v18 이상 권장)
- npm or yarn

### 설치 및 로컬 호스팅
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

## 🎨 디자인 가이드라인
- **Accent Color**: `#B7E36C` (Fresh Green - 생기 있는 온기를 상징)
- **Font**: Inter / Modern Sans-Serif
- **Glassmorphism**: 관리자 페이지 및 대시보드 요소에 은은한 투명 레이어 적용
- **Responsive**: Mobile-First 디자인으로 대부분의 사용자 페이지 구성
