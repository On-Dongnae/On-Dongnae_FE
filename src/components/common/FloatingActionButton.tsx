import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => (
  <button
    onClick={onClick}
    className="fixed bottom-[72px] right-4 max-w-[430px] w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-md flex items-center justify-center active:scale-95 transition-transform z-40"
    style={{ right: 'calc(50% - 215px + 16px)' }}
  >
    <Plus size={20} strokeWidth={2} />
  </button>
);

export default FloatingActionButton;
