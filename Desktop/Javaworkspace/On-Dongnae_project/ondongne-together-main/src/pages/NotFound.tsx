import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container flex flex-col items-center justify-center min-h-screen gap-4">
      <span className="text-5xl">🔍</span>
      <h1 className="text-xl font-bold text-foreground">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-muted-foreground">주소를 다시 확인해주세요.</p>
      <button onClick={() => navigate('/home')} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
