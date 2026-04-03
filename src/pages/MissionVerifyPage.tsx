import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle, AlertCircle, XCircle, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { missionService } from '@/services/missionService';
import { VerificationResult } from '@/types';
import { toast } from 'sonner';

const MissionVerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const missionTitle = searchParams.get('title') || '미션 인증';

  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [imageScale, setImageScale] = useState(1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 3) {
      toast.error('사진은 최대 3장까지만 업로드할 수 있습니다.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, { file, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.error('인증 사진을 업로드해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const imageFiles = images.map(img => img.file);
      const res = await missionService.submitVerification(searchParams.get('id') || '', imageFiles, description);
      setResult(res);
      if (res.status === 'approved') toast.success(res.message);
    } catch {
      toast.error('인증 제출에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (result && result.status === 'review') {
      const missionId = searchParams.get('id');
      if (missionId) {
        interval = setInterval(async () => {
          try {
            const polledResult = await missionService.pollVerificationStatus(missionId);
            if (polledResult.status !== 'review') {
              setResult(polledResult);
              clearInterval(interval);
              if (polledResult.status === 'approved') toast.success(polledResult.message);
              if (polledResult.status === 'rejected') toast.error(polledResult.message);
            }
          } catch (e) {
            console.error(e);
          }
        }, 3000); // 3초마다 폴링
      }
    }
    return () => clearInterval(interval);
  }, [result, searchParams]);

  const statusIcon = {
    approved: <CheckCircle size={40} className="text-success" />,
    review: <AlertCircle size={40} className="text-primary" />,
    rejected: <XCircle size={40} className="text-destructive" />,
  };

  return (
    <div className="app-container min-h-screen">
      <PageHeader title="미션 인증" showBack />
      <div className="px-5 py-4 animate-fade-in">
        <div className="bg-primary/10 rounded-xl p-3.5 mb-5">
          <p className="text-xs text-muted-foreground">현재 미션</p>
          <p className="text-sm font-semibold text-foreground mt-0.5">{decodeURIComponent(missionTitle)}</p>
        </div>

        {!result ? (
          <>
            {/* Upload */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium block">인증 사진</label>
                <span className="text-xs text-muted-foreground">{images.length}/3</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {images.map((img, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden bg-muted w-48 h-48 flex-shrink-0 snap-center">
                    <img src={img.preview} alt="preview" className="w-full h-full object-cover transition-transform duration-200" style={{ transform: `scale(${imageScale})`, transformOrigin: 'center center' }} />
                    <button onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-foreground/50 text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="flex flex-col items-center justify-center w-48 h-48 flex-shrink-0 snap-center rounded-xl border-2 border-dashed border-border bg-card cursor-pointer hover:border-primary/30 transition-colors">
                    <Camera size={28} className="text-muted-foreground mb-2" strokeWidth={1.4} />
                    <span className="text-sm text-muted-foreground">사진 추가</span>
                    <span className="text-xs text-muted-foreground mt-1">최대 3장</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
              {images.length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button onClick={() => setImageScale(s => Math.max(0.5, s - 0.25))} className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground active:bg-secondary/70 transition-colors"><ZoomOut size={16} strokeWidth={1.6} /></button>
                  <button onClick={() => setImageScale(1)} className="text-[11px] text-muted-foreground font-medium px-2">{Math.round(imageScale * 100)}%</button>
                  <button onClick={() => setImageScale(s => Math.min(3, s + 0.25))} className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground active:bg-secondary/70 transition-colors"><ZoomIn size={16} strokeWidth={1.6} /></button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="text-sm font-medium mb-2 block">활동 설명 (선택)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="어떤 활동을 했는지 간단히 설명해주세요."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="bg-warm-bg rounded-lg p-3 mb-5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">📋 인증 가이드</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li>활동 현장이 보이는 사진을 올려주세요</li>
                <li>AI가 자동으로 사진을 검증합니다</li>
                <li>부적절한 사진은 반려될 수 있습니다</li>
              </ul>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || images.length === 0}
              className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> 검증 중...</>
              ) : (
                <><Upload size={16} /> 인증 제출</>
              )}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            {statusIcon[result.status]}
            <h2 className="text-lg font-bold mt-4">
              {result.status === 'approved' ? '인증 완료!' : result.status === 'review' ? '검토 중' : '인증 반려'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
            <button onClick={() => navigate('/mission')} className="mt-6 h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              미션 목록으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionVerifyPage;
