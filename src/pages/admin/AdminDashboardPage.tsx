import { useEffect, useState } from 'react';
import { Users, ClipboardCheck, AlertTriangle, FileText, TrendingUp, Thermometer } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminService } from '@/services/adminService';
import type { AdminDashboardStats } from '@/types/admin';
import type { DistrictRanking, PersonalRanking } from '@/types';
import { adminVerifications } from '@/mocks/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [districtTop, setDistrictTop] = useState<DistrictRanking[]>([]);
  const [personalTop, setPersonalTop] = useState<PersonalRanking[]>([]);

  useEffect(() => {
    adminService.getDashboardStats().then(setStats);
    adminService.getDistrictRankings().then(setDistrictTop);
    adminService.getPersonalRankings().then(setPersonalTop);
  }, []);

  if (!stats) return null;

  const pendingVerifications = adminVerifications.filter((v) => v.status === 'pending');

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatsCard label="총 사용자" value={stats.totalUsers.toLocaleString()} icon={Users} variant="default" />
        <StatsCard label="이번 달 활성 사용자" value={stats.activeUsersThisMonth.toLocaleString()} icon={TrendingUp} variant="blue" />
        <StatsCard label="오늘 인증 건수" value={stats.todayVerifications} icon={ClipboardCheck} variant="green" />
        <StatsCard label="AI 실패율" value={`${stats.aiFailureRate}%`} icon={AlertTriangle} variant="red" />
        <StatsCard label="검토 대기" value={stats.pendingReviews} icon={AlertTriangle} variant="amber" />
        <StatsCard label="오늘 게시글" value={stats.todayFeeds} icon={FileText} variant="default" />
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* District ranking */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Thermometer className="h-[18px] w-[18px] text-primary" />
            동네 온도 순위 TOP 5
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-sm text-muted-foreground border-b border-border">
                <th className="text-left py-2.5 font-medium">순위</th>
                <th className="text-left py-2.5 font-medium">동네</th>
                <th className="text-right py-2.5 font-medium">평균 온도</th>
              </tr>
            </thead>
            <tbody>
              {districtTop.map((d) => (
                <tr key={d.rank} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-sm text-foreground font-medium">{d.rank}</td>
                  <td className="py-3 text-sm text-foreground">{d.district}</td>
                  <td className="py-3 text-right text-sm text-foreground font-medium">{d.averageTemperature}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Personal ranking */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-[18px] w-[18px] text-primary" />
            개인 랭킹 TOP 5
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-sm text-muted-foreground border-b border-border">
                <th className="text-left py-2.5 font-medium">순위</th>
                <th className="text-left py-2.5 font-medium">닉네임</th>
                <th className="text-left py-2.5 font-medium">동네</th>
                <th className="text-right py-2.5 font-medium">온도</th>
              </tr>
            </thead>
            <tbody>
              {personalTop.map((p) => (
                <tr key={p.rank} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-sm text-foreground font-medium">{p.rank}</td>
                  <td className="py-3 text-sm text-foreground">{p.nickname}</td>
                  <td className="py-3 text-sm text-muted-foreground">{p.district}</td>
                  <td className="py-3 text-right text-sm text-foreground font-medium">{p.temperature}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom section — pending verifications */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">수동 인증 대기 목록</h2>
        <div className="space-y-2">
          {pendingVerifications.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {v.userNickname[0]}
                </div>
                <div>
                  <p className="text-sm text-foreground">{v.userNickname} · {v.missionTitle}</p>
                  <p className="text-xs text-muted-foreground">{v.userDistrict} · {v.submittedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  label={v.aiResult === 'fail' ? 'AI 실패' : v.aiResult === 'uncertain' ? 'AI 불확실' : 'AI 통과'}
                  variant={v.aiResult === 'fail' ? 'danger' : v.aiResult === 'uncertain' ? 'warning' : 'success'}
                />
                <span className="text-sm text-muted-foreground">{v.confidenceScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
