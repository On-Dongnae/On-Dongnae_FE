import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/users': '유저 관리',
  '/admin/feeds': '피드 관리',
  '/admin/verifications': '수동 활동 인증',
  '/admin/missions': '미션·정책 관리',
};

export default function AdminHeader() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || '관리자';
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="h-16 bg-admin-header-bg border-b border-admin-header-border flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden md:block">{today}</span>
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="검색..."
            className="h-9 w-52 rounded-md border border-border bg-muted/40 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors">
          <Bell className="h-[18px] w-[18px] text-muted-foreground" />
          <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-admin-red" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
            관
          </div>
          <span className="text-sm font-medium text-foreground hidden md:block">관리자</span>
        </div>
      </div>
    </header>
  );
}
