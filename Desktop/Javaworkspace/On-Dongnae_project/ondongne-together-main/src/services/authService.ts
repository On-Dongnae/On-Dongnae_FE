import { currentUser, mockUsers } from '@/mocks/users';
import { User } from '@/types';

// TODO: 추후 백엔드 API 연결 예정
export const authService = {
  login: async (email: string, _password: string): Promise<User | null> => {
    await new Promise(r => setTimeout(r, 800));
    const user = mockUsers.find(u => u.email === email);
    return user || (email ? currentUser : null); // mock: 아무 이메일이나 로그인 성공
  },

  signup: async (_data: { email: string; password: string; nickname: string; district: string }): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800));
    return true;
  },

  checkEmailDuplicate: async (email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    return email === 'test@ondongne.com';
  },

  checkNicknameDuplicate: async (nickname: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    return nickname === '따뜻한사람';
  },

  getCurrentUser: (): User => currentUser,

  logout: async (): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
  },
};
