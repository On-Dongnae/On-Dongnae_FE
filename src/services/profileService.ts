import { badges, rewards } from '@/mocks/profile';
import { User, Badge, Reward, ActivityRecord } from '@/types';
import api from '@/lib/api';

export const profileService = {
  getProfile: async (): Promise<User> => {
    try {
      const res = await api.get('/api/users/me');
      const data = res.data.data;
      return {
        id: String(data.id),
        email: data.email,
        nickname: data.nickname,
        avatarUrl: data.profileImageUrl || '',
        district: data.regionName,
        temperature: data.totalScore, // temperature와 totalTemperature를 BE의 totalScore로 통일
        totalTemperature: data.totalScore,
        rank: 0, // BE에서 profile에 제공하지 않으므로 기본값
        districtRank: 0,
        createdAt: new Date().toISOString()
      };
    } catch {
      return {
        id: '1', email: '', nickname: '유저', avatarUrl: '', district: '서울시', temperature: 0, totalTemperature: 0, rank: 0, districtRank: 0, createdAt: new Date().toISOString()
      };
    }
  },

  getBadges: async (): Promise<Badge[]> => {
    await new Promise(r => setTimeout(r, 400));
    return badges;
  },

  getRewards: async (): Promise<Reward[]> => {
    await new Promise(r => setTimeout(r, 400));
    return rewards;
  },

  claimReward: async (_rewardId: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    return true;
  },

  getActivityRecords: async (type?: 'post' | 'like' | 'comment'): Promise<ActivityRecord[]> => {
    try {
      // type 필터링이 필요하다면 FE에서 필터링하거나 현재는 점수 내역 전체 표출
      const res = await api.get('/api/rankings/my-score');
      const history = res.data; // List<ScoreHistoryDto>
      return history.map((h: any) => {
        // ScoreType에 따라 프론트엔드 활동 타입 매핑
        const activityType = h.type === 'MISSION_COMPLETION' || h.type === 'MISSION_VERIFIED' ? 'post' : 'like';
        
        return {
          id: String(h.id),
          type: activityType,
          title: h.missionName || '기타 참여',
          preview: `온도 ${h.amount > 0 ? '+' + h.amount : h.amount}℃ 증가`, // 획득 온도를 미리보기 대신 표기
          createdAt: new Date(h.createdAt).toISOString()
        };
      });
    } catch {
      return [];
    }
  },
};
