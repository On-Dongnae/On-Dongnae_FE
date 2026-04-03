import { dailyMissions, hiddenMissions } from '@/mocks/missions';
import { Mission, HiddenMission, VerificationResult } from '@/types';

import api from '@/lib/api';

const mapToMission = (u: any): Mission => ({
  id: String(u.id), 
  title: u.mission.name,
  description: u.mission.description,
  points: u.mission.pointAmount,
  difficulty: '보통', // BE에 없음
  estimatedTime: '10분', // BE에 없음
  category: '환경', // BE에 없음
  completed: u.isAchieved,
});

export const missionService = {
  getDailyMissions: async (): Promise<Mission[]> => {
    try {
      const res = await api.get('/api/missions/today');
      return res.data.data
        .filter((u: any) => u.mission.type === 'INITIAL')
        .map(mapToMission);
    } catch {
      return dailyMissions;
    }
  },

  getHiddenMissions: async (): Promise<HiddenMission[]> => {
    try {
      const res = await api.get('/api/missions/today');
      return res.data.data
        .filter((u: any) => u.mission.type === 'AI_HIDDEN')
        .map((u: any) => ({
          ...mapToMission(u),
          reason: '지난 활동 내역을 기반으로 AI가 찾아냈어요',
          verificationMethod: '사진 인증',
          activityType: 'AI_HIDDEN'
        }));
    } catch {
      return hiddenMissions;
    }
  },

  submitVerification: async (userMissionId: string, images: File[], description: string): Promise<VerificationResult> => {
    const formData = new FormData();
    formData.append('userMissionId', userMissionId);
    if (description) formData.append('content', description);
    if (images && images.length > 0) {
      images.forEach(img => formData.append('images', img));
    }

    const res = await api.post('/api/verifications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // BE 응답 status가 PENDING 계열인 경우 'review'로 매핑
    const beStatus = res.data?.data?.status; 
    let status: 'approved' | 'review' | 'rejected' = 'review';
    if (beStatus === 'VERIFIED') status = 'approved';
    if (beStatus === 'REJECTED') status = 'rejected';

    return {
      status,
      message: status === 'approved' ? '인증이 완료되었습니다!' : '인증 대기 중입니다. 잠시만 기다려주세요.'
    };
  },

  pollVerificationStatus: async (userMissionId: string): Promise<VerificationResult> => {
    try {
      const res = await api.get('/api/missions/today');
      const mission = res.data.data.find((m: any) => String(m.id) === userMissionId);
      if (!mission) {
         return { status: 'review', message: '미션을 찾는 중...' };
      }
      
      if (mission.status === 'VERIFIED') return { status: 'approved', message: '인증이 승인되었습니다! 온도가 올랐어요 🎉' };
      if (mission.status === 'REJECTED') return { status: 'rejected', message: '인증이 반려되었습니다. 다시 시도해주세요.' };
      
      return { status: 'review', message: '검토 중입니다. 잠시만 기다려주세요.' };
    } catch {
      return { status: 'review', message: '검토 중...' };
    }
  }
};
