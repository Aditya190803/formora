'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    <div className="space-y-20 font-body">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-12 border-b border-muted">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-heading tracking-tighter leading-none italic">
            Atelier
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-medium whitespace-nowrap">
            {greeting} — {user?.displayName || 'OPERATOR'} — {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
        <Button size="lg" className="h-14" asChild>
          <Link href="/dashboard/forms/new">
            <Plus className="w-4 h-4 mr-3" />
            New Narrative
          </Link>
        </Button>
      </div>

      {/* Stats Summary - Industrial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-muted divide-y md:divide-y-0 md:divide-x divide-muted">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-8 space-y-4"
          >
            <div className="flex justify-between items-center opacity-40">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{stat.label}</span>
              <stat.icon className="w-3 h-3" />
            </div>
            <div className="text-4xl font-heading tracking-tighter">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Content Area */}
      <div className="relative">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-8 border border-muted border-dashed">
            <Loader2 className="w-8 h-8 animate-spin opacity-20" />
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Synchronizing Ledger</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="py-32 text-center border border-muted border-dashed space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-heading tracking-tight italic opacity-60">The archive is empty</h2>
              <p className="text-sm opacity-40 max-w-sm mx-auto leading-relaxed">
                Forms are not containers. They are dialogues waiting to happen. 
                Begin your first narrative.
              </p>
            </div>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/forms/new">
                Initialize System
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y border border-muted">
            {forms.map((form, index) => (
              <Link 
                key={form.$id} 
                href={`/dashboard/forms/${form.$id}`} 
                className="group block p-8 space-y-8 hover:bg-muted/5 transition-all aspect-square flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="text-[10px] opacity-20 font-mono tracking-tighter">
                    [ {index.toString().padStart(2, '0')} ]
                  </span>
                  <h3 className="text-2xl font-heading tracking-tight leading-tight group-hover:italic transition-all">
                    {form.title}
                  </h3>
                  <p className="text-sm opacity-50 line-clamp-2 leading-relaxed">
                    {form.description || 'Formal inquiry node without meta-description.'}
                  </p>
                </div>

                <div className="flex items-end justify-between uppercase text-[9px] tracking-[0.2em] font-medium">
                  <div className="space-y-1">
                    <div className="opacity-40">Protocol</div>
                    <div>{form.style}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="opacity-40">Established</div>
                    <div>{form.createdAt ? new Date(form.createdAt).toLocaleDateString('en-GB') : 'N/A'}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
