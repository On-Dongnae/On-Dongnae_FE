import {
  AdminUser,
  AdminFeed,
  AdminVerification,
  AdminMissionPolicy,
  AdminPolicyHistory,
  AdminDashboardStats,
} from '@/types/admin';

export const adminDashboardStats: AdminDashboardStats = {
  totalUsers: 3842,
  activeUsersThisMonth: 1256,
  todayVerifications: 187,
  aiFailureRate: 12.4,
  pendingReviews: 23,
  todayFeeds: 64,
};

export const adminUsers: AdminUser[] = [
  { id: 'u1', nickname: '걷기왕', email: 'walkking@test.com', district: '성동구', temperature: 52, totalTemperature: 290, rank: 1, status: 'active', postsCount: 34, commentsCount: 89, likesCount: 156, createdAt: '2024-08-10' },
  { id: 'u2', nickname: '봉사러버', email: 'volunteer@test.com', district: '종로구', temperature: 49, totalTemperature: 270, rank: 2, status: 'active', postsCount: 28, commentsCount: 72, likesCount: 134, createdAt: '2024-07-05' },
  { id: 'u3', nickname: '햇살이', email: 'sunny@test.com', district: '강남구', temperature: 47, totalTemperature: 245, rank: 3, status: 'active', postsCount: 22, commentsCount: 56, likesCount: 98, createdAt: '2024-10-15' },
  { id: 'u4', nickname: '에코맨', email: 'ecoman@test.com', district: '서대문구', temperature: 44, totalTemperature: 220, rank: 4, status: 'active', postsCount: 19, commentsCount: 45, likesCount: 87, createdAt: '2024-10-01' },
  { id: 'u5', nickname: '동네지기', email: 'keeper@test.com', district: '마포구', temperature: 42, totalTemperature: 210, rank: 5, status: 'active', postsCount: 31, commentsCount: 67, likesCount: 112, createdAt: '2024-09-20' },
  { id: 'u6', nickname: '플로거', email: 'plogger@test.com', district: '송파구', temperature: 40, totalTemperature: 205, rank: 6, status: 'active', postsCount: 15, commentsCount: 38, likesCount: 76, createdAt: '2024-08-25' },
  { id: 'u7', nickname: '나눔이', email: 'sharing@test.com', district: '강남구', temperature: 38, totalTemperature: 195, rank: 7, status: 'active', postsCount: 12, commentsCount: 34, likesCount: 65, createdAt: '2024-09-15' },
  { id: 'u8', nickname: '따뜻해', email: 'warm@test.com', district: '강서구', temperature: 36, totalTemperature: 180, rank: 8, status: 'suspended', postsCount: 8, commentsCount: 22, likesCount: 43, createdAt: '2024-10-10' },
  { id: 'u9', nickname: '초록이', email: 'green@test.com', district: '영등포구', temperature: 34, totalTemperature: 175, rank: 9, status: 'active', postsCount: 10, commentsCount: 28, likesCount: 52, createdAt: '2024-11-01' },
  { id: 'u10', nickname: '선행러', email: 'gooddeed@test.com', district: '용산구', temperature: 32, totalTemperature: 168, rank: 10, status: 'active', postsCount: 14, commentsCount: 41, likesCount: 71, createdAt: '2024-09-05' },
  { id: 'u11', nickname: '따뜻한사람', email: 'test@ondongne.com', district: '마포구', temperature: 28, totalTemperature: 187, rank: 12, status: 'active', postsCount: 20, commentsCount: 55, likesCount: 93, createdAt: '2024-11-01' },
  { id: 'u12', nickname: '초록바람', email: 'greenwind@test.com', district: '마포구', temperature: 22, totalTemperature: 165, rank: 15, status: 'active', postsCount: 7, commentsCount: 19, likesCount: 31, createdAt: '2024-11-20' },
  { id: 'u13', nickname: '환경맨', email: 'envman@test.com', district: '동작구', temperature: 30, totalTemperature: 160, rank: 11, status: 'active', postsCount: 11, commentsCount: 30, likesCount: 58, createdAt: '2024-10-05' },
  { id: 'u14', nickname: '꽃길러', email: 'flower@test.com', district: '관악구', temperature: 26, totalTemperature: 150, rank: 13, status: 'suspended', postsCount: 5, commentsCount: 15, likesCount: 27, createdAt: '2024-11-10' },
  { id: 'u15', nickname: '착한이', email: 'kind@test.com', district: '구로구', temperature: 24, totalTemperature: 140, rank: 14, status: 'active', postsCount: 9, commentsCount: 25, likesCount: 44, createdAt: '2024-11-15' },
];

export const adminFeeds: AdminFeed[] = [
  { id: 'af1', type: 'activity', authorNickname: '햇살이', authorDistrict: '강남구', content: '오늘 한강공원에서 플로깅 했어요! 쓰레기 한 봉지 가득 주웠습니다 🌿', likes: 24, comments: 2, status: 'normal', reported: false, createdAt: '2025-04-03 14:30' },
  { id: 'af2', type: 'activity', authorNickname: '동네지기', authorDistrict: '마포구', content: '텀블러 들고 다니니까 카페 사장님이 좋아하시더라구요 ☕️', likes: 18, comments: 2, status: 'normal', reported: false, createdAt: '2025-04-03 12:00' },
  { id: 'af3', type: 'activity', authorNickname: '걷기왕', authorDistrict: '성동구', content: '오늘도 7000보 달성! 매일 걸으니까 확실히 건강해지는 느낌 💪', likes: 32, comments: 2, status: 'normal', reported: false, createdAt: '2025-04-03 11:00' },
  { id: 'af4', type: 'activity', authorNickname: '에코맨', authorDistrict: '서대문구', content: '헌혈 다녀왔습니다! 누군가에게 도움이 되길 바라며 🩸', likes: 45, comments: 3, status: 'review', reported: true, reportReason: '인증 사진이 부적절할 수 있음', createdAt: '2025-04-02 16:00' },
  { id: 'af5', type: 'activity', authorNickname: '따뜻해', authorDistrict: '강서구', content: '오늘 동네 골목을 걸으면서 쓰레기 주웠어요. 작은 실천이 큰 변화!', likes: 12, comments: 1, status: 'hidden', reported: true, reportReason: '홍보성 게시글 의심', createdAt: '2025-04-01 09:15' },
  { id: 'af6', type: 'gathering', authorNickname: '동네지기', authorDistrict: '마포구', title: '망원한강공원 플로깅 모임', content: '함께 한강공원을 깨끗하게 만들어요! 장갑과 봉투는 준비해갑니다.', likes: 15, comments: 2, status: 'normal', reported: false, createdAt: '2025-04-02 18:00' },
  { id: 'af7', type: 'gathering', authorNickname: '걷기왕', authorDistrict: '성동구', title: '성수동 재활용 워크숍', content: '올바른 분리수거 방법을 배우고 실천해봐요!', likes: 8, comments: 1, status: 'normal', reported: false, createdAt: '2025-04-01 14:00' },
  { id: 'af8', type: 'gathering', authorNickname: '봉사러버', authorDistrict: '종로구', title: '종로 어르신 말벗 봉사', content: '어르신들과 함께하는 따뜻한 시간. 누구나 참여 가능합니다.', likes: 22, comments: 2, status: 'normal', reported: false, createdAt: '2025-03-31 10:00' },
  { id: 'af9', type: 'gathering', authorNickname: '따뜻한온기', authorDistrict: '강북구', title: '단체 연탄 봉사 함께하실 분 모집', content: '겨울철 에너지 취약계층을 위한 연탄 나눔 봉사입니다.', likes: 31, comments: 3, status: 'review', reported: true, reportReason: '외부 링크 포함', createdAt: '2025-04-03 08:00' },
];

export const adminVerifications: AdminVerification[] = [
  { id: 'v1', userNickname: '햇살이', userDistrict: '강남구', missionTitle: '쓰레기 줍기', missionCategory: '환경', imageUrl: '', description: '한강 공원에서 쓰레기 한 봉투 가득 주웠습니다.', aiResult: 'fail', confidenceScore: 42, detectedObjects: ['사람', '봉투'], imageQuality: 'fair', status: 'pending', submittedAt: '2025-04-03 14:20' },
  { id: 'v2', userNickname: '동네지기', userDistrict: '마포구', missionTitle: '카페에서 텀블러 사용하기', missionCategory: '환경', imageUrl: '', description: '오늘도 텀블러로 아메리카노 한 잔!', aiResult: 'uncertain', confidenceScore: 58, detectedObjects: ['텀블러', '카운터'], imageQuality: 'good', status: 'pending', submittedAt: '2025-04-03 13:45' },
  { id: 'v3', userNickname: '걷기왕', userDistrict: '성동구', missionTitle: '6000보 걷기', missionCategory: '건강', imageUrl: '', description: '오늘 만보기 7200보 달성했습니다!', aiResult: 'pass', confidenceScore: 92, detectedObjects: ['만보기 스크린샷'], imageQuality: 'good', status: 'approved', submittedAt: '2025-04-03 11:30' },
  { id: 'v4', userNickname: '에코맨', userDistrict: '서대문구', missionTitle: '헌혈 인증', missionCategory: '봉사', imageUrl: '', description: '헌혈증 사진입니다.', aiResult: 'fail', confidenceScore: 35, detectedObjects: ['카드', '손'], imageQuality: 'poor', status: 'pending', submittedAt: '2025-04-03 10:00' },
  { id: 'v5', userNickname: '봉사러버', userDistrict: '종로구', missionTitle: '대중교통 이용하기', missionCategory: '교통', imageUrl: '', description: '지하철 탑승 인증입니다.', aiResult: 'pass', confidenceScore: 88, detectedObjects: ['교통카드', '지하철 내부'], imageQuality: 'good', status: 'approved', submittedAt: '2025-04-03 09:15' },
  { id: 'v6', userNickname: '플로거', userDistrict: '송파구', missionTitle: '쓰레기 줍기', missionCategory: '환경', imageUrl: '', description: '송파구 올림픽공원 주변에서 플로깅 완료!', aiResult: 'uncertain', confidenceScore: 55, detectedObjects: ['공원', '쓰레기봉투'], imageQuality: 'fair', status: 'pending', submittedAt: '2025-04-03 08:30' },
  { id: 'v7', userNickname: '나눔이', userDistrict: '강남구', missionTitle: '카페에서 텀블러 사용하기', missionCategory: '환경', imageUrl: '', description: '텀블러로 라떼를 주문했어요.', aiResult: 'pass', confidenceScore: 85, detectedObjects: ['텀블러', '음료'], imageQuality: 'good', status: 'approved', submittedAt: '2025-04-02 17:00' },
  { id: 'v8', userNickname: '초록이', userDistrict: '영등포구', missionTitle: '6000보 걷기', missionCategory: '건강', imageUrl: '', description: '영등포 타임스퀘어 주변 산책했어요.', aiResult: 'fail', confidenceScore: 28, detectedObjects: ['스크린샷'], imageQuality: 'poor', status: 'rejected', submittedAt: '2025-04-02 15:30' },
  { id: 'v9', userNickname: '따뜻한사람', userDistrict: '마포구', missionTitle: '동네 플로깅 챌린지', missionCategory: '환경', imageUrl: '', description: '망원동 하천변에서 플로깅하며 쓰레기 수거했습니다.', aiResult: 'uncertain', confidenceScore: 61, detectedObjects: ['하천', '봉투', '장갑'], imageQuality: 'good', status: 'pending', submittedAt: '2025-04-03 07:45' },
  { id: 'v10', userNickname: '선행러', userDistrict: '용산구', missionTitle: '올바른 분리배출 실천하기', missionCategory: '환경', imageUrl: '', description: '재활용품 분리배출 완료했습니다.', aiResult: 'fail', confidenceScore: 40, detectedObjects: ['분리수거함'], imageQuality: 'fair', status: 'pending', submittedAt: '2025-04-02 20:00' },
];

export const adminMissionPolicies: AdminMissionPolicy[] = [
  { id: 'mp1', title: '쓰레기 줍기', description: '동네 길거리나 공원에서 쓰레기를 주워 깨끗한 환경을 만들어요.', points: 1, category: '환경', difficulty: '쉬움', isActive: true, type: 'daily' },
  { id: 'mp2', title: '카페에서 텀블러 사용하기', description: '일회용 컵 대신 텀블러를 가져가 음료를 받아보세요.', points: 1, category: '환경', difficulty: '쉬움', isActive: true, type: 'daily' },
  { id: 'mp3', title: '대중교통 이용하기', description: '버스나 지하철을 이용해서 이동해보세요.', points: 1, category: '교통', difficulty: '쉬움', isActive: true, type: 'daily' },
  { id: 'mp4', title: '6000보 걷기', description: '건강도 챙기고 온도도 올리는 걷기 미션!', points: 1, category: '건강', difficulty: '보통', isActive: true, type: 'daily' },
  { id: 'mp5', title: '헌혈 인증', description: '생명을 나누는 따뜻한 활동, 헌혈에 참여해보세요.', points: 5, category: '봉사', difficulty: '어려움', isActive: true, type: 'daily' },
  { id: 'mp6', title: '동네 플로깅 챌린지', description: '우리 동네 하천변이나 공원 주변을 걸으면서 쓰레기를 주워보세요.', points: 2, category: '환경', difficulty: '쉬움', isActive: true, type: 'hidden', verificationMethod: '수거한 쓰레기봉투 또는 활동 장면 사진 인증', activityType: '플로깅', reason: '요즘 마포구 망원한강공원 일대에 산책 인구가 늘면서 플로깅 참여율이 높아지고 있어요.' },
  { id: 'mp7', title: '올바른 분리배출 실천하기', description: '집에 쌓인 재활용품을 깨끗이 씻고 올바르게 분리배출해보세요.', points: 2, category: '환경', difficulty: '쉬움', isActive: true, type: 'hidden', verificationMethod: '분리배출 완료 사진 인증', activityType: '리사이클링', reason: '이번 주는 자원순환 주간이에요!' },
  { id: 'mp8', title: '대기전력 차단 챌린지', description: '사용하지 않는 가전의 플러그를 뽑거나 멀티탭을 꺼서 에너지를 절약해보세요.', points: 2, category: '에너지', difficulty: '보통', isActive: true, type: 'hidden', verificationMethod: '멀티탭 OFF 상태 또는 절전 실천 사진 인증', activityType: '에너지 절약', reason: '서울시 에너지 절약 캠페인 기간이에요.' },
  { id: 'mp9', title: '연탄 나눔 봉사 참여하기', description: '에너지 취약계층을 위한 연탄 배달 봉사에 참여해보세요.', points: 3, category: '봉사', difficulty: '어려움', isActive: false, type: 'hidden', verificationMethod: '봉사 현장 사진 또는 봉사 확인 이미지 인증', activityType: '연탄 봉사', reason: '겨울을 앞두고 마포구 일대 연탄 봉사 모집이 시작되었어요.' },
];

export const adminPolicyHistory: AdminPolicyHistory[] = [
  { id: 'ph1', missionTitle: '헌혈 인증', field: '획득 온도', oldValue: '3°C', newValue: '5°C', changedBy: '관리자1', changedAt: '2025-03-28' },
  { id: 'ph2', missionTitle: '연탄 나눔 봉사 참여하기', field: '상태', oldValue: '활성', newValue: '비활성', changedBy: '관리자1', changedAt: '2025-03-25' },
  { id: 'ph3', missionTitle: '쓰레기 줍기', field: '난이도', oldValue: '보통', newValue: '쉬움', changedBy: '관리자2', changedAt: '2025-03-20' },
  { id: 'ph4', missionTitle: '동네 플로깅 챌린지', field: '획득 온도', oldValue: '1°C', newValue: '2°C', changedBy: '관리자1', changedAt: '2025-03-15' },
];
