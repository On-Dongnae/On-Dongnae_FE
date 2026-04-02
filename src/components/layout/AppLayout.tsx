import { ReactNode } from 'react';
import BottomTabBar from './BottomTabBar';

interface AppLayoutProps {
  children: ReactNode;
  showTab?: boolean;
}

const AppLayout = ({ children, showTab = true }: AppLayoutProps) => {
  return (
    <div className="app-container">
      <main className={`min-h-screen ${showTab ? 'pb-tab-safe' : ''}`}>
        {children}
      </main>
      {showTab && <BottomTabBar />}
    </div>
  );
};

export default AppLayout;
