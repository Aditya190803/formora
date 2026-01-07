export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg font-body">
      <div className="flex flex-col items-center gap-10">
        <div className="relative">
          <div className="w-16 h-16 border border-muted flex items-center justify-center">
            <div className="w-6 h-6 border border-muted animate-spin" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="font-heading text-2xl italic tracking-tight">Formora</span>
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-muted animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-muted animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-1 h-1 bg-muted animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
