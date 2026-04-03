import { cn } from '@/lib/utils';

interface SortButtonsProps {
  current: 'latest' | 'popular';
  onChange: (sort: 'latest' | 'popular') => void;
}

const SortButtons = ({ current, onChange }: SortButtonsProps) => (
  <div className="flex gap-1.5 px-4 py-1.5">
    {(['latest', 'popular'] as const).map(sort => (
      <button
        key={sort}
        onClick={() => onChange(sort)}
        className={cn(
          'px-2.5 py-[5px] text-[11px] rounded-full transition-colors font-medium',
          current === sort
            ? 'bg-foreground text-background'
            : 'bg-secondary text-muted-foreground'
        )}
      >
        {sort === 'latest' ? '최신순' : '인기순'}
      </button>
    ))}
  </div>
);

export default SortButtons;
