import { useState, useMemo, useEffect } from 'react';
import { ClipboardCheck, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import type { AdminVerification } from '@/types/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminVerificationsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AdminVerification | null>(null);
  const [items, setItems] = useState<AdminVerification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVerifications = () => {
    setLoading(true);
    const apiStatus = statusFilter === 'all' ? 'pending' : statusFilter;
    adminService.getVerifications(apiStatus)
      .then(setItems)
      .catch(() => toast.error('인증 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchVerifications(); }, [statusFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const approved = items.filter((v) => v.status === 'approved').length;
    const failed = items.filter((v) => v.aiResult === 'fail').length;
    const pending = items.filter((v) => v.status === 'pending').length;
    return {
      total,
      autoApprovalRate: total ? Math.round((approved / total) * 100) : 0,
      failureRate: total ? Math.round((failed / total) * 100) : 0,
      pending,
    };
  }, [items]);

  const filtered = useMemo(() => {
    let result = [...items];
    if (statusFilter !== 'all') result = result.filter((v) => v.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.userNickname.toLowerCase().includes(q) ||
          v.missionTitle.toLowerCase().includes(q) ||
          v.userDistrict.includes(q)
      );
    }
    return result;
  }, [items, statusFilter, search]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      if (status === 'approved') {
        await adminService.approveVerification(id);
        toast.success('인증이 승인되었습니다.');
      } else if (status === 'rejected') {
        await adminService.rejectVerification(id, '관리자 판단에 의한 반려');
        toast.success('인증이 반려되었습니다.');
      }
      fetchVerifications();
    } catch {
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  const statusLabel = (s: string) =>
    s === 'pending' ? '검토 대기' : s === 'approved' ? '승인' : '반려';
  const statusVariant = (s: string) =>
    s === 'pending' ? 'warning' : s === 'approved' ? 'success' : 'danger';

  const aiLabel = (r: string) =>
    r === 'pass' ? 'AI 통과' : r === 'fail' ? 'AI 실패' : 'AI 불확실';
  const aiVariant = (r: string) =>
    r === 'pass' ? 'success' : r === 'fail' ? 'danger' : 'warning';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatsCard label="오늘 인증 요청" value={stats.total} icon={ClipboardCheck} variant="default" />
        <StatsCard label="자동 승인율" value={`${stats.autoApprovalRate}%`} icon={CheckCircle} variant="green" />
        <StatsCard label="AI 실패율" value={`${stats.failureRate}%`} icon={AlertTriangle} variant="red" />
        <StatsCard label="검토 대기" value={stats.pending} icon={XCircle} variant="amber" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="닉네임, 미션, 동네 검색"
            className="h-9 w-60 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none"
        >
          <option value="all">전체 상태</option>
          <option value="pending">검토 대기</option>
          <option value="approved">승인</option>
          <option value="rejected">반려</option>
        </select>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length}건</span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium">사용자</th>
              <th className="text-left px-4 py-3 font-medium">동네</th>
              <th className="text-left px-4 py-3 font-medium">미션</th>
              <th className="text-center px-4 py-3 font-medium">AI 결과</th>
              <th className="text-center px-4 py-3 font-medium">신뢰도</th>
              <th className="text-center px-4 py-3 font-medium">이미지 품질</th>
              <th className="text-center px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">제출일</th>
              <th className="text-center px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors text-sm">
                <td className="px-4 py-3 font-medium text-foreground">{v.userNickname}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.userDistrict}</td>
                <td className="px-4 py-3 text-foreground">{v.missionTitle}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge label={aiLabel(v.aiResult)} variant={aiVariant(v.aiResult)} />
                </td>
                <td className="px-4 py-3 text-center text-foreground font-medium">{v.confidenceScore}%</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    label={v.imageQuality === 'good' ? '양호' : v.imageQuality === 'fair' ? '보통' : '불량'}
                    variant={v.imageQuality === 'good' ? 'success' : v.imageQuality === 'fair' ? 'warning' : 'danger'}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge label={statusLabel(v.status)} variant={statusVariant(v.status)} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{v.submittedAt}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelected(v)}
                      className="px-2.5 py-1 text-xs rounded border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      검토
                    </button>
                    {v.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(v.id, 'approved')}
                          className="px-2.5 py-1 text-xs rounded bg-admin-green-light text-admin-green hover:bg-admin-green/10 transition-colors"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => updateStatus(v.id, 'rejected')}
                          className="px-2.5 py-1 text-xs rounded bg-admin-red-light text-admin-red hover:bg-admin-red/10 transition-colors"
                        >
                          반려
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>인증 검토</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{selected.userNickname}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{selected.userDistrict}</span>
              </div>

              <div className="h-48 rounded-md bg-muted/50 border border-border flex items-center justify-center text-sm text-muted-foreground">
                인증 이미지 영역
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">미션:</span> <span className="font-medium text-foreground">{selected.missionTitle}</span></div>
                <div><span className="text-muted-foreground">카테고리:</span> <span className="font-medium text-foreground">{selected.missionCategory}</span></div>
                <div><span className="text-muted-foreground">AI 판정:</span> <StatusBadge label={aiLabel(selected.aiResult)} variant={aiVariant(selected.aiResult)} /></div>
                <div><span className="text-muted-foreground">신뢰도:</span> <span className="font-medium text-foreground">{selected.confidenceScore}%</span></div>
                <div><span className="text-muted-foreground">검출 객체:</span> <span className="font-medium text-foreground">{selected.detectedObjects.join(', ')}</span></div>
                <div><span className="text-muted-foreground">이미지 품질:</span> <span className="font-medium text-foreground">{selected.imageQuality === 'good' ? '양호' : selected.imageQuality === 'fair' ? '보통' : '불량'}</span></div>
              </div>

              <p className="text-foreground">{selected.description}</p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { updateStatus(selected.id, 'approved'); setSelected(null); }}
                  className="px-3 py-1.5 text-sm rounded bg-admin-green-light text-admin-green hover:bg-admin-green/10 transition-colors"
                >
                  승인
                </button>
                <button
                  onClick={() => { updateStatus(selected.id, 'rejected'); setSelected(null); }}
                  className="px-3 py-1.5 text-sm rounded bg-admin-red-light text-admin-red hover:bg-admin-red/10 transition-colors"
                >
                  반려
                </button>
                <button
                  onClick={() => { updateStatus(selected.id, 'pending'); setSelected(null); }}
                  className="px-3 py-1.5 text-sm rounded bg-admin-amber-light text-admin-amber hover:bg-admin-amber/10 transition-colors"
                >
                  보류
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
