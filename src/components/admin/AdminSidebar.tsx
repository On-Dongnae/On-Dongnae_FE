import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import adminLogo from '@/assets/admin-logo.png';

const navItems = [
  { title: '대시보드', path: '/admin', icon: LayoutDashboard },
  { title: '유저 관리', path: '/admin/users', icon: Users },
  { title: '피드 관리', path: '/admin/feeds', icon: FileText },
  { title: '수동 활동 인증', path: '/admin/verifications', icon: ShieldCheck },
  { title: '미션·정책 관리', path: '/admin/missions', icon: Settings },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-admin-sidebar-bg flex flex-col transition-all duration-200 z-30 border-r border-admin-sidebar-hover ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 h-[72px] border-b border-admin-sidebar-hover">
        <img
          src={adminLogo}
          alt="온동네 로고"
          className="h-9 w-9 shrink-0 object-contain"
        />
        {!collapsed && (
          <span className="text-[17px] font-bold text-primary tracking-tight">
            온동네 관리자
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-[15px] transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-admin-sidebar-fg hover:bg-admin-sidebar-hover hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-admin-sidebar-hover text-admin-sidebar-fg hover:text-foreground transition-colors"
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  );
}
