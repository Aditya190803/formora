'use client';

import Link from 'next/link';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const user = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full px-4 py-8">
      <div className="container mx-auto h-20 flex items-center justify-between px-10 rounded-[2.5rem] bg-card border-4 border-foreground shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-black text-2xl tracking-tighter">Formora</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            Features
          </Link>
          <Link href="/#styles" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            Styles
          </Link>
          <Link href="/#pricing" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <Button className="rounded-2xl font-black px-8 h-12 uppercase tracking-tight" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="font-black uppercase tracking-tight" asChild>
                <Link href="/handler/sign-in">Sign In</Link>
              </Button>
              <Button className="rounded-2xl font-black px-8 h-12 uppercase tracking-tight shadow-lg shadow-primary/20" asChild>
                <Link href="/handler/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link 
                href="/#features" 
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/#styles" 
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                Styles
              </Link>
              <Link 
                href="/#pricing" 
                className="text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                Pricing
              </Link>
              <div className="h-px bg-border my-4" />
              {user ? (
                <Button asChild className="w-full">
                  <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/handler/sign-in" onClick={() => setOpen(false)}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/handler/sign-up" onClick={() => setOpen(false)}>Get Started</Link>
                  </Button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
