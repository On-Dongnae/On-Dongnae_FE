import { useState, useEffect } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import { adminPolicyHistory } from '@/mocks/admin';
import type { AdminMissionPolicy } from '@/types/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminMissionsPage() {
  const [tab, setTab] = useState<'daily' | 'hidden' | 'policy'>('daily');
  const [missions, setMissions] = useState<AdminMissionPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminMissionPolicy | null>(null);
  const [editPoints, setEditPoints] = useState(0);
  const [editActive, setEditActive] = useState(true);

  const fetchMissions = () => {
    setLoading(true);
    adminService.getMissionPolicies()
      .then(setMissions)
      .catch(() => toast.error('미션 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchMissions(); }, []);

  const dailyMissions = missions.filter((m) => m.type === 'daily');
  const hiddenMissions = missions.filter((m) => m.type === 'hidden');

  const openEdit = (m: AdminMissionPolicy) => {
    setEditing(m);
    setEditPoints(m.points);
    setEditActive(m.isActive);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await adminService.updateMission(editing.id, { pointAmount: editPoints });
      toast.success('미션이 수정되었습니다.');
      setEditing(null);
      fetchMissions();
    } catch {
      toast.error('미션 수정에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border">
        {([
          ['daily', '일일 미션'],
          ['hidden', '히든 미션'],
          ['policy', '포인트 정책'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Daily missions */}
      {tab === 'daily' && (
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-muted-foreground border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium">미션명</th>
                <th className="text-left px-4 py-3 font-medium max-w-xs">설명</th>
                <th className="text-center px-4 py-3 font-medium">카테고리</th>
                <th className="text-center px-4 py-3 font-medium">난이도</th>
                <th className="text-center px-4 py-3 font-medium">획득 온도</th>
                <th className="text-center px-4 py-3 font-medium">상태</th>
                <th className="text-center px-4 py-3 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {dailyMissions.map((m) => (
                <tr key={m.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors text-sm">
                  <td className="px-4 py-3 font-medium text-foreground">{m.title}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{m.description}</td>
                  <td className="px-4 py-3 text-center text-foreground">{m.category}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      label={m.difficulty}
                      variant={m.difficulty === '쉬움' ? 'success' : m.difficulty === '보통' ? 'warning' : 'danger'}
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">+{m.points}°C</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge label={m.isActive ? '활성' : '비활성'} variant={m.isActive ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openEdit(m)}
                      className="px-2.5 py-1 text-xs rounded border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hidden missions */}
      {tab === 'hidden' && (
        <div className="space-y-3">
          {hiddenMissions.map((m) => (
            <div key={m.id} className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-base">{m.title}</span>
                    <StatusBadge label={m.isActive ? '활성' : '비활성'} variant={m.isActive ? 'success' : 'neutral'} />
                    <span className="text-sm text-primary font-medium">+{m.points}°C</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                    <span>활동 유형: <span className="text-foreground">{m.activityType}</span></span>
                    <span>인증 방식: <span className="text-foreground">{m.verificationMethod}</span></span>
                  </div>
                  {m.reason && (
                    <p className="text-sm text-muted-foreground italic">추천 이유: {m.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => openEdit(m)}
                  className="px-2.5 py-1 text-xs rounded border border-border text-foreground hover:bg-muted transition-colors shrink-0"
                >
                  수정
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Point policy */}
      {tab === 'policy' && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-muted-foreground border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium">미션명</th>
                  <th className="text-center px-4 py-3 font-medium">유형</th>
                  <th className="text-center px-4 py-3 font-medium">현재 온도</th>
                  <th className="text-center px-4 py-3 font-medium">상태</th>
                  <th className="text-center px-4 py-3 font-medium">수정</th>
                </tr>
              </thead>
              <tbody>
                {missions.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 text-sm">
                    <td className="px-4 py-3 text-foreground">{m.title}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge label={m.type === 'daily' ? '일일' : '히든'} variant={m.type === 'daily' ? 'info' : 'warning'} />
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-foreground">+{m.points}°C</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge label={m.isActive ? '활성' : '비활성'} variant={m.isActive ? 'success' : 'neutral'} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openEdit(m)}
                        className="px-2.5 py-1 text-xs rounded border border-border text-foreground hover:bg-muted transition-colors"
                      >
                        수정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Policy change history */}
          <div className="bg-card rounded-lg border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-4">정책 변경 이력</h3>
            <div className="space-y-2">
              {adminPolicyHistory.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm py-2.5 border-b border-border/50 last:border-0">
                  <div className="text-foreground">
                    <span className="font-medium">{h.missionTitle}</span>
                    <span className="text-muted-foreground"> — {h.field}: </span>
                    <span className="text-admin-red line-through">{h.oldValue}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="text-admin-green font-medium">{h.newValue}</span>
                  </div>
                  <div className="text-muted-foreground shrink-0 ml-4">
                    {h.changedBy} · {h.changedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>미션 수정</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 text-sm">
              <p className="font-medium text-foreground text-base">{editing.title}</p>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">획득 온도 (°C)</label>
                <input
                  type="number"
                  value={editPoints}
                  onChange={(e) => setEditPoints(Number(e.target.value))}
                  min={0}
                  className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">상태:</label>
                <button
                  onClick={() => setEditActive(!editActive)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    editActive
                      ? 'bg-admin-green-light text-admin-green'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {editActive ? '활성' : '비활성'}
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveEdit}
                  className="px-4 py-1.5 text-sm rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-1.5 text-sm rounded border border-border text-foreground hover:bg-muted transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
