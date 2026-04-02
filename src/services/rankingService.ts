import { districtRankings, personalRankings } from '@/mocks/rankings';
import { DistrictRanking, PersonalRanking } from '@/types';

// TODO: 추후 백엔드 API 연결 예정
export const rankingService = {
  getDistrictRankings: async (): Promise<DistrictRanking[]> => {
    await new Promise(r => setTimeout(r, 400));
    return districtRankings;
  },

  getPersonalRankings: async (): Promise<PersonalRanking[]> => {
    await new Promise(r => setTimeout(r, 400));
    return personalRankings;
  },
};
