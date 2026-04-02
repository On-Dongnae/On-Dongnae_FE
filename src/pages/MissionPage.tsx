import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TabSwitcher from '@/components/common/TabSwitcher';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { missionService } from '@/services/missionService';
import { Mission, HiddenMission } from '@/types';
import { Sparkles, Flame, ChevronRight } from 'lucide-react';
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
        <h1 className="text-[15px] font-bold px-5 mb-2">미션</h1>
        <TabSwitcher tabs={['일일 미션', '히든 미션']} activeTab={tab} onChange={setTab} />

        {loading ? <LoadingSpinner /> : (
          <div className="px-4 py-2.5 space-y-2.5 animate-fade-in">
            {tab === 0 ? daily.map(m => (
              <div key={m.id} className="bg-card rounded-xl p-3.5 shadow-card">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-[13px] font-semibold">{m.title}</h3>
                  <span className="text-[13px] font-bold text-primary whitespace-nowrap ml-2">{formatTempDelta(m.points)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">{m.description}</p>
                <button
                  onClick={() => navigate(`/mission/verify?id=${m.id}&title=${encodeURIComponent(m.title)}`)}
                  disabled={m.completed}
                  className={`w-full h-8 rounded-lg text-[12px] font-medium transition-colors flex items-center justify-center gap-1 ${
                    m.completed ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground active:bg-primary/85'
                  }`}
                >
                  {m.completed ? '완료됨' : <>인증하러 가기 <ChevronRight size={13} strokeWidth={1.8} /></>}
                </button>
              </div>
            )) : hidden.map(m => (
              <div key={m.id} className="bg-card rounded-xl p-3.5 shadow-card">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={12} className="text-primary" strokeWidth={1.8} />
                  <span className="text-[10px] font-medium text-primary">AI 추천 미션</span>
                </div>
                <h3 className="text-[13px] font-semibold mb-1">{m.title}</h3>
                <p className="text-[11px] text-muted-foreground mb-2 leading-relaxed">{m.reason}</p>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Flame size={10} strokeWidth={1.4} />{formatTempDelta(m.points)}</span>
                </div>
                <div className="bg-background rounded-lg px-3 py-2 mb-2.5 text-[11px] text-muted-foreground space-y-0.5">
                  <p>인증 · {m.verificationMethod}</p>
                  <p>유형 · {m.activityType}</p>
                </div>
                <button
                  onClick={() => navigate(`/mission/verify?id=${m.id}&title=${encodeURIComponent(m.title)}`)}
                  className="w-full h-8 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium active:bg-primary/85 transition-colors flex items-center justify-center gap-1"
                >
                  수행하기 <ChevronRight size={13} strokeWidth={1.8} />
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
