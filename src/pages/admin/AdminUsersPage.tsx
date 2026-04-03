import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { adminService } from '@/services/adminService';
import type { AdminUser } from '@/types/admin';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'temperature' | 'total'>('latest');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    adminService.getUsers()
      .then(setUsers)
      .catch(() => toast.error('유저 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.nickname.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.district.includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter((u) => u.status === statusFilter);
    result.sort((a, b) => {
      if (sortBy === 'temperature') return b.temperature - a.temperature;
      if (sortBy === 'total') return b.totalTemperature - a.totalTemperature;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return result;
  }, [users, search, statusFilter, sortBy]);

  const toggleStatus = async (user: AdminUser) => {
    try {
      if (user.status === 'active') {
        await adminService.suspendUser(user.id, '관리자 판단에 의한 정지');
        toast.success(`${user.nickname} 유저가 정지되었습니다.`);
      } else {
        await adminService.activateUser(user.id);
        toast.success(`${user.nickname} 유저가 활성화되었습니다.`);
      }
      fetchUsers();
    } catch {
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 max-w-[1400px]">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="닉네임, 이메일, 동네 검색"
            className="h-9 w-64 rounded-md border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none"
        >
          <option value="all">전체 상태</option>
          <option value="active">정상</option>
          <option value="suspended">정지</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:outline-none"
        >
          <option value="latest">최신 가입순</option>
          <option value="temperature">월간 온도 높은순</option>
          <option value="total">누적 온도 높은순</option>
        </select>
        <span className="text-sm text-muted-foreground ml-auto">{filtered.length}명</span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-medium">닉네임</th>
              <th className="text-left px-4 py-3 font-medium">이메일</th>
              <th className="text-left px-4 py-3 font-medium">동네</th>
              <th className="text-right px-4 py-3 font-medium">월간 온도</th>
              <th className="text-right px-4 py-3 font-medium">누적 온도</th>
              <th className="text-center px-4 py-3 font-medium">순위</th>
              <th className="text-center px-4 py-3 font-medium">상태</th>
              <th className="text-left px-4 py-3 font-medium">가입일</th>
              <th className="text-center px-4 py-3 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors text-sm">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                      {user.nickname[0]}
                    </div>
                    <span className="text-foreground font-medium">{user.nickname}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-foreground">{user.district}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">{user.temperature}°C</td>
                <td className="px-4 py-3 text-right text-muted-foreground">{user.totalTemperature}°C</td>
                <td className="px-4 py-3 text-center text-foreground">{user.rank}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    label={user.status === 'active' ? '정상' : '정지'}
                    variant={user.status === 'active' ? 'success' : 'danger'}
                  />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{user.createdAt}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-2.5 py-1 text-xs rounded border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      상세
                    </button>
                    <button
                      onClick={() => toggleStatus(user)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        user.status === 'active'
                          ? 'bg-admin-red-light text-admin-red hover:bg-admin-red/10'
                          : 'bg-admin-green-light text-admin-green hover:bg-admin-green/10'
                      }`}
                    >
                      {user.status === 'active' ? '정지' : '해제'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>유저 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-base font-semibold text-primary">
                  {selectedUser.nickname[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-base">{selectedUser.nickname}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <StatusBadge
                  label={selectedUser.status === 'active' ? '정상' : '정지'}
                  variant={selectedUser.status === 'active' ? 'success' : 'danger'}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">소속 구:</span> <span className="font-medium text-foreground">{selectedUser.district}</span></div>
                <div><span className="text-muted-foreground">월간 온도:</span> <span className="font-medium text-foreground">{selectedUser.temperature}°C</span></div>
                <div><span className="text-muted-foreground">누적 온도:</span> <span className="font-medium text-foreground">{selectedUser.totalTemperature}°C</span></div>
                <div><span className="text-muted-foreground">개인 순위:</span> <span className="font-medium text-foreground">{selectedUser.rank}위</span></div>
                <div><span className="text-muted-foreground">작성한 글:</span> <span className="font-medium text-foreground">{selectedUser.postsCount}개</span></div>
                <div><span className="text-muted-foreground">댓글:</span> <span className="font-medium text-foreground">{selectedUser.commentsCount}개</span></div>
                <div><span className="text-muted-foreground">좋아요:</span> <span className="font-medium text-foreground">{selectedUser.likesCount}개</span></div>
                <div><span className="text-muted-foreground">가입일:</span> <span className="font-medium text-foreground">{selectedUser.createdAt}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
