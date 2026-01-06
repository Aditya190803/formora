import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background noise-bg">
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 animate-bounce">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-xl font-black tracking-tighter uppercase italic">Formora</div>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '200ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
