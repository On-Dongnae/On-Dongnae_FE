import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Map } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import logoImg from '@/assets/logo.png';
import { useAuthStore } from '@/store/useAuthStore';
import { weatherService } from '@/services/weatherService';
import { rankingService } from '@/services/rankingService';
import { WeatherInfo, User } from '@/types';

const HomePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [districtTemp, setDistrictTemp] = useState<number>(0);

  useEffect(() => {
    if (user) {
      weatherService.getWeather(user.district).then(setWeather);
      
      rankingService.getDistrictRankings().then(rankings => {
        const myDistrict = rankings.find(r => r.district === user.district);
        if (myDistrict) {
          setDistrictTemp(myDistrict.averageTemperature);
        }
      });
    }
  }, [user]);

  if (!user) return null;

  return (
    <AppLayout>
      <div className="px-5 pt-5 pb-4 animate-fade-in">
        {/* Greeting */}
        <div className="mb-5">
          <h1 className="text-[22px] font-bold leading-snug">
            <span className="text-primary">{user.nickname}</span>님,
          </h1>
          <p className="text-[20px] font-bold leading-snug text-foreground">
            따뜻한 온도를 나눠주세요.
          </p>
        </div>

        {/* Weather card */}
        {weather && (
          <div className="bg-card rounded-2xl p-4 shadow-card mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-[15px] font-bold text-foreground">{weather.district}</p>
                <p className="text-[11px] text-muted-foreground">대한민국 서울특별시</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[20px] font-bold text-foreground">{weather.temperature}°C</p>
              <p className="text-[11px] text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
        )}

        {/* Big temperature card */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-3 flex flex-col items-center">
          <img src={logoImg} alt="온동네 로고" className="w-24 h-24 mb-3" />
          <p className="text-[16px] text-muted-foreground mb-1">{user.district} 실시간 온도</p>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-[48px] font-bold text-primary leading-none">{districtTemp}</span>
            <span className="text-[28px] font-bold text-primary mb-1">°C</span>
          </div>
          <p className="text-[14px] text-muted-foreground">따뜻한 마음이 모여 만드는 온도</p>
        </div>

        {/* 2 action cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/news/write?type=feed')}
            className="bg-card rounded-2xl p-5 shadow-card flex flex-col items-center gap-2.5 active:scale-[0.97] transition-transform"
          >
            <FileText size={28} className="text-primary" strokeWidth={1.4} />
            <span className="text-[15px] font-semibold text-foreground">활동 기록</span>
            <span className="text-[13px] text-muted-foreground leading-tight text-center">오늘의 활동을<br/>기록해보세요</span>
          </button>
          <button
            onClick={() => navigate('/news/write?type=gathering')}
            className="bg-card rounded-2xl p-5 shadow-card flex flex-col items-center gap-2.5 active:scale-[0.97] transition-transform"
          >
            <Users size={28} className="text-primary" strokeWidth={1.4} />
            <span className="text-[15px] font-semibold text-foreground">동네 모임</span>
            <span className="text-[13px] text-muted-foreground leading-tight text-center">이웃과 함께<br/>모임을 만들어요</span>
          </button>
        </div>

        {/* 동네 온도 지도 버튼 */}
        <button
          onClick={() => navigate('/ranking/map')}
          className="w-full mt-3 bg-card rounded-2xl p-4 shadow-card flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Map size={20} className="text-primary" strokeWidth={1.6} />
          <span className="text-[14px] font-semibold text-foreground">동네 온도 지도</span>
        </button>
      </div>
    </AppLayout>
  );
};

export default HomePage;
