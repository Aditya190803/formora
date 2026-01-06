'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@stackframe/stack';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, FileText, BarChart3, Eye, TrendingUp, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { Form } from '@/lib/types';
import { formsService } from '@/lib/appwrite';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const user = useUser();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalForms: 0,
    totalResponses: 0,
    totalViews: 0,
    completionRate: 0,
  });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  useEffect(() => {
    const fetchFormsAndStats = async () => {
      if (!user?.id) return;
      try {
        const data = await formsService.listByUser(user.id);
        setForms(data);

        // Calculate stats from forms
        let totalResponses = 0;
        let totalViews = 0;

        // Fetch analytics for each form
        for (const form of data) {
          try {
            const response = await fetch(`/api/forms/${form.$id}/analytics`);
            if (response.ok) {
              const analytics = await response.json();
              totalResponses += analytics.totalResponses || 0;
              totalViews += analytics.totalViews || 0;
            }
          } catch (error) {
            console.error(`Failed to fetch analytics for form ${form.$id}:`, error);
          }
        }

        const completionRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;

        setStats({
          totalForms: data.length,
          totalResponses,
          totalViews,
          completionRate,
        });
      } catch (error) {
        console.error('Failed to fetch forms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFormsAndStats();
  }, [user?.id]);

  const statCards = [
    { label: 'Total Forms', value: stats.totalForms.toString(), icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { label: 'Total Responses', value: stats.totalResponses.toString(), icon: BarChart3, color: 'text-primary', bgColor: 'bg-primary' },
    { label: 'Views', value: stats.totalViews.toString(), icon: Eye, color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'text-green-500', bgColor: 'bg-green-500' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-bold uppercase">
            {greeting}, {user?.displayName?.split(' ')[0] || 'USER'}
          </p>
        </div>
        <Button size="lg" className="h-14 px-8 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-lg font-black uppercase italic" asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="w-6 h-6 mr-2 stroke-[3]" />
            Create New Form
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="group relative p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-14 h-14 border-4 border-foreground flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", stat.bgColor)}>
                <stat.icon className="w-7 h-7 text-white stroke-[3]" />
              </div>
              <ArrowUpRight className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <div className="text-4xl font-black tracking-tighter">{stat.value}</div>
              <div className="text-sm font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4 border-4 border-foreground border-dashed bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Loader2 className="w-12 h-12 animate-spin text-primary stroke-[3]" />
            <p className="text-xl font-black uppercase italic">Loading Workspace...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="relative py-24 text-center bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12">
            <div className="w-24 h-24 border-4 border-foreground bg-primary flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-12 h-12 text-white stroke-[3]" />
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase italic">No forms yet</h2>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto text-xl font-bold">
              CHOOSE FROM THREE DISTINCT STYLES: CLASSIC, CONVERSATIONAL, OR MARKETING. 
              TRANSFORM YOUR DATA COLLECTION.
            </p>
            <Button size="lg" className="h-16 px-10 border-4 border-foreground bg-primary text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-xl font-black uppercase italic" asChild>
              <Link href="/dashboard/forms/new">
                Start Building
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {forms.slice(0, 3).map((form) => (
              <Link key={form.$id} href={`/dashboard/forms/${form.$id}`} className="group block p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-4 py-1 border-2 border-foreground bg-primary/10 text-xs font-black uppercase tracking-widest">
                    {form.style}
                  </div>
                  <div className="text-xs font-black text-muted-foreground uppercase">
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-2 uppercase italic group-hover:text-primary transition-colors">{form.title}</h3>
                <p className="text-muted-foreground font-bold line-clamp-2 mb-6">{form.description || 'No description provided.'}</p>
                <div className="flex items-center text-sm font-black uppercase italic text-primary">
                  View Details <ArrowUpRight className="ml-2 w-4 h-4 stroke-[3]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
