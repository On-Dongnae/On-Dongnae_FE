export interface User {
  id: string;
  email: string;
  nickname: string;
  district: string; // 서울시 구
  temperature: number; // 월간 온도
  totalTemperature: number; // 누적 온도
  rank: number;
  districtRank: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface WeatherInfo {
  district: string;
  temperature: number;
  condition: '맑음' | '흐림' | '비' | '눈' | '구름많음';
  icon: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: '쉬움' | '보통' | '어려움';
  estimatedTime: string;
  category: string;
  completed: boolean;
}

export interface HiddenMission extends Mission {
  reason: string;
  verificationMethod: string;
  activityType: string;
}

export interface VerificationResult {
  status: 'approved' | 'review' | 'rejected';
  message: string;
}

export interface FeedPost {
  id: string;
  authorNickname: string;
  authorDistrict: string;
  createdAt: string;
  imageUrl: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export interface GatheringPost {
  id: string;
  title: string;
  authorNickname: string;
  authorDistrict: string;
  location: string;
  schedule: string;
  description: string;
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: string;
}

export interface DistrictRanking {
  rank: number;
  district: string;
  averageTemperature: number;
}

export interface PersonalRanking {
  rank: number;
  nickname: string;
  district: string;
  temperature: number;
  avatarUrl?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number; // 필요 누적 온도
  earned: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'claimed' | 'expired';
  imageUrl?: string;
}

export interface ActivityRecord {
  id: string;
  type: 'post' | 'like' | 'comment';
  title: string;
  createdAt: string;
  preview?: string;
}

export interface NewsComment {
  id: string;
  postId: string;
  authorNickname: string;
  content: string;
  createdAt: string;
}
