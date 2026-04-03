const LoadingSpinner = ({ message = '불러오는 중...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-2.5">
    <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    <p className="text-[12px] text-muted-foreground">{message}</p>
  </div>
);

export default LoadingSpinner;
