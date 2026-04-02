import { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import TabSwitcher from '@/components/common/TabSwitcher';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { profileService } from '@/services/profileService';
import { ActivityRecord } from '@/types';
import { FileText, Heart, MessageCircle } from 'lucide-react';

const typeIcon = { post: FileText, like: Heart, comment: MessageCircle };

const ActivityPage = () => {
  const [tab, setTab] = useState(0);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const types: (undefined | 'post' | 'like' | 'comment')[] = [undefined, 'post', 'like', 'comment'];

  useEffect(() => {
    setLoading(true);
    profileService.getActivityRecords(types[tab]).then(d => { setRecords(d); setLoading(false); });
  }, [tab]);

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="활동 내역" showBack />
      <TabSwitcher tabs={['전체', '내가 쓴 글', '좋아요', '댓글']} activeTab={tab} onChange={setTab} />

      {loading ? <LoadingSpinner /> : records.length === 0 ? <EmptyState message="활동 내역이 없어요" /> : (
        <div className="px-4 py-3 space-y-2 animate-fade-in">
          {records.map(r => {
            const Icon = typeIcon[r.type];
            return (
              <div key={r.id} className="bg-card rounded-xl p-3.5 shadow-card flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-primary" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  {r.preview && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.preview}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{r.createdAt}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
