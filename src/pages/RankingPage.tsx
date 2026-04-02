import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TabSwitcher from '@/components/common/TabSwitcher';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { rankingService } from '@/services/rankingService';
import { authService } from '@/services/authService';
import { DistrictRanking, PersonalRanking } from '@/types';
import { formatTemp } from '@/lib/temperature';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

const RankingPage = () => {
  const [tab, setTab] = useState(0);
  const [districts, setDistricts] = useState<DistrictRanking[]>([]);
  const [personal, setPersonal] = useState<PersonalRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    setLoading(true);
    Promise.all([rankingService.getDistrictRankings(), rankingService.getPersonalRankings()])
      .then(([d, p]) => { setDistricts(d); setPersonal(p); setLoading(false); });
  }, []);

  const myDistrict = districts.find(d => d.district === user.district);
  const myPersonal = personal.find(p => p.nickname === user.nickname);

  const medalEmoji = (r: number) => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : null;

  return (
    <AppLayout>
      <div className="pt-3">
        <h1 className="text-[15px] font-bold px-5 mb-2">순위</h1>
        <TabSwitcher tabs={['동네 순위', '개인 순위']} activeTab={tab} onChange={setTab} />

        {loading ? <LoadingSpinner /> : (
          <div className="px-4 py-2.5 animate-fade-in">
            {/* My highlight */}
            {tab === 0 && myDistrict && (
              <div className="bg-primary/8 rounded-xl px-4 py-3.5 mb-3">
                <p className="text-[10px] text-muted-foreground mb-1">내 동네</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[18px] font-bold text-primary">{myDistrict.rank}위</span>
                    <span className="text-[13px] font-medium text-foreground">{myDistrict.district}</span>
                  </div>
                  <span className="text-[13px] font-semibold text-primary">{formatTemp(myDistrict.averageTemperature)}</span>
                </div>
              </div>
            )}
            {tab === 1 && myPersonal && (
              <div className="bg-primary/8 rounded-xl px-4 py-3.5 mb-3">
                <p className="text-[10px] text-muted-foreground mb-1">내 순위</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.nickname} /> : null}
                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">{user.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[18px] font-bold text-primary">{myPersonal.rank}위</span>
                      <span className="text-[13px] font-medium text-foreground">{myPersonal.nickname}</span>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-primary">{formatTemp(myPersonal.temperature)}</span>
                </div>
              </div>
            )}

            {/* List */}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              {(tab === 0 ? districts : []).map((d, i) => (
                <div key={d.district} className={cn(
                  'flex items-center justify-between py-3 px-4',
                  i !== 0 && 'border-t border-border/50',
                  d.district === user.district && 'bg-primary/4'
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold w-5 text-center">{medalEmoji(d.rank) || d.rank}</span>
                    <span className="text-[13px] font-medium">{d.district}</span>
                  </div>
                  <span className="text-[13px] text-muted-foreground">{formatTemp(d.averageTemperature)}</span>
                </div>
              ))}
              {(tab === 1 ? personal : []).map((p, i) => (
                <div key={`${p.nickname}-${p.rank}`} className={cn(
                  'flex items-center justify-between py-3 px-4',
                  i !== 0 && 'border-t border-border/50',
                  p.nickname === user.nickname && 'bg-primary/4'
                )}>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold w-5 text-center">{medalEmoji(p.rank) || p.rank}</span>
                    <Avatar className="h-7 w-7">
                      {p.avatarUrl ? <AvatarImage src={p.avatarUrl} alt={p.nickname} /> : null}
                      <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-semibold">
                        <User size={14} strokeWidth={1.5} />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-[13px] font-medium">{p.nickname}</span>
                      <span className="text-[11px] text-muted-foreground ml-1.5">{p.district}</span>
                    </div>
                  </div>
                  <span className="text-[13px] text-muted-foreground">{formatTemp(p.temperature)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default RankingPage;
