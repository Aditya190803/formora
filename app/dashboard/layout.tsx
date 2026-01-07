'use client';

import { useUser } from '@stackframe/stack';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { isAppwriteConfigured } from '@/lib/appwrite';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Forms', href: '/dashboard/forms' },
  { icon: BarChart3, label: 'Responses', href: '/dashboard/responses' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 py-8">
      <div className="mb-16">
        <Link href="/" className="inline-block group">
          <span className="font-heading text-2xl italic tracking-tight">Formora</span>
          <span className="block text-[9px] uppercase tracking-[0.4em] opacity-30 mt-1">Architect Panel</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-4 px-4 py-3 text-ink opacity-50 hover:opacity-100 hover:bg-muted/10 transition-all duration-200 group border-l-2 border-transparent hover:border-ink/30"
          >
            <item.icon className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-8 border-t border-muted">
        <div className="text-[9px] uppercase tracking-[0.3em] opacity-20">System Status</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="text-[9px] opacity-40">Operational</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    redirect('/handler/sign-in');
  }

  return (
    <div className="min-h-screen flex bg-bg font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-muted bg-bg flex-col sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r border-muted">
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-muted bg-bg/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            {!isAppwriteConfigured() && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 border border-yellow-500/30 text-yellow-600 text-[9px] uppercase tracking-[0.2em]">
                <AlertTriangle className="w-3 h-3" />
                Appwrite not configured
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 p-0 border border-muted">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.displayName || ''} />
                    <AvatarFallback className="rounded-none text-[10px] font-heading italic">{user.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-none border-muted p-2">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-heading italic truncate">{user.displayName}</p>
                  <p className="text-[10px] opacity-40 truncate">{user.primaryEmail}</p>
                </div>
                <DropdownMenuSeparator className="bg-muted" />
                <DropdownMenuItem asChild className="rounded-none text-[10px] uppercase tracking-[0.2em]">
                  <Link href="/dashboard/settings" className="flex items-center gap-2 w-full">
                    <Settings className="w-3 h-3" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-muted" />
                <DropdownMenuItem 
                  className="text-danger rounded-none text-[10px] uppercase tracking-[0.2em]"
                  onClick={() => user.signOut()}
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
