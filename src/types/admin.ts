export interface AdminUser {
  id: string;
  nickname: string;
  email: string;
  district: string;
  temperature: number;
  totalTemperature: number;
  rank: number;
  status: 'active' | 'suspended';
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  createdAt: string;
}

export interface AdminFeed {
  id: string;
  type: 'activity' | 'gathering';
  authorNickname: string;
  authorDistrict: string;
  title?: string;
  content: string;
  imageUrl?: string;
  imageUrls: string[];
  likes: number;
  comments: number;
  status: 'normal' | 'hidden' | 'review';
  reported: boolean;
  reportReason?: string;
  createdAt: string;
}

export interface AdminVerification {
  id: string;
  userNickname: string;
  userDistrict: string;
  missionTitle: string;
  missionCategory: string;
  imageUrl: string;
  description: string;
  aiResult: 'pass' | 'fail' | 'uncertain';
  confidenceScore: number;
  detectedObjects: string[];
  imageQuality: 'good' | 'fair' | 'poor';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface AdminMissionPolicy {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: string;
  isActive: boolean;
  type: 'daily' | 'hidden';
  verificationMethod?: string;
  activityType?: string;
  reason?: string;
}

export interface AdminPolicyHistory {
  id: string;
  missionTitle: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsersThisMonth: number;
  todayVerifications: number;
  aiFailureRate: number;
  pendingReviews: number;
  todayFeeds: number;
}
