import { dailyMissions, hiddenMissions } from '@/mocks/missions';
import { Mission, HiddenMission, VerificationResult } from '@/types';

// TODO: 추후 백엔드 API 연결 예정
export const missionService = {
  getDailyMissions: async (): Promise<Mission[]> => {
    await new Promise(r => setTimeout(r, 400));
    return dailyMissions;
  },

  // TODO: 추후 FastAPI/LLM 기반 AI 추천으로 교체 예정
  getHiddenMissions: async (): Promise<HiddenMission[]> => {
    await new Promise(r => setTimeout(r, 600));
    return hiddenMissions;
  },

  // TODO: 추후 S3 업로드 + AI 검증 API 연결 예정
  submitVerification: async (_missionId: string, _image: File | null, _description: string): Promise<VerificationResult> => {
    await new Promise(r => setTimeout(r, 1500));
    const outcomes: VerificationResult[] = [
      { status: 'approved', message: '인증이 승인되었습니다! 온도가 올랐어요 🎉' },
      { status: 'review', message: '검토 중입니다. 잠시만 기다려주세요.' },
    ];
    return outcomes[Math.floor(Math.random() * outcomes.length)];
  },
};
