import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NewsComment } from '@/types';
import { Send } from 'lucide-react';

interface CommentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postTitle: string;
  comments: NewsComment[];
  onAddComment: (content: string) => void;
}

const CommentSheet = ({ open, onOpenChange, postTitle, comments, onAddComment }: CommentSheetProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onAddComment(input.trim());
    setInput('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-0 pb-0 max-h-[70vh] flex flex-col">
        <SheetHeader className="px-4 pb-2 border-b border-border">
          <SheetTitle className="text-[14px] font-semibold text-left truncate">{postTitle}</SheetTitle>
          <p className="text-[11px] text-muted-foreground text-left">댓글 {comments.length}개</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {comments.length === 0 ? (
            <p className="text-[12px] text-muted-foreground text-center py-8">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">
                  {c.authorNickname[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[12px] font-medium">{c.authorNickname}</span>
                    <span className="text-[10px] text-muted-foreground">{c.createdAt}</span>
                  </div>
                  <p className="text-[12px] text-foreground leading-relaxed mt-0.5">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border px-3 py-2.5 flex items-center gap-2 bg-background">
          <input
            className="flex-1 h-9 rounded-full bg-muted px-3.5 text-[13px] outline-none placeholder:text-muted-foreground"
            placeholder="댓글을 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity"
          >
            <Send size={14} strokeWidth={2} />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentSheet;
