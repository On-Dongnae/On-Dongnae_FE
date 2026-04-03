import { Badge, Reward, ActivityRecord } from '@/types';

export const badges: Badge[] = [
  { id: 'b1', name: '첫 발걸음', description: '누적 온도 10도 달성', icon: '🌱', requirement: 10, earned: true },
  { id: 'b2', name: '따뜻한 이웃', description: '누적 온도 50도 달성', icon: '🤝', requirement: 50, earned: true },
  { id: 'b3', name: '동네 히어로', description: '누적 온도 100도 달성', icon: '🦸', requirement: 100, earned: true },
  { id: 'b4', name: '온도 마스터', description: '누적 온도 200도 달성', icon: '🔥', requirement: 200, earned: false },
  { id: 'b5', name: '전설의 주민', description: '누적 온도 500도 달성', icon: '👑', requirement: 500, earned: false },
  { id: 'b6', name: '환경 지킴이', description: '환경 미션 20회 완료', icon: '♻️', requirement: 150, earned: true },
];

export const rewards: Reward[] = [
  { id: 'r1', name: '스타벅스 아메리카노', description: '월간 개인 랭킹 TOP 10 보상', status: 'available' },
  { id: 'r2', name: 'CU 3000원 쿠폰', description: '월간 개인 랭킹 TOP 20 보상', status: 'claimed' },
  { id: 'r3', name: '배달의민족 5000원 쿠폰', description: '지난달 동네 랭킹 1위 보상', status: 'expired' },
];

export const activityRecords: ActivityRecord[] = [
  { id: 'a1', type: 'post', title: '플로깅 인증했어요!', createdAt: '2시간 전' },
  { id: 'a2', type: 'like', title: '햇살이님의 활동에 좋아요', createdAt: '3시간 전' },
  { id: 'a3', type: 'comment', title: '동네지기님의 글에 댓글', createdAt: '5시간 전', preview: '멋져요! 저도 다음에 참여할게요' },
  { id: 'a4', type: 'post', title: '텀블러 사용 인증', createdAt: '어제' },
  { id: 'a5', type: 'like', title: '걷기왕님의 활동에 좋아요', createdAt: '어제' },
];
