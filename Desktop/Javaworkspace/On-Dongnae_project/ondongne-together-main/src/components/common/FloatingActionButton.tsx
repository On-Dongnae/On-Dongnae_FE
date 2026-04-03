import { Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: ReactNode;
}

const FloatingActionButton = ({ onClick, icon }: FloatingActionButtonProps) => (
  <div className="fixed bottom-[72px] z-40 left-1/2 -translate-x-1/2 w-full pointer-events-none" style={{ maxWidth: '430px' }}>
    <button
      onClick={onClick}
      className="absolute bottom-0 right-4 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center active:scale-95 transition-transform pointer-events-auto"
    >
      {icon ?? <Plus size={20} strokeWidth={2} />}
    </button>
  </div>
);

export default FloatingActionButton;
