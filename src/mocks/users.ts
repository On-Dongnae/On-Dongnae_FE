import { User } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  email: 'test@ondongne.com',
  nickname: '따뜻한사람',
  district: '마포구',
  temperature: 24.5,
  totalTemperature: 187.0,
  rank: 12,
  districtRank: 3,
  createdAt: '2024-11-01',
};

export const mockUsers: User[] = [
  currentUser,
  { id: 'user-2', email: 'user2@test.com', nickname: '햇살이', district: '강남구', temperature: 31.0, totalTemperature: 245.0, rank: 3, districtRank: 1, createdAt: '2024-10-15' },
  { id: 'user-3', email: 'user3@test.com', nickname: '동네지기', district: '마포구', temperature: 28.0, totalTemperature: 210.0, rank: 5, districtRank: 1, createdAt: '2024-09-20' },
  { id: 'user-4', email: 'user4@test.com', nickname: '걷기왕', district: '성동구', temperature: 35.0, totalTemperature: 290.0, rank: 1, districtRank: 1, createdAt: '2024-08-10' },
  { id: 'user-5', email: 'user5@test.com', nickname: '봉사러버', district: '종로구', temperature: 33.0, totalTemperature: 270.0, rank: 2, districtRank: 1, createdAt: '2024-07-05' },
  { id: 'user-6', email: 'user6@test.com', nickname: '에코맨', district: '서대문구', temperature: 29.0, totalTemperature: 220.0, rank: 4, districtRank: 1, createdAt: '2024-10-01' },
  { id: 'user-7', email: 'user7@test.com', nickname: '초록바람', district: '마포구', temperature: 22.0, totalTemperature: 165.0, rank: 15, districtRank: 4, createdAt: '2024-11-20' },
  { id: 'user-8', email: 'user8@test.com', nickname: '나눔이', district: '강남구', temperature: 26.0, totalTemperature: 195.0, rank: 8, districtRank: 2, createdAt: '2024-09-15' },
  { id: 'user-9', email: 'user9@test.com', nickname: '플로거', district: '송파구', temperature: 27.0, totalTemperature: 205.0, rank: 6, districtRank: 1, createdAt: '2024-08-25' },
  { id: 'user-10', email: 'user10@test.com', nickname: '따뜻해', district: '강서구', temperature: 25.0, totalTemperature: 180.0, rank: 10, districtRank: 2, createdAt: '2024-10-10' },
];
