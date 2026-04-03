const EmptyState = ({ message = '아직 데이터가 없어요', icon = '📭' }: { message?: string; icon?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-1.5">
    <span className="text-2xl">{icon}</span>
    <p className="text-[12px] text-muted-foreground">{message}</p>
  </div>
);

export default EmptyState;
