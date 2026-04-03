import api from '@/lib/api';
import { User } from '@/types';

export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // 1. 로그인 요청을 통해 토큰을 문자열(plain text)로 반환받습니다.
    const res = await api.post('/api/users/login', { email, password });
    const token = res.data; 

    // 임시로 헤더에 등록하여 /me 조회가 가능하도록 세팅 (이후 인터셉터에서 영구처리)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 2. 내 정보 조회
    const profileRes = await api.get('/api/users/me');
    const profile = profileRes.data.data;

    // 3. User 객체 매핑
    const user: User = {
      id: String(profile.id),
      email: profile.email,
      nickname: profile.nickname,
      district: profile.regionName || '',
      temperature: profile.totalScore || 0,
      totalTemperature: profile.totalScore || 0,
      rank: 0,
      districtRank: 0,
      avatarUrl: profile.profileImageUrl,
      createdAt: new Date().toISOString()
    };

    return { user, token };
  },

  signup: async (data: { email: string; password: string; nickname: string; regionId: number }): Promise<boolean> => {
    await api.post('/api/users/signup', data);
    return true;
  },

  // 중복 확인은 임시로 통과
  checkEmailDuplicate: async (email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 300));
    return false; // false 면 중복 아님
  },

  checkNicknameDuplicate: async (nickname: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 300));
    return false; // false 면 중복 아님
  },

  logout: async (): Promise<void> => {
    // 백엔드는 stateless JWT 방식이므로 별도 API가 없을 수 있지만, 혹시 있다면 아래를 활성화합니다.
    // await api.post('/api/users/logout');
  },
};
