import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      if (user) {
        toast.success(`${user.nickname}님 환영합니다!`);
        navigate('/home');
      }
    } catch {
      toast.error('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container flex flex-col items-center justify-center min-h-screen px-7">
      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-[26px] font-bold text-foreground tracking-tight">온동네</h1>
        <p className="text-[13px] text-muted-foreground mt-1.5">온라인으로 연결된 온기 있는 우리 동네</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-3">
        <div>
          <label className="text-[12px] font-medium text-foreground mb-1.5 block">이메일</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full h-11 px-3.5 rounded-lg border border-border bg-card text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1.5 focus:ring-primary/40 focus:border-primary/60 transition-colors"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium text-foreground mb-1.5 block">비밀번호</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-11 px-3.5 pr-10 rounded-lg border border-border bg-card text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1.5 focus:ring-primary/40 focus:border-primary/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <Eye size={16} strokeWidth={1.5} /> : <EyeOff size={16} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] active:bg-primary/85 transition-colors disabled:opacity-60 mt-1"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground pt-1">
          <button className="active:text-foreground transition-colors">아이디 찾기</button>
          <span className="text-border">|</span>
          <button className="active:text-foreground transition-colors">비밀번호 찾기</button>
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-border/70" />
          <span className="text-[11px] text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border/70" />
        </div>

        <button
          onClick={() => navigate('/signup')}
          className="w-full h-11 rounded-lg border border-border text-foreground font-medium text-[13px] active:bg-muted/40 transition-colors"
        >
          회원가입
        </button>

        <p className="text-center text-[10px] text-muted-foreground/70 pt-2">
          로그인하면 이용 약관 및 개인 정보 처리 방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
