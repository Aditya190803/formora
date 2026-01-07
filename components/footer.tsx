import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-muted bg-bg pt-40 pb-20 px-6 font-body">
      <div className="container mx-auto space-y-40">
        <div className="flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-12 max-w-xl">
            <Link href="/" className="inline-block group">
              <span className="font-display text-7xl md:text-9xl tracking-tighter text-ink italic leading-none block">Formora</span>
            </Link>
            <p className="text-xl md:text-2xl font-heading leading-tight italic opacity-40">
              Forms are not containers. They are dialogues. Build narratives, not databases.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-12 uppercase text-[10px] tracking-[0.4em] font-medium">
            <div className="space-y-8">
              <div className="opacity-20 border-b border-muted pb-4">Inquiry</div>
              <ul className="space-y-4">
                <li><Link href="/#features" className="hover:opacity-60 transition-opacity">Manifesto</Link></li>
                <li><Link href="/#styles" className="hover:opacity-60 transition-opacity">Philosophy</Link></li>
                <li><Link href="/#pricing" className="hover:opacity-60 transition-opacity">Access</Link></li>
              </ul>
            </div>
            
            <div className="space-y-8">
              <div className="opacity-20 border-b border-muted pb-4">Exchange</div>
              <ul className="space-y-4">
                <li><Link href="#" className="hover:opacity-60 transition-opacity">Twitter</Link></li>
                <li><Link href="#" className="hover:opacity-60 transition-opacity">GitHub</Link></li>
                <li><Link href="#" className="hover:opacity-60 transition-opacity">Discord</Link></li>
              </ul>
            </div>
            
            <div className="space-y-8">
              <div className="opacity-20 border-b border-muted pb-4">Nodes</div>
              <ul className="space-y-4">
                <li><Link href="/docs" className="hover:opacity-60 transition-opacity">Library</Link></li>
                <li><Link href="/templates" className="hover:opacity-60 transition-opacity">Ledger</Link></li>
                <li><Link href="/privacy" className="hover:opacity-60 transition-opacity">Ethics</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-muted pt-12">
          <div className="flex items-center gap-12 text-[9px] uppercase tracking-[0.3em] font-medium opacity-20">
            <span>© 2024 FORMORA LABS</span>
            <span className="hidden md:inline">SYSTEM STATUS: OPERATIONAL</span>
            <span className="hidden md:inline">LOC: 40.7128° N, 74.0060° W</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Live Nodes: 4.8k</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
