# 온동네 (Ondongne)

> 온라인으로 연결된 온기 있는 우리 동네

## 📌 프로젝트 소개

온동네는 서울시 각 구 단위 주민들이 미션, 인증, 피드 활동을 통해 지역 참여를 늘리고 동네 분위기를 활성화할 수 있도록 돕는 **지역 커뮤니티 참여 촉진 서비스**입니다.

### 핵심 컨셉
- 사용자는 서울시 특정 "구"에 소속
- 미션 수행, 활동 인증, 피드 참여 등을 통해 "온도"를 획득
- 개인 랭킹과 동네 랭킹이 존재
- 월간 온도 초기화 + 누적 온도 유지
- 누적 온도 기반 배지/업적 시스템
- 상위 랭커에게 리워드 제공

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 로그인/회원가입 | 이메일 기반 인증, 동네(구) 선택 |
| 홈 대시보드 | 날씨, 내 온도, 순위, 퀵 액션 |
| 일일 미션 | 쓰레기 줍기, 텀블러 사용 등 일일 미션 수행 |
| 히든 미션 | AI 추천 미션 (mock 기반) |
| 미션 인증 | 사진 업로드 + AI 검증 (mock) |
| 소식 피드 | 활동 기록 피드 + 동네 모임 모집 |
| 순위 | 동네 순위 / 개인 순위 |
| 마이페이지 | 프로필, 온도, 배지, 보상함, 활동 내역 |

## 🛠 기술 스택

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 6
- **State**: React Query + useState
- **UI**: shadcn/ui 커스텀, Lucide Icons
- **Font**: Pretendard Variable

## 📁 폴더 구조

```
src/
├── components/
│   ├── common/      # PageHeader, TabSwitcher, LoadingSpinner 등
│   ├── layout/      # AppLayout, BottomTabBar
│   └── ui/          # shadcn/ui 컴포넌트
├── mocks/           # Mock 데이터
├── pages/           # 페이지 컴포넌트
├── services/        # 서비스 레이어 (API 추상화)
└── types/           # TypeScript 타입 정의
```

## 🏃 실행 방법

```bash
npm install
npm run dev
```

## 👤 사용자 플로우

1. **로그인** → 이메일/비밀번호 입력 (아무 값이나 입력하면 mock 로그인)
2. **홈** → 날씨, 내 온도, 순위 확인 + 퀵 액션
3. **미션** → 일일/히든 미션 확인 → 인증하러 가기
4. **인증** → 사진 업로드 → AI 검증 결과 확인
5. **소식** → 활동 기록 피드 / 동네 모임 탐색 → 글쓰기
6. **순위** → 동네/개인 순위 확인
7. **마이** → 프로필, 배지, 보상함, 활동 내역

## 📄 페이지 구성

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 로그인 | 이메일/비밀번호 로그인 |
| `/signup` | 회원가입 | 이메일, 비밀번호, 닉네임, 동네 선택 |
| `/home` | 홈 | 메인 대시보드 |
| `/mission` | 미션 | 일일/히든 미션 목록 |
| `/mission/verify` | 미션 인증 | 사진 업로드 + 인증 |
| `/news` | 소식 | 활동 기록 / 동네 모임 피드 |
| `/news/write` | 글쓰기 | 피드/모임 글 작성 |
| `/ranking` | 순위 | 동네/개인 순위 |
| `/mypage` | 마이페이지 | 프로필, 메뉴 |
| `/mypage/activity` | 활동 내역 | 글/좋아요/댓글 내역 |
| `/mypage/rewards` | 보상함 | 리워드 수령 |
| `/mypage/badges` | 배지 | 업적/배지 현황 |

## 🧪 Mock 기반 개발

모든 데이터는 `src/mocks/` 디렉토리의 mock 데이터를 사용합니다.
`src/services/` 레이어가 mock 데이터를 반환하며, 추후 실제 API로 교체 시 서비스 함수 내부만 수정하면 됩니다.

## 🔗 추후 백엔드 연동 포인트

코드 내 `// TODO: 추후 백엔드 API 연결 예정` 주석으로 교체 포인트가 표시되어 있습니다.

| 서비스 | 현재 | 추후 |
|--------|------|------|
| authService | Mock 로그인/가입 | JWT 기반 인증 API |
| weatherService | Mock 날씨 | OpenWeatherMap API |
| missionService | Mock 미션 목록 | REST API + AI 추천 |
| newsService | Mock 피드 | REST API + S3 이미지 |
| rankingService | Mock 순위 | 실시간 집계 API |
| profileService | Mock 프로필 | 사용자 DB 연동 |
