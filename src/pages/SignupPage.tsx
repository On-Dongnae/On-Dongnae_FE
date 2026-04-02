import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';

const DISTRICTS = [
  '강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구',
  '노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구',
  '성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구',
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', nickname: '', district: '' });
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [nicknameChecked, setNicknameChecked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm(p => ({ ...p, [key]: value }));
    if (key === 'email') setEmailChecked(null);
    if (key === 'nickname') setNicknameChecked(null);
  };

  const checkEmail = async () => {
    if (!form.email) return;
    const dup = await authService.checkEmailDuplicate(form.email);
    setEmailChecked(!dup);
    toast(dup ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.', { className: dup ? '' : '' });
  };

  const checkNickname = async () => {
    if (!form.nickname) return;
    const dup = await authService.checkNicknameDuplicate(form.nickname);
    setNicknameChecked(!dup);
    toast(dup ? '이미 사용 중인 닉네임입니다.' : '사용 가능한 닉네임입니다.');
  };

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.nickname || !form.district) {
      toast.error('모든 항목을 입력해주세요.'); return;
    }
    if (form.password !== form.passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.'); return;
    }
    if (form.password.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다.'); return;
    }
    setLoading(true);
    try {
      await authService.signup(form);
      toast.success('회원가입이 완료되었습니다!');
      navigate('/');
    } catch {
      toast.error('회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="회원가입" showBack />
      <div className="px-5 py-4 space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">이메일</label>
          <div className="flex gap-2">
            <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="이메일 주소" className="flex-1 h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={checkEmail} className="px-3 h-11 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium whitespace-nowrap">중복확인</button>
          </div>
          {emailChecked !== null && <p className={`text-xs mt-1 ${emailChecked ? 'text-success' : 'text-destructive'}`}>{emailChecked ? '✓ 사용 가능' : '✗ 이미 사용 중'}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">비밀번호</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} placeholder="6자 이상 입력" className="w-full h-11 px-3 pr-10 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        {/* Password Confirm */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">비밀번호 확인</label>
          <div className="relative">
            <input type={showPwConfirm ? 'text' : 'password'} value={form.passwordConfirm} onChange={e => update('passwordConfirm', e.target.value)} placeholder="비밀번호 재입력" className="w-full h-11 px-3 pr-10 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button type="button" onClick={() => setShowPwConfirm(!showPwConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPwConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {form.passwordConfirm && <p className={`text-xs mt-1 ${form.password === form.passwordConfirm ? 'text-success' : 'text-destructive'}`}>{form.password === form.passwordConfirm ? '✓ 일치' : '✗ 불일치'}</p>}
        </div>

        {/* Nickname */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">닉네임</label>
          <div className="flex gap-2">
            <input value={form.nickname} onChange={e => update('nickname', e.target.value)} placeholder="닉네임 입력" className="flex-1 h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={checkNickname} className="px-3 h-11 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium whitespace-nowrap">중복확인</button>
          </div>
          {nicknameChecked !== null && <p className={`text-xs mt-1 ${nicknameChecked ? 'text-success' : 'text-destructive'}`}>{nicknameChecked ? '✓ 사용 가능' : '✗ 이미 사용 중'}</p>}
        </div>

        {/* District */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">소속 동네</label>
          <select
            value={form.district}
            onChange={e => update('district', e.target.value)}
            className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
          >
            <option value="">구를 선택해주세요</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <button onClick={handleSignup} disabled={loading} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60 mt-4">
          {loading ? '가입 중...' : '가입 완료'}
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
