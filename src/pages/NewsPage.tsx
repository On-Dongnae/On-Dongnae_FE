import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TabSwitcher from '@/components/common/TabSwitcher';
import SortButtons from '@/components/common/SortButtons';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CommentSheet from '@/components/news/CommentSheet';
import { newsService } from '@/services/newsService';
import { FeedPost, GatheringPost, NewsComment } from '@/types';
import { mockComments } from '@/mocks/news';
import { Heart, MessageCircle, MapPin, Calendar, ImageIcon } from 'lucide-react';

const NewsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetPostId, targetTab } = (location.state as { targetPostId?: string; targetTab?: number } || {});
  const [tab, setTab] = useState(targetTab ?? 0);
  const [highlightId, setHighlightId] = useState<string | null>(targetPostId ?? null);
  
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [gatherings, setGatherings] = useState<GatheringPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 댓글 상태
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentPostId, setCommentPostId] = useState('');
  const [commentPostTitle, setCommentPostTitle] = useState('');
  const [comments, setComments] = useState<Record<string, NewsComment[]>>(() => {
    // Deep copy mock comments
    const copy: Record<string, NewsComment[]> = {};
    for (const key in mockComments) {
      copy[key] = [...mockComments[key]];
    }
    return copy;
  });

  // Sync comment counts from comments state
  const getCommentCount = (postId: string) => (comments[postId] || []).length;

  useEffect(() => {
    setLoading(true);
    if (tab === 0) {
      newsService.getFeedPosts(sort).then(d => { setFeeds(d); setLoading(false); });
    } else {
      newsService.getGatheringPosts(sort).then(d => { setGatherings(d); setLoading(false); });
    }
  }, [tab, sort]);

  // Scroll to target post when navigated from activity page
  useEffect(() => {
    if (!loading && targetPostId) {
      setTimeout(() => {
        const el = document.querySelector(`[data-post-id="${targetPostId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // Clear highlight after 2s
        setTimeout(() => setHighlightId(null), 2000);
      }, 100);
    }
  }, [loading, targetPostId]);

  const toggleLike = (id: string) => {
    if (tab === 0) {
      setFeeds(prev => prev.map(f => f.id === id ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 } : f));
    } else {
      setGatherings(prev => prev.map(g => g.id === id ? { ...g, liked: !g.liked, likes: g.liked ? g.likes - 1 : g.likes + 1 } : g));
    }
    newsService.toggleLike(id);
  };

  const openComments = (postId: string, title: string) => {
    setCommentPostId(postId);
    setCommentPostTitle(title);
    setCommentOpen(true);
  };

  const addComment = (content: string) => {
    const newComment: NewsComment = {
      id: `c-${Date.now()}`,
      postId: commentPostId,
      authorNickname: '나',
      content,
      createdAt: '방금 전',
    };
    setComments(prev => ({
      ...prev,
      [commentPostId]: [...(prev[commentPostId] || []), newComment],
    }));
  };

  return (
    <AppLayout>
      <div className="pt-3">
        <h1 className="text-[15px] font-bold px-5 mb-2 text-center">소식</h1>
        <TabSwitcher tabs={['활동 기록', '동네 모임']} activeTab={tab} onChange={i => { setTab(i); setSort('latest'); }} />
        <div className="mt-1.5" />
        <SortButtons current={sort} onChange={setSort} />

        {loading ? <LoadingSpinner /> : (
          <div className="px-4 space-y-3.5 pb-4 animate-fade-in">
            {tab === 0 ? feeds.map(f => (
              <div key={f.id} data-post-id={f.id} className={`bg-card rounded-xl shadow-card overflow-hidden transition-all duration-500 ${highlightId === f.id ? 'ring-2 ring-primary/40' : ''}`}>
                {/* 사진 영역 */}
                {f.imageUrl ? (
                  <img src={f.imageUrl} alt="활동 사진" className="w-full aspect-[3/2] object-cover" loading="lazy" />
                ) : (
                  <div className="w-full aspect-[3/2] bg-muted flex items-center justify-center">
                    <ImageIcon size={32} className="text-muted-foreground/40" strokeWidth={1.2} />
                  </div>
                )}
                <div className="p-3.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/12 flex items-center justify-center text-[11px] font-bold text-primary">{f.authorNickname[0]}</div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium leading-tight">{f.authorNickname}</p>
                      <p className="text-[10px] text-muted-foreground">{f.authorDistrict} · {f.createdAt}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-foreground leading-[1.6] mb-3">{f.content}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(f.id)} className={`flex items-center gap-1 text-[12px] ${f.liked ? 'text-accent' : 'text-muted-foreground'}`}>
                      <Heart size={14} fill={f.liked ? 'currentColor' : 'none'} strokeWidth={1.5} />{f.likes}
                    </button>
                    <button onClick={() => openComments(f.id, f.content.slice(0, 30))} className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MessageCircle size={14} strokeWidth={1.5} />{getCommentCount(f.id)}
                    </button>
                  </div>
                </div>
              </div>
            )) : gatherings.map(g => (
              <div key={g.id} data-post-id={g.id} className={`bg-card rounded-xl shadow-card p-3.5 transition-all duration-500 ${highlightId === g.id ? 'ring-2 ring-primary/40' : ''}`}>
                <h3 className="text-[13px] font-semibold mb-1.5">{g.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/12 flex items-center justify-center text-[9px] font-bold text-primary">{g.authorNickname[0]}</div>
                  <span className="text-[11px] text-muted-foreground">{g.authorNickname} · {g.authorDistrict}</span>
                </div>
                <div className="space-y-1 mb-2">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin size={11} strokeWidth={1.4} />{g.location}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar size={11} strokeWidth={1.4} />{g.schedule}</p>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed mb-2.5">{g.description}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(g.id)} className={`flex items-center gap-1 text-[12px] ${g.liked ? 'text-accent' : 'text-muted-foreground'}`}>
                    <Heart size={14} fill={g.liked ? 'currentColor' : 'none'} strokeWidth={1.5} />{g.likes}
                  </button>
                  <button onClick={() => openComments(g.id, g.title)} className="flex items-center gap-1 text-[12px] text-muted-foreground">
                    <MessageCircle size={14} strokeWidth={1.5} />{getCommentCount(g.id)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <FloatingActionButton onClick={() => navigate(`/news/write?type=${tab === 0 ? 'feed' : 'gathering'}`)} />

        <CommentSheet
          open={commentOpen}
          onOpenChange={setCommentOpen}
          postTitle={commentPostTitle}
          comments={comments[commentPostId] || []}
          onAddComment={addComment}
        />
      </div>
    </AppLayout>
  );
};

export default NewsPage;
