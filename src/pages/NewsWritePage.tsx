import { useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Camera } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { newsService } from '@/services/newsService';
import { toast } from 'sonner';

const NewsWritePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = (searchParams.get('type') || 'feed') as 'feed' | 'gathering';
  const locationState = useLocation();
  const editPost = locationState.state?.editPost;
  
  const [tab, setTab] = useState<'feed' | 'gathering'>(editPost ? (editPost.location ? 'gathering' : 'feed') : type);
  const [title, setTitle] = useState(editPost ? (editPost.title || '') : '');
  const [content, setContent] = useState(editPost ? (editPost.description || editPost.content || '') : '');
  const [location, setLocation] = useState(editPost ? (editPost.location || '') : '');
  const [schedule, setSchedule] = useState(editPost ? (editPost.schedule || '') : '');
  const [existingImages] = useState<string[]>(editPost ? (editPost.imageUrls || []) : []);
  const [newImages, setNewImages] = useState<{ file: File, preview: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (existingImages.length + newImages.length + files.length > 3) {
      toast.error('사진은 최대 3장까지 포함할 수 있습니다.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImages(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleExistingImageClick = () => {
    toast.info('기존 사진은 백엔드 구조상 개별 삭제할 수 없습니다.');
  };

  const handleSubmit = async () => {
    if (!content) { toast.error('내용을 입력해주세요.'); return; }
    if (tab === 'gathering' && !title) { toast.error('제목을 입력해주세요.'); return; }
    setLoading(true);
    try {
      const submitImages = newImages.map(n => n.file);
      if (editPost) {
        await newsService.updatePost(editPost.id, { type: tab, title, content, location, schedule, images: submitImages });
        toast.success('글이 수정되었습니다!');
      } else {
        await newsService.createPost({ type: tab, title, content, location, schedule, images: submitImages });
        toast.success('글이 등록되었습니다!');
      }
      navigate('/news', { state: { refresh: true } });
    } catch {
      toast.error(editPost ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container min-h-screen">
      <PageHeader title={editPost ? '글 수정' : '글쓰기'} showBack />
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
            {(existingImages.length > 0 || newImages.length > 0) && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {existingImages.map((preview, index) => (
                  <div key={`existing-${index}`} className="relative rounded-xl overflow-hidden min-w-[124px] w-[124px] h-[124px] border border-border group" onClick={handleExistingImageClick}>
                    <img src={preview} alt="기존 사진" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] bg-black/50 px-2 py-1 rounded">삭제 불가</span>
                    </div>
                  </div>
                ))}
                {newImages.map((item, index) => (
                  <div key={`new-${index}`} className="relative rounded-xl overflow-hidden min-w-[124px] w-[124px] h-[124px] border border-border">
                    <img src={item.preview} alt={`새 사진 ${index}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeNewImage(index)} className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 text-[10px] w-6 h-6 flex items-center justify-center backdrop-blur-sm z-10 transition-colors hover:bg-black/80">✕</button>
                  </div>
                ))}
              </div>
            )}
            {existingImages.length + newImages.length < 3 && (
              <label className="flex items-center justify-center h-24 rounded-xl border-2 border-dashed border-border bg-card cursor-pointer hover:bg-accent/50 transition-colors">
                <Camera size={22} className="text-muted-foreground mr-2" strokeWidth={1.4} />
                <span className="text-sm text-muted-foreground">사진 추가 ({existingImages.length + newImages.length}/3)</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60 mt-2">
          {loading ? (editPost ? '수정 중...' : '등록 중...') : (editPost ? '수정하기' : '등록하기')}
        </button>
      </div>
    </div>
  );
};

export default NewsWritePage;
