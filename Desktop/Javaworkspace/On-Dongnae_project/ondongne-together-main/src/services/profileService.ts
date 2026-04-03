import { currentUser } from '@/mocks/users';
import { badges, rewards, activityRecords } from '@/mocks/profile';
import { User, Badge, Reward, ActivityRecord } from '@/types';

// TODO: 추후 백엔드 API 연결 예정
export const profileService = {
  getProfile: async (): Promise<User> => {
    await new Promise(r => setTimeout(r, 300));
    return currentUser;
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
    await new Promise(r => setTimeout(r, 400));
    if (type) return activityRecords.filter(r => r.type === type);
    return activityRecords;
  },
};
