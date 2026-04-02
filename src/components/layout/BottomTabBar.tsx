import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Target, Newspaper, User } from 'lucide-react';

const tabs = [
  { path: '/home', label: '홈', icon: Home },
  { path: '/ranking', label: '순위', icon: Trophy },
  { path: '/mission', label: '미션', icon: Target },
  { path: '/news', label: '소식', icon: Newspaper },
  { path: '/mypage', label: '마이', icon: User },
];

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card/95 backdrop-blur-sm border-t border-border/60 z-50">
      <div className="flex items-center justify-around h-[52px] px-2">
        {tabs.map(tab => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-[3px] flex-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
};

export default BottomTabBar;
