import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { newsService } from '@/services/newsService';
import { toast } from 'sonner';

const NewsWritePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = (searchParams.get('type') || 'feed') as 'feed' | 'gathering';
  const [tab, setTab] = useState<'feed' | 'gathering'>(type);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [schedule, setSchedule] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!content) { toast.error('내용을 입력해주세요.'); return; }
    if (tab === 'gathering' && !title) { toast.error('제목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      await newsService.createPost({ type: tab, title, content, location, schedule, image: imageFile || undefined });
      toast.success('글이 등록되었습니다!');
      navigate('/news');
    } catch {
      toast.error('등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="글쓰기" showBack />
      <div className="px-5 py-4 space-y-5 animate-fade-in">
        {/* Type selector */}
        <div className="flex gap-2">
          {(['feed', 'gathering'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 h-9 rounded-lg text-xs font-medium transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {t === 'feed' ? '활동 기록' : '동네 모임'}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">제목{tab === 'feed' && <span className="text-muted-foreground font-normal"> (선택)</span>}</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력해주세요" className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">본문</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용을 작성해주세요" rows={5} className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Gathering extras */}
        {tab === 'gathering' && (
          <>
            <div>
              <label className="text-sm font-medium mb-1.5 block">위치</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="모임 장소" className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">일정</label>
              <input value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="예: 4월 10일 오후 2시" className="w-full h-11 px-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </>
        )}

        {/* Image */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">사진 <span className="text-muted-foreground font-normal">(선택)</span></label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden">
              <img src={imagePreview} alt="preview" className="w-full h-36 object-cover" />
              <button onClick={clearImage} className="absolute top-2 right-2 bg-foreground/50 text-primary-foreground rounded-full p-1 text-xs">✕</button>
            </div>
          ) : (
            <label className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-border bg-card cursor-pointer">
              <Camera size={22} className="text-muted-foreground mr-2" strokeWidth={1.4} />
              <span className="text-sm text-muted-foreground">사진 추가</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60 mt-2">
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
};

export default NewsWritePage;
