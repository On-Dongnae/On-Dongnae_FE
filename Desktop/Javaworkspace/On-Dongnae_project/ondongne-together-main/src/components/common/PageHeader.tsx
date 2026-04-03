import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const PageHeader = ({ title, showBack = false, rightAction }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between h-11 px-4">
        <div className="w-8">
          {showBack && (
            <button onClick={() => { if (window.history.length > 1) { navigate(-1); } else { navigate('/home'); } }} className="p-0.5 -ml-0.5 text-foreground">
              <ArrowLeft size={20} strokeWidth={1.6} />
            </button>
          )}
        </div>
        <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
        <div className="w-8 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
};

export default PageHeader;
