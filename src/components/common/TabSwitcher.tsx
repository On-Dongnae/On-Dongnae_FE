import { cn } from '@/lib/utils';

interface TabSwitcherProps {
  tabs: string[];
  activeTab: number;
  onChange: (index: number) => void;
}

const TabSwitcher = ({ tabs, activeTab, onChange }: TabSwitcherProps) => {
  return (
    <div className="flex px-4 gap-1 mb-1">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(i)}
          className={cn(
            'flex-1 py-2 text-[13px] font-medium transition-all relative',
            activeTab === i
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {tab}
          <span
            className={cn(
              'absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all',
              activeTab === i ? 'w-8 bg-primary' : 'w-0 bg-transparent'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
