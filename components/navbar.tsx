'use client';

import Link from 'next/link';
import { useUser } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const user = useUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full px-6 py-10 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-3xl font-medium tracking-tighter text-ink">Formora</span>
          <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <Link href="/#features" className="text-[10px] font-body uppercase tracking-[0.4em] text-ink opacity-40 hover:opacity-100 transition-opacity">
            Manifesto
          </Link>
          <Link href="/#styles" className="text-[10px] font-body uppercase tracking-[0.4em] text-ink opacity-40 hover:opacity-100 transition-opacity">
            Philosophy
          </Link>
          <Link href="/#pricing" className="text-[10px] font-body uppercase tracking-[0.4em] text-ink opacity-40 hover:opacity-100 transition-opacity">
            Access
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-8">
          {user ? (
            <Link href="/dashboard" className="text-[10px] font-body uppercase tracking-[0.4em] text-ink border-b border-ink">
              Architect / Dashboard
            </Link>
          ) : (
            <>
              <Link href="/handler/sign-in" className="text-[10px] font-body uppercase tracking-[0.4em] text-ink opacity-60">
                Inhabit
              </Link>
              <Link href="/handler/sign-up" className="px-6 py-2 bg-ink text-bg text-[10px] font-body uppercase tracking-[0.4em] hover:bg-accent transition-colors">
                Initialize
              </Link>
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
