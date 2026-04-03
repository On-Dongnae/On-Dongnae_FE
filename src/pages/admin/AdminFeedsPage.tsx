import { useState, useMemo, useEffect } from 'react';
import { Search, ImageIcon } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import type { AdminFeed } from '@/types/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminFeedsPage() {
  const [tab, setTab] = useState<'activity' | 'gathering'>('activity');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'hidden' | 'review'>('all');
  const [selectedFeed, setSelectedFeed] = useState<AdminFeed | null>(null);
  const [feeds, setFeeds] = useState<AdminFeed[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = () => {
    setLoading(true);
    adminService.getFeeds()
      .then(setFeeds)
      .catch(() => toast.error('피드 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchFeeds(); }, []);

  const filtered = useMemo(() => {
    let result = feeds.filter((f) => f.type === tab);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.authorNickname.toLowerCase().includes(q) ||
          f.content.toLowerCase().includes(q) ||
          f.authorDistrict.includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter((f) => f.status === statusFilter);
    return result;
  }, [feeds, tab, search, statusFilter]);

  const handleDeleteFeed = async (id: string) => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까? (복구 불가)')) return;
    try {
      await adminService.deleteFeed(id);
      toast.success('게시글이 삭제되었습니다.');
      fetchFeeds();
    } catch (err: any) {
      const msg = err?.response?.data?.message || '';
      if (msg.includes('ACCESS_DENIED') || err?.response?.status === 403) {
        toast.error('권한이 없습니다. 관리자 계정으로 해당 게시글을 삭제할 수 없습니다.');
      } else {
        toast.error(`삭제 실패: ${msg || '서버 오류'}`);
      }
    }
  };

  const feedStatusVariant = (s: string) =>
    s === 'normal' ? 'success' : s === 'hidden' ? 'neutral' : 'warning';
  const feedStatusLabel = (s: string) =>
    s === 'normal' ? '정상' : s === 'hidden' ? '숨김' : '검토 필요';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        {(['activity', 'gathering'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setStatusFilter('all'); }}
            className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'activity' ? '활동 기록' : '동네 모임'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="작성자, 내용, 동네 검색"
            className="h-9 w-60 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none"
        >
          <option value="all">전체 상태</option>
          <option value="normal">정상</option>
          <option value="hidden">숨김</option>
          <option value="review">검토 필요</option>
        </select>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length}건</span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium">작성자</th>
              <th className="text-left px-4 py-3 font-medium">동네</th>
              {tab === 'gathering' && <th className="text-left px-4 py-3 font-medium">제목</th>}
              <th className="text-left px-4 py-3 font-medium max-w-xs">내용</th>
              <th className="text-right px-4 py-3 font-medium">좋아요</th>
              <th className="text-right px-4 py-3 font-medium">댓글</th>
              <th className="text-center px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">작성일</th>
              <th className="text-center px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((feed) => (
              <tr key={feed.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors text-sm">
                <td className="px-4 py-3 font-medium text-foreground">{feed.authorNickname}</td>
                <td className="px-4 py-3 text-muted-foreground">{feed.authorDistrict}</td>
                {tab === 'gathering' && (
                  <td className="px-4 py-3 text-foreground">{feed.title}</td>
                )}
                <td className="px-4 py-3 text-foreground max-w-xs truncate">{feed.content}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{feed.likes}</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{feed.comments}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge label={feedStatusLabel(feed.status)} variant={feedStatusVariant(feed.status)} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{feed.createdAt}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedFeed(feed)}
                      className="px-2.5 py-1 text-xs rounded border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      보기
                    </button>
                    <button
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="px-2.5 py-1 text-xs rounded bg-admin-red-light text-admin-red hover:bg-admin-red/10 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedFeed} onOpenChange={() => setSelectedFeed(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>게시글 상세</DialogTitle>
          </DialogHeader>
          {selectedFeed && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedFeed.authorNickname}</span>
                <span>·</span>
                <span>{selectedFeed.authorDistrict}</span>
                <span>·</span>
                <span>{selectedFeed.createdAt}</span>
                <StatusBadge label={feedStatusLabel(selectedFeed.status)} variant={feedStatusVariant(selectedFeed.status)} />
              </div>
              {selectedFeed.title && (
                <h3 className="font-semibold text-foreground text-base">{selectedFeed.title}</h3>
              )}
              {/* Image Gallery */}
              {selectedFeed.imageUrls && selectedFeed.imageUrls.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedFeed.imageUrls.map((url, idx) => (
                    <div key={idx} className="min-w-[160px] w-[160px] h-[120px] rounded-md overflow-hidden border border-border shrink-0">
                      <img src={url} alt={`사진 ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 rounded-md bg-muted/50 border border-border flex items-center justify-center text-sm text-muted-foreground">
                  <ImageIcon size={20} className="mr-2 opacity-40" />
                  업로드된 이미지 없음
                </div>
              )}
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedFeed.content}</p>
              {selectedFeed.reported && (
                <div className="p-3 rounded-md bg-admin-red-light text-sm">
                  <span className="font-medium text-admin-red">신고 사유:</span>{' '}
                  <span className="text-foreground">{selectedFeed.reportReason}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    handleDeleteFeed(selectedFeed.id);
                    setSelectedFeed(null);
                  }}
                  className="px-3 py-1.5 text-sm rounded bg-admin-red-light text-admin-red hover:bg-admin-red/10 transition-colors"
                >
                  삭제
                </button>
                <button
                  onClick={() => setSelectedFeed(null)}
                  className="px-3 py-1.5 text-sm rounded border border-border text-foreground hover:bg-muted transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
