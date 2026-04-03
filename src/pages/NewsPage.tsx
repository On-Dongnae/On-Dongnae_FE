import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TabSwitcher from '@/components/common/TabSwitcher';
import SortButtons from '@/components/common/SortButtons';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import CommentSheet from '@/components/news/CommentSheet';
import { newsService } from '@/services/newsService';
import { commentService } from '@/services/commentService';
import { FeedPost, GatheringPost, NewsComment } from '@/types';
import { Heart, MessageCircle, MapPin, Calendar, ImageIcon, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageCarousel = ({ urls }: { urls: string[] }) => {
  if (!urls || urls.length === 0) {
    return (
      <div className="w-full aspect-[3/2] bg-muted flex items-center justify-center">
        <ImageIcon size={32} className="text-muted-foreground/40" strokeWidth={1.2} />
      </div>
    );
  }
  
  return (
    <Carousel className="w-full relative group">
      <CarouselContent>
        {urls.map((url, idx) => (
          <CarouselItem key={idx}>
            <div className="w-full aspect-[3/2] bg-muted flex items-center justify-center overflow-hidden">
              <img src={url} alt={`활동 사진 ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {urls.length > 1 && (
        <>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/60 shadow hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/60 shadow hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded-full bg-background/60 text-[10px] font-medium backdrop-blur-md">
            + {urls.length}
          </div>
        </>
      )}
    </Carousel>
  );
};

const NewsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetPostId, targetTab, refresh } = (location.state as { targetPostId?: string; targetTab?: number; refresh?: boolean } || {});
  const [tab, setTab] = useState(targetTab ?? 0);
  const [highlightId, setHighlightId] = useState<string | null>(targetPostId ?? null);
  const user = useAuthStore(state => state.user);
  const currentUserId = user?.id || '';
  
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [feeds, setFeeds] = useState<FeedPost[]>([]);
  const [gatherings, setGatherings] = useState<GatheringPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 댓글 상태
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentPostId, setCommentPostId] = useState('');
  const [commentPostTitle, setCommentPostTitle] = useState('');
  const [comments, setComments] = useState<NewsComment[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [tab, sort, refresh]);

  const fetchPosts = () => {
    setLoading(true);
    if (tab === 0) {
      newsService.getFeedPosts(sort).then(d => { setFeeds(d); setLoading(false); });
    } else {
      newsService.getGatheringPosts(sort).then(d => { setGatherings(d); setLoading(false); });
    }
  };

  useEffect(() => {
    if (!loading && targetPostId) {
      setTimeout(() => {
        const el = document.querySelector(`[data-post-id="${targetPostId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => setHighlightId(null), 2000);
      }, 100);
    }
  }, [loading, targetPostId]);

  const toggleLike = async (id: string, isLiked: boolean) => {
    // 로컬 상태 즉시 변경
    if (tab === 0) {
      setFeeds(prev => prev.map(f => f.id === id ? { ...f, liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 } : f));
    } else {
      setGatherings(prev => prev.map(g => g.id === id ? { ...g, liked: !g.liked, likes: g.liked ? g.likes - 1 : g.likes + 1 } : g));
    }

    try {
      await newsService.toggleLike(id, isLiked);
    } catch {
      // 롤백
      if (tab === 0) {
        setFeeds(prev => prev.map(f => f.id === id ? { ...f, liked: isLiked, likes: isLiked ? f.likes + 1 : f.likes - 1 } : f));
      } else {
        setGatherings(prev => prev.map(g => g.id === id ? { ...g, liked: isLiked, likes: isLiked ? g.likes + 1 : g.likes - 1 } : g));
      }
    }
  };

  const openComments = async (postId: string, title: string) => {
    setCommentPostId(postId);
    setCommentPostTitle(title);
    setComments([]);
    setCommentOpen(true);
    try {
      const fetched = await commentService.getComments(postId);
      setComments(fetched);
    } catch {
      toast.error('댓글을 불러오는데 실패했습니다.');
    }
  };

  const addComment = async (content: string) => {
    try {
      const newComment = await commentService.createComment(commentPostId, content);
      setComments(prev => [...prev, newComment]);
      
      // 코멘트 카운트 +1 반영 (로컬)
      if (tab === 0) {
        setFeeds(prev => prev.map(f => f.id === commentPostId ? { ...f, comments: f.comments + 1 } : f));
      } else {
        setGatherings(prev => prev.map(g => g.id === commentPostId ? { ...g, comments: g.comments + 1 } : g));
      }
    } catch {
      toast.error('댓글 작성에 실패했습니다.');
    }
  };

  const updateComment = async (id: string, content: string) => {
    try {
      await commentService.updateComment(id, content);
      setComments(prev => prev.map(c => c.id === id ? { ...c, content } : c));
    } catch {
      toast.error('댓글 수정에 실패했습니다.');
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm('정말로 댓글을 삭제하시겠습니까?')) return;
    try {
      await commentService.deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
      
      // 코멘트 카운트 -1 반영
      if (tab === 0) {
        setFeeds(prev => prev.map(f => f.id === commentPostId ? { ...f, comments: Math.max(0, f.comments - 1) } : f));
      } else {
        setGatherings(prev => prev.map(g => g.id === commentPostId ? { ...g, comments: Math.max(0, g.comments - 1) } : g));
      }
    } catch {
      toast.error('댓글 삭제에 실패했습니다.');
    }
  };

  const handleEditPost = (post: any) => {
    navigate(`/news/write?type=${tab === 0 ? 'feed' : 'gathering'}`, { state: { editPost: post } });
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('정말로 게시글을 삭제하시겠습니까?')) return;
    try {
      await newsService.deletePost(id);
      toast.success('게시글이 삭제되었습니다.');
      fetchPosts();
    } catch {
      toast.error('게시글 삭제에 실패했습니다.');
    }
  };

  return (
    <AppLayout>
      <div className="pt-3">
        <h1 className="text-[15px] font-bold px-5 mb-2 text-center">소식</h1>
        <TabSwitcher tabs={['활동 기록', '동네 모임']} activeTab={tab} onChange={i => { setTab(i); setSort('latest'); }} />
        <div className="mt-1.5" />
        <SortButtons current={sort} onChange={setSort} />

        {loading ? <LoadingSpinner /> : (
          <div className="px-4 pt-2 space-y-4 pb-4 animate-fade-in">
            {/* Feed Posts */}
            {tab === 0 ? feeds.map(f => (
              <div key={f.id} data-post-id={f.id} className={`bg-card rounded-xl shadow-card overflow-hidden transition-all duration-500 ${highlightId === f.id ? 'ring-2 ring-primary/40' : ''}`}>
                <ImageCarousel urls={f.imageUrls} />
                <div className="p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/12 flex items-center justify-center text-[11px] font-bold text-primary">{f.authorNickname[0] || '?'}</div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium leading-tight">{f.authorNickname}</p>
                        <p className="text-[10px] text-muted-foreground">{f.authorDistrict} · {f.createdAt}</p>
                      </div>
                    </div>
                    {f.authorId === currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:bg-muted p-1.5 rounded-full"><MoreHorizontal size={14} /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(f)} className="text-[12px]"><Pencil size={12} className="mr-2" /> <span>수정</span></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(f.id)} className="text-[12px] text-destructive focus:text-destructive"><Trash2 size={12} className="mr-2" /> <span>삭제</span></DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {f.title && (
                    <h3 className="text-[14px] font-semibold mb-1.5 text-foreground leading-tight">{f.title}</h3>
                  )}
                  <p className="text-[13px] text-foreground leading-[1.6] mb-3 whitespace-pre-wrap">{f.content}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(f.id, f.liked)} className={`flex items-center gap-1 text-[12px] ${f.liked ? 'text-accent' : 'text-muted-foreground'}`}>
                      <Heart size={14} fill={f.liked ? 'currentColor' : 'none'} strokeWidth={1.5} />{f.likes}
                    </button>
                    <button onClick={() => openComments(f.id, f.content.slice(0, 30))} className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MessageCircle size={14} strokeWidth={1.5} />{f.comments}
                    </button>
                  </div>
                </div>
              </div>
            )) : gatherings.map(g => (
              <div key={g.id} data-post-id={g.id} className={`bg-card rounded-xl shadow-card overflow-hidden transition-all duration-500 ${highlightId === g.id ? 'ring-2 ring-primary/40' : ''}`}>
                <ImageCarousel urls={g.imageUrls} />
                <div className="p-3.5">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-[15px] font-semibold">{g.title}</h3>
                    {g.authorId === currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:bg-muted p-1.5 rounded-full -mt-1"><MoreHorizontal size={14} /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(g)} className="text-[12px]"><Pencil size={12} className="mr-2" /> <span>수정</span></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(g.id)} className="text-[12px] text-destructive focus:text-destructive"><Trash2 size={12} className="mr-2" /> <span>삭제</span></DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/12 flex items-center justify-center text-[9px] font-bold text-primary">{g.authorNickname[0] || '?'}</div>
                    <span className="text-[11px] text-muted-foreground">{g.authorNickname} · {g.authorDistrict}</span>
                  </div>
                  <div className="space-y-1 mb-2">
                    <p className="text-[13px] text-foreground font-medium flex items-center gap-1"><MapPin size={13} strokeWidth={1.4} />{g.location}</p>
                    <p className="text-[13px] text-foreground font-medium flex items-center gap-1"><Calendar size={13} strokeWidth={1.4} />{g.schedule}</p>
                  </div>
                  <p className="text-[12px] text-foreground leading-relaxed mb-2.5">{g.description}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(g.id, g.liked)} className={`flex items-center gap-1 text-[12px] ${g.liked ? 'text-accent' : 'text-muted-foreground'}`}>
                      <Heart size={14} fill={g.liked ? 'currentColor' : 'none'} strokeWidth={1.5} />{g.likes}
                    </button>
                    <button onClick={() => openComments(g.id, g.title)} className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MessageCircle size={14} strokeWidth={1.5} />{g.comments}
                    </button>
                  </div>
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
          comments={comments}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
        />
      </div>
    </AppLayout>
  );
};

export default NewsPage;
