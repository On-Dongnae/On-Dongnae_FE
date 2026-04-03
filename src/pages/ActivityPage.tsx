import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import TabSwitcher from '@/components/common/TabSwitcher';
import EmptyState from '@/components/common/EmptyState';
import { Target, FileText, MessageCircle, ChevronRight } from 'lucide-react';
import { formatTempDelta } from '@/lib/temperature';
import { feedPosts, gatheringPosts, mockComments } from '@/mocks/news';

// Mock mission history
const missionRecords = [
  { id: 'mr1', title: '쓰레기 줍기 인증 완료', points: 1, completedAt: '오늘 오전 10:30' },
  { id: 'mr2', title: '텀블러 사용 인증 완료', points: 1, completedAt: '어제 오후 3:15' },
  { id: 'mr3', title: '플로깅 히든 미션 인증 완료', points: 3, completedAt: '3일 전' },
  { id: 'mr4', title: '헌혈 인증 완료', points: 5, completedAt: '5일 전' },
];

// My posts (filter from feedPosts by current user nickname)
const myPosts = feedPosts.filter(f => f.authorNickname === '동네지기' || f.authorNickname === '햇살이').slice(0, 3);

// My comments (filter from mockComments)
const myComments = Object.entries(mockComments).flatMap(([postId, comments]) =>
  comments
    .filter(c => c.authorNickname === '동네지기' || c.authorNickname === '따듯한사람')
    .map(c => {
      const post = feedPosts.find(f => f.id === postId);
      return { ...c, postTitle: post?.content?.slice(0, 25) || '게시글', postId };
    })
).slice(0, 4);

const ActivityPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="활동 내역" showBack />
      <TabSwitcher tabs={['미션', '내가 쓴 글', '댓글']} activeTab={tab} onChange={setTab} />

      <div className="px-4 py-3 space-y-2 animate-fade-in">
        {/* 미션 탭 */}
        {tab === 0 && (
          missionRecords.length === 0 ? <EmptyState message="인증한 미션이 없어요" /> : (
            missionRecords.map(r => (
              <div key={r.id} className="bg-card rounded-xl p-3.5 shadow-card flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target size={14} className="text-primary" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{r.completedAt}</p>
                </div>
                <span className="text-[12px] font-bold text-primary whitespace-nowrap">{formatTempDelta(r.points)}</span>
              </div>
            ))
          )
        )}

        {/* 내가 쓴 글 탭 */}
        {tab === 1 && (
          myPosts.length === 0 ? <EmptyState message="작성한 글이 없어요" /> : (
            myPosts.map(p => (
              <button
                key={p.id}
                onClick={() => navigate('/news', { state: { targetPostId: p.id, targetTab: 0 } })}
                className="w-full bg-card rounded-xl p-3.5 shadow-card flex items-center gap-3 text-left active:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-primary" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.content.slice(0, 30)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{p.createdAt}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/50 flex-shrink-0" strokeWidth={1.5} />
              </button>
            ))
          )
        )}

        {/* 댓글 탭 */}
        {tab === 2 && (
          myComments.length === 0 ? <EmptyState message="작성한 댓글이 없어요" /> : (
            myComments.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  const isFeed = feedPosts.some(f => f.id === c.postId);
                  const isGathering = gatheringPosts.some(g => g.id === c.postId);
                  navigate('/news', { state: { targetPostId: c.postId, targetTab: isFeed ? 0 : isGathering ? 1 : 0 } });
                }}
                className="w-full bg-card rounded-xl p-3.5 shadow-card flex items-center gap-3 text-left active:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={14} className="text-primary" strokeWidth={1.6} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">→ {c.postTitle}...</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.createdAt}</p>
                </div>
                <ChevronRight size={14} className="text-muted-foreground/50 flex-shrink-0" strokeWidth={1.5} />
              </button>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
