import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t-4 border-foreground bg-card relative overflow-hidden">
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-4 mb-10 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <span className="font-black text-4xl tracking-tighter uppercase">Formora</span>
            </Link>
            <p className="text-muted-foreground font-bold leading-tight text-xl tracking-tight">
              Forms that adapt to your intent. Build once, choose how it feels.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Product</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#styles" className="hover:text-primary transition-colors">Styles</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Resources</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6">Legal</h3>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-20 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Formora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-primary transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
