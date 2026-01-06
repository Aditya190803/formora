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
    <div className="flex flex-col h-full p-8">
      <div className="mb-12">
        <Link href="/" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="font-black text-3xl tracking-tighter uppercase">Formora</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 group"
          >
            <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-black uppercase tracking-tight text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-8">
        {/* Plan info removed */}
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
    <div className="min-h-screen flex bg-background noise-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 border-r-4 border-foreground bg-card flex-col sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80 border-r-4 border-foreground">
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 border-b bg-card/30 backdrop-blur-md flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            {!isAppwriteConfigured() && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                Appwrite not configured
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-2xl p-0 overflow-hidden border bg-background/50">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.displayName || ''} />
                    <AvatarFallback className="rounded-none font-bold">{user.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-bold truncate">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.primaryEmail}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-xl">
                  <Link href="/dashboard/settings" className="flex items-center gap-2 w-full">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive rounded-xl"
                  onClick={() => user.signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
