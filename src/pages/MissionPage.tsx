import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TabSwitcher from '@/components/common/TabSwitcher';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { missionService } from '@/services/missionService';
import { Mission, HiddenMission } from '@/types';
import { Sparkles, ChevronRight } from 'lucide-react';
import { formatTempDelta } from '@/lib/temperature';

const MissionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') === 'hidden' ? 1 : 0);
  const [daily, setDaily] = useState<Mission[]>([]);
  const [hidden, setHidden] = useState<HiddenMission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      missionService.getDailyMissions(),
      missionService.getHiddenMissions(),
    ]).then(([d, h]) => {
      setDaily(d);
      setHidden(h);
      setLoading(false);
    });
  }, []);

  return (
    <AppLayout>
      <div className="pt-3">
        <h1 className="text-[15px] font-bold px-5 mb-2 text-center">미션</h1>
        <TabSwitcher tabs={['일일 미션', '히든 미션']} activeTab={tab} onChange={setTab} />

        {loading ? <LoadingSpinner /> : (
          <div className="px-4 pt-4 pb-2.5 space-y-4 animate-fade-in">
            {tab === 0 ? daily.map(m => (
              <div key={m.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-[14px] font-semibold">{m.title}</h3>
                  <span className="text-[15px] font-bold text-primary whitespace-nowrap ml-2">{formatTempDelta(m.points)}</span>
                </div>
                <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">{m.description}</p>
                <button
                  onClick={() => navigate(`/mission/verify?id=${m.id}&title=${encodeURIComponent(m.title)}`)}
                  disabled={m.completed}
                  className={`w-full h-11 rounded-lg text-[14px] font-medium transition-colors flex items-center justify-center gap-1 ${
                    m.completed ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground active:bg-primary/85'
                  }`}
                >
                  {m.completed ? '완료됨' : <>인증하러 가기 <ChevronRight size={14} strokeWidth={1.8} /></>}
                </button>
              </div>
            )) : hidden.map(m => (
              <div key={m.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-primary" strokeWidth={1.8} />
                    <span className="text-[10px] font-medium text-primary">AI 추천 미션</span>
                  </div>
                  <span className="text-[15px] font-bold text-primary whitespace-nowrap">{formatTempDelta(m.points)}</span>
                </div>
                <h3 className="text-[14px] font-semibold mb-1">{m.title}</h3>
                <p className="text-[12px] text-muted-foreground mb-3 leading-relaxed">{m.reason}</p>
                <div className="bg-background rounded-lg px-3 py-2 mb-3 text-[11px] text-muted-foreground">
                  <p>인증 · {m.verificationMethod}</p>
                </div>
                <button
                  onClick={() => navigate(`/mission/verify?id=${m.id}&title=${encodeURIComponent(m.title)}`)}
                  className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-[14px] font-medium active:bg-primary/85 transition-colors flex items-center justify-center gap-1"
                >
                  인증하러 가기 <ChevronRight size={14} strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MissionPage;
