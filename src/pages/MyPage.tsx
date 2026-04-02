import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { authService } from '@/services/authService';
import { districtRankings } from '@/mocks/rankings';
import { formatTemp } from '@/lib/temperature';
import { Award, Gift, FileText, ChevronRight, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const MyPage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const districtData = districtRankings.find(d => d.district === user.district);

  const handleLogout = async () => {
    await authService.logout();
    toast.success('로그아웃되었습니다.');
    navigate('/');
  };

  const menuItems = [
    { icon: Award, label: '업적 / 배지', path: '/mypage/badges' },
    { icon: Gift, label: '보상함', path: '/mypage/rewards' },
    { icon: FileText, label: '활동 내역', path: '/mypage/activity' },
  ];

  return (
    <AppLayout>
      <div className="pt-3 px-4 animate-fade-in">
        <h1 className="text-[15px] font-bold px-1 mb-3">마이페이지</h1>

        {/* Profile card */}
        <div className="bg-card rounded-2xl p-4 shadow-card mb-3">
          <div className="flex items-center gap-3 mb-3.5">
            <Avatar className="h-12 w-12">
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.nickname} /> : null}
              <AvatarFallback className="bg-primary/12 text-primary text-lg font-bold">
                <User size={22} strokeWidth={1.5} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-[15px] font-bold leading-tight">{user.nickname}</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">{user.district}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background rounded-lg py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground">월간 온도</p>
              <p className="text-[16px] font-bold text-primary mt-0.5">{formatTemp(user.temperature)}</p>
            </div>
            <div className="bg-background rounded-lg py-2.5 text-center">
              <p className="text-[10px] text-muted-foreground">누적 온도</p>
              <p className="text-[16px] font-bold text-foreground mt-0.5">{formatTemp(user.totalTemperature)}</p>
            </div>
            <div className="bg-background rounded-lg py-2 text-center">
              <p className="text-[10px] text-muted-foreground">개인 순위</p>
              <p className="text-[13px] font-bold mt-0.5">{user.rank}위</p>
            </div>
            <div className="bg-background rounded-lg py-2 text-center">
              <p className="text-[10px] text-muted-foreground">동네 순위</p>
              <p className="text-[13px] font-bold mt-0.5">{districtData?.rank || '-'}위</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 active:bg-muted/40 transition-colors ${
                i !== 0 ? 'border-t border-border/50' : ''
              }`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon size={17} className="text-muted-foreground" strokeWidth={1.5} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
              <ChevronRight size={15} className="text-muted-foreground/60" strokeWidth={1.5} />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-1.5 py-2.5 text-[12px] text-muted-foreground active:text-destructive transition-colors"
        >
          <LogOut size={14} strokeWidth={1.5} />
          로그아웃
        </button>
      </div>
    </AppLayout>
  );
};

export default MyPage;
