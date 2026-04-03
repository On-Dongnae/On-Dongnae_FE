import api from '@/lib/api';
import type { AdminUser, AdminVerification, AdminMissionPolicy, AdminFeed, AdminDashboardStats } from '@/types/admin';
import type { DistrictRanking, PersonalRanking } from '@/types';
import { adminPolicyHistory } from '@/mocks/admin';

// ──────────────────────────────────────
// 백엔드 DTO 인터페이스 (내부 사용)
// ──────────────────────────────────────
interface AdminUserResponseDto {
  userId: number;
  email: string;
  nickname: string;
  role: string;
  status: string; // ACTIVE | SUSPENDED
  profileImageUrl: string | null;
  totalScore: number;
  regionName: string;
  createdAt: string;
}

interface VerificationDto {
  id: number;
  userMissionId: number;
  status: string; // PENDING | APPROVED | REJECTED
  content: string;
  imageUrls: string[];
  verifiedAt: string | null;
}

interface MissionDto {
  id: number;
  type: string; // DAILY | HIDDEN
  name: string;
  description: string;
  pointAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface FeedResponseDto {
  id: number;
  userId: number;
  userEmail: string;
  type: string; // ACTIVITY | MEETING
  title?: string;
  content: string;
  likeCount: number;
  commentCount: number;
  imageUrls: string[];
  createdAt: string;
}

interface RegionRankingDto {
  regionName: string;
  totalScore: number;
}

interface UserRankingDto {
  userId: number;
  nickname: string;
  regionName: string;
  totalScore: number;
}

interface ApiRes<T> {
  status: number;
  message: string;
  data: T;
}

// ──────────────────────────────────────
// 매핑 헬퍼
// ──────────────────────────────────────
const generateNickname = (email: string) => email ? email.split('@')[0] : '이웃';
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ──────────────────────────────────────
// adminService
// ──────────────────────────────────────
export const adminService = {

  // ── 유저 관리 ──
  getUsers: async (): Promise<AdminUser[]> => {
    const res = await api.get<ApiRes<AdminUserResponseDto[]>>('/api/admin/users');
    return res.data.data.map((u, idx) => ({
      id: String(u.userId),
      nickname: u.nickname || generateNickname(u.email),
      email: u.email,
      district: u.regionName || '미설정',
      temperature: u.totalScore,     // 월간 온도 = totalScore (BE에 월간 개념 없음)
      totalTemperature: u.totalScore,
      rank: idx + 1,
      status: (u.status === 'ACTIVE' ? 'active' : 'suspended') as 'active' | 'suspended',
      postsCount: 0,   // BE에 없는 필드
      commentsCount: 0,
      likesCount: 0,
      createdAt: formatDate(u.createdAt),
    }));
  },

  suspendUser: async (userId: string, reason: string): Promise<void> => {
    await api.post(`/api/admin/users/${userId}/suspend`, { reason });
  },

  activateUser: async (userId: string): Promise<void> => {
    await api.post(`/api/admin/users/${userId}/activate`);
  },

  adjustScore: async (userId: string, regionId: number, amount: number): Promise<void> => {
    await api.post(`/api/admin/users/${userId}/score`, { regionId, amount });
  },

  // ── 인증 관리 ──
  getVerifications: async (status?: string): Promise<AdminVerification[]> => {
    const param = status && status !== 'all' ? `?status=${status.toUpperCase()}` : '?status=PENDING';
    const res = await api.get<ApiRes<VerificationDto[]>>(`/api/admin/verifications${param}`);
    return res.data.data.map(v => ({
      id: String(v.id),
      userNickname: `유저#${v.userMissionId}`,
      userDistrict: '-',
      missionTitle: `미션 #${v.userMissionId}`,
      missionCategory: '-',
      imageUrl: v.imageUrls?.[0] || '',
      imageUrls: v.imageUrls || [],
      description: v.content || '',
      aiResult: 'uncertain' as const,
      confidenceScore: 0,
      detectedObjects: [],
      imageQuality: 'fair' as const,
      status: (v.status === 'PENDING' ? 'pending' : v.status === 'APPROVED' ? 'approved' : 'rejected') as 'pending' | 'approved' | 'rejected',
      submittedAt: v.verifiedAt ? formatDate(v.verifiedAt) : '-',
    }));
  },

  approveVerification: async (verificationId: string): Promise<void> => {
    await api.patch(`/api/admin/verifications/${verificationId}/approve`);
  },

  rejectVerification: async (verificationId: string, reason: string): Promise<void> => {
    await api.patch(`/api/admin/verifications/${verificationId}/reject`, { reason });
  },

  // ── 미션 관리 ──
  getMissionPolicies: async (): Promise<AdminMissionPolicy[]> => {
    const res = await api.get<ApiRes<MissionDto[]>>('/api/missions');
    return res.data.data.map(m => ({
      id: String(m.id),
      title: m.name,
      description: m.description,
      points: m.pointAmount,
      category: '-',
      difficulty: '보통',
      isActive: m.isActive,
      type: (m.type === 'DAILY' ? 'daily' : 'hidden') as 'daily' | 'hidden',
      verificationMethod: 'AI 사진 인증',
      activityType: m.type === 'DAILY' ? '일일' : '히든',
    }));
  },

  createMission: async (data: { name: string; description: string; type: string; pointAmount: number; startDate: string; endDate: string }): Promise<void> => {
    await api.post('/api/admin/missions', data);
  },

  updateMission: async (id: string, data: { name?: string; description?: string; type?: string; pointAmount?: number }): Promise<void> => {
    await api.patch(`/api/admin/missions/${id}`, data);
  },

  // ── 피드 관리 ──
  getFeeds: async (): Promise<AdminFeed[]> => {
    const [actRes, meetRes] = await Promise.all([
      api.get<ApiRes<FeedResponseDto[]>>('/api/feeds?type=ACTIVITY&sortBy=LATEST'),
      api.get<ApiRes<FeedResponseDto[]>>('/api/feeds?type=MEETING&sortBy=LATEST'),
    ]);
    const mapFeed = (f: FeedResponseDto, type: 'activity' | 'gathering'): AdminFeed => ({
      id: String(f.id),
      type,
      authorNickname: generateNickname(f.userEmail),
      authorDistrict: '동네',
      title: f.title,
      content: f.content || '',
      imageUrl: f.imageUrls?.[0],
      imageUrls: f.imageUrls || [],
      likes: f.likeCount || 0,
      comments: f.commentCount || 0,
      status: 'normal',
      reported: false,
      createdAt: formatDate(f.createdAt),
    });
    return [
      ...actRes.data.data.map(f => mapFeed(f, 'activity')),
      ...meetRes.data.data.map(f => mapFeed(f, 'gathering')),
    ];
  },

  deleteFeed: async (feedId: string): Promise<void> => {
    await api.delete(`/api/feeds/${feedId}`);
  },

  // ── 대시보드 종합 통계 (개별 API 조합) ──
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    try {
      const [usersRes, pendingRes, feedsActRes] = await Promise.all([
        api.get<ApiRes<AdminUserResponseDto[]>>('/api/admin/users'),
        api.get<ApiRes<VerificationDto[]>>('/api/admin/verifications?status=PENDING'),
        api.get<ApiRes<FeedResponseDto[]>>('/api/feeds?type=ACTIVITY&sortBy=LATEST'),
      ]);
      const totalUsers = usersRes.data.data.length;
      const pendingReviews = pendingRes.data.data.length;
      const todayFeeds = feedsActRes.data.data.filter(f => {
        const d = new Date(f.createdAt);
        const today = new Date();
        return d.toDateString() === today.toDateString();
      }).length;
      return {
        totalUsers,
        activeUsersThisMonth: usersRes.data.data.filter(u => u.status === 'ACTIVE').length,
        todayVerifications: pendingReviews,
        aiFailureRate: 0,
        pendingReviews,
        todayFeeds,
      };
    } catch {
      return { totalUsers: 0, activeUsersThisMonth: 0, todayVerifications: 0, aiFailureRate: 0, pendingReviews: 0, todayFeeds: 0 };
    }
  },

  // ── 랭킹 (대시보드용) ──
  getDistrictRankings: async (): Promise<DistrictRanking[]> => {
    const res = await api.get<RegionRankingDto[]>('/api/rankings/region?n=5');
    return res.data.map((r, idx) => ({
      rank: idx + 1,
      district: r.regionName,
      averageTemperature: r.totalScore,
      change: 0,
    }));
  },

  getPersonalRankings: async (): Promise<PersonalRanking[]> => {
    const res = await api.get<UserRankingDto[]>('/api/rankings/user?n=5');
    return res.data.map((r, idx) => ({
      rank: idx + 1,
      nickname: r.nickname || `유저#${r.userId}`,
      district: r.regionName || '-',
      temperature: r.totalScore,
      change: 0,
    }));
  },

  // ── 정책 변경 이력 (BE 없음, Mock 유지) ──
  getPolicyHistory: async () => adminPolicyHistory,
};
