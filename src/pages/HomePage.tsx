import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Target, Sparkles, FileCheck, Newspaper } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { authService } from '@/services/authService';
import { weatherService } from '@/services/weatherService';
import { missionService } from '@/services/missionService';
import { WeatherInfo, Mission, User } from '@/types';
import { districtRankings } from '@/mocks/rankings';
import { formatTemp, formatTempDelta } from '@/lib/temperature';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    const u = authService.getCurrentUser();
    setUser(u);
    weatherService.getWeather(u.district).then(setWeather);
    missionService.getDailyMissions().then(m => setMissions(m.slice(0, 2)));
  }, []);

  if (!user) return null;

  const districtData = districtRankings.find(d => d.district === user.district);

  const shortcuts = [
    { label: '오늘의 미션', icon: Target, path: '/mission' },
    { label: '히든 미션', icon: Sparkles, path: '/mission?tab=hidden' },
    { label: '활동 인증', icon: FileCheck, path: '/mission/verify' },
    { label: '소식 보기', icon: Newspaper, path: '/news' },
  ];

  return (
    <AppLayout>
      <div className="px-5 pt-3 pb-2 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
            <MapPin size={13} strokeWidth={1.6} />
            <span className="font-medium text-foreground">{user.district}</span>
          </div>
          <span className="text-[15px] font-bold text-foreground tracking-tight">온동네</span>
        </div>

        {/* Weather + Temperature combined */}
        {weather && (
          <div className="bg-card rounded-2xl p-4 shadow-card mb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl leading-none">{weather.icon}</span>
                <div>
                  <p className="text-[20px] font-bold text-foreground leading-tight">{weather.temperature}°C</p>
                  <p className="text-[11px] text-muted-foreground">{weather.district} · {weather.condition}</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-border/60 mb-3" />
            <div className="flex items-end gap-1.5 mb-2.5">
              <span className="text-[28px] font-bold text-primary leading-none">{user.temperature}</span>
              <span className="text-[13px] text-muted-foreground mb-0.5">°C</span>
              <span className="text-[11px] text-muted-foreground mb-0.5 ml-1">내 온도</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background rounded-lg py-2 text-center">
                <p className="text-[10px] text-muted-foreground">개인</p>
                <p className="text-[13px] font-bold mt-0.5">{user.rank}위</p>
              </div>
              <div className="bg-background rounded-lg py-2 text-center">
                <p className="text-[10px] text-muted-foreground">동네</p>
                <p className="text-[13px] font-bold mt-0.5">{districtData?.rank || '-'}위</p>
              </div>
              <div className="bg-background rounded-lg py-2 text-center">
                <p className="text-[10px] text-muted-foreground">동네 평균</p>
                <p className="text-[13px] font-bold mt-0.5">{formatTemp(districtData?.averageTemperature || '-')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Shortcuts */}
        <div className="grid grid-cols-4 gap-1.5 mb-4">
          {shortcuts.map(s => (
            <button
              key={s.label}
              onClick={() => navigate(s.path)}
              className="bg-card rounded-xl py-3 px-1 shadow-card flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform"
            >
              <s.icon size={18} className="text-primary" strokeWidth={1.5} />
              <span className="text-[10px] font-medium text-foreground leading-tight">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Recommended Missions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[13px] font-semibold">오늘의 추천 미션</h2>
            <button onClick={() => navigate('/mission')} className="text-[11px] text-muted-foreground flex items-center gap-0.5">
              더보기 <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {missions.map(m => (
              <button
                key={m.id}
                onClick={() => navigate('/mission')}
                className="w-full bg-card rounded-xl p-3 shadow-card flex items-center justify-between text-left active:scale-[0.99] transition-transform"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">{m.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{m.description.slice(0, 30)}...</p>
                </div>
                <span className="text-[12px] font-bold text-primary whitespace-nowrap ml-3">{formatTempDelta(m.points)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
