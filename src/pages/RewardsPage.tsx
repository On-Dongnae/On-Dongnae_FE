import { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { profileService } from '@/services/profileService';
import { Reward } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusLabel = { available: '수령 가능', claimed: '수령 완료', expired: '기간 만료' };
const statusStyle = { available: 'text-primary', claimed: 'text-success', expired: 'text-muted-foreground' };

const RewardsPage = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getRewards().then(d => { setRewards(d); setLoading(false); });
  }, []);

  const handleClaim = async (id: string) => {
    await profileService.claimReward(id);
    setRewards(prev => prev.map(r => r.id === id ? { ...r, status: 'claimed' as const } : r));
    toast.success('보상을 수령했습니다! 🎉');
  };

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="보상함" showBack />
      {loading ? <LoadingSpinner /> : (
        <div className="px-4 py-3 space-y-3 animate-fade-in">
          {rewards.map(r => (
            <div key={r.id} className="bg-card rounded-xl p-4 shadow-card">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold">{r.name}</h3>
                <span className={cn('text-xs font-medium', statusStyle[r.status])}>{statusLabel[r.status]}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{r.description}</p>
              {r.status === 'available' && (
                <button onClick={() => handleClaim(r.id)} className="w-full h-9 rounded-lg bg-primary text-primary-foreground text-xs font-medium">수령하기</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsPage;
