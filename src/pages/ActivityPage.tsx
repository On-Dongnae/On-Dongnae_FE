import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Target, Info } from 'lucide-react';
import { profileService } from '@/services/profileService';
import { ActivityRecord } from '@/types';

// 시간 포맷팅 헬퍼
function formatTime(isoString: string) {
  const d = new Date(isoString);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

const ActivityPage = () => {
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileService.getActivityRecords().then(data => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="온도(점수) 이력" showBack />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="px-4 py-3 space-y-2 animate-fade-in pb-20">
          {records.length === 0 ? <EmptyState message="활동 내역이 없어요" /> : (
            records.map(r => (
               <div key={r.id} className="bg-card rounded-xl p-3.5 shadow-card flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {r.type === 'post' ? (
                    <Target size={14} className="text-primary" strokeWidth={1.6} />
                  ) : (
                    <Info size={14} className="text-muted-foreground" strokeWidth={1.6} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatTime(r.createdAt)}</p>
                </div>
                <span className="text-[12px] font-bold text-primary whitespace-nowrap">{r.preview}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
