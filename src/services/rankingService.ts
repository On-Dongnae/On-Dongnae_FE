import { districtRankings, personalRankings } from '@/mocks/rankings';
import { DistrictRanking, PersonalRanking } from '@/types';

import api from '@/lib/api';

export const rankingService = {
  getDistrictRankings: async (): Promise<DistrictRanking[]> => {
    try {
      const res = await api.get('/api/rankings/region?n=25'); // 서울시 25개 구
      return res.data.map((r: any, index: number) => ({
        rank: index + 1,
        district: r.regionName,
        averageTemperature: r.totalScore
      }));
    } catch {
      return districtRankings; // fallback
    }
  },

  getPersonalRankings: async (): Promise<PersonalRanking[]> => {
    try {
      const res = await api.get('/api/rankings/user?n=50');
      return res.data.map((u: any, index: number) => ({
        rank: index + 1,
        nickname: u.nickname,
        district: '동네이웃', // BE DTO에 regionName 부재
        temperature: u.totalScore,
      }));
    } catch {
      return personalRankings; // fallback
    }
  },
};
