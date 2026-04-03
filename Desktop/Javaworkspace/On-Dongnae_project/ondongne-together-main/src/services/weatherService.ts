import { mockWeather } from '@/mocks/weather';
import { WeatherInfo } from '@/types';

// TODO: 추후 실제 날씨 API 연결 예정 (OpenWeatherMap 등)
export const weatherService = {
  getWeather: async (district: string): Promise<WeatherInfo> => {
    await new Promise(r => setTimeout(r, 300));
    return { ...mockWeather, district };
  },
};
