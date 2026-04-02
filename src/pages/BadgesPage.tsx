import { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/authService';
import { Badge } from '@/types';
import { formatTemp } from '@/lib/temperature';
import { cn } from '@/lib/utils';

const BadgesPage = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    profileService.getBadges().then(d => { setBadges(d); setLoading(false); });
  }, []);

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="업적 / 배지" showBack />
      {loading ? <LoadingSpinner /> : (
        <div className="px-4 py-3 animate-fade-in">
          {/* Summary */}
          <div className="bg-primary/10 rounded-xl p-4 mb-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">누적 온도</p>
            <p className="text-2xl font-bold text-primary">{formatTemp(user.totalTemperature)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              획득 {badges.filter(b => b.earned).length} / 전체 {badges.length}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map(b => (
              <div key={b.id} className={cn('bg-card rounded-xl p-4 shadow-card text-center', !b.earned && 'opacity-50')}>
                <span className="text-3xl block mb-2">{b.icon}</span>
                <h3 className="text-sm font-semibold">{b.name}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">{b.description}</p>
                <p className="text-[10px] text-primary font-medium mt-2">
                  {b.earned ? '✓ 획득 완료' : `${formatTemp(b.requirement)} 필요`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
