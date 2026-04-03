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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imageFiles.length + files.length > 3) {
      toast.error('사진은 최대 3장까지 첨부할 수 있습니다.');
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviews).then(previews => {
      setImagePreviews(prev => [...prev, ...previews]);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content) { toast.error('내용을 입력해주세요.'); return; }
    if (tab === 'gathering' && !title) { toast.error('제목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      await newsService.createPost({ type: tab, title, content, location, schedule, images: imageFiles });
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
          <label className="text-sm font-medium mb-1.5 block">사진 <span className="text-muted-foreground font-normal">(선택, 최대 3장)</span></label>
          <div className="flex flex-col gap-2">
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden min-w-[124px] w-[124px] h-[124px] border border-border">
                    <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(index)} className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 text-[10px] w-6 h-6 flex items-center justify-center backdrop-blur-sm z-10 transition-colors hover:bg-black/80">✕</button>
                  </div>
                ))}
              </div>
            )}
            {imagePreviews.length < 3 && (
              <label className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-border bg-card cursor-pointer hover:bg-accent/50 transition-colors">
                <Camera size={22} className="text-muted-foreground mr-2" strokeWidth={1.4} />
                <span className="text-sm text-muted-foreground">사진 추가 ({imagePreviews.length}/3)</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60 mt-2">
          {loading ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
};

export default NewsWritePage;
