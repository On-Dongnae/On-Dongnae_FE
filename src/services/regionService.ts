import api from '@/lib/api';

export interface RegionDto {
  id: number;
  city: string;
  district: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const regionService = {
  getAllRegions: async (): Promise<RegionDto[]> => {
    // 제시해주신 JSON 응답 포맷 (status, message, data 구조)
    const res = await api.get<ApiResponse<RegionDto[]>>('/api/regions');
    return res.data.data;
  }
};
