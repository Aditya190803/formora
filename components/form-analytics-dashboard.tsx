'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FormAnalytics } from '@/lib/types-extended';
import { Eye, CheckCircle2, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface FormAnalyticsDashboardProps {
  formId: string;
  analytics: FormAnalytics;
}

export function FormAnalyticsDashboard({ analytics }: FormAnalyticsDashboardProps) {
  const stats = [
    { label: 'Views', value: analytics.totalViews, icon: Eye },
    { label: 'Submissions', value: analytics.totalSubmissions, icon: CheckCircle2 },
    { label: 'Efficiency', value: `${analytics.completionRate}%`, icon: TrendingUp },
    { label: 'Tempo', value: `${Math.floor(analytics.averageTimeToComplete / 60)}m`, icon: Clock },
  ];

  return (
    <div className="space-y-20 font-body p-6 md:p-12">
      {/* Stats Summary - Industrial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-muted divide-y md:divide-y-0 md:divide-x divide-muted">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-8 space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Narrative Funnel</h3>
            <p className="text-xl font-heading">Drop-off tracking by question</p>
          </div>
          <div className="h-[300px] w-full border-b border-muted">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.questionsAnalytics}>
                <XAxis 
                  dataKey="questionTitle" 
                  hide
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'var(--bg)', border: '1px solid var(--muted)', borderRadius: '0', fontFamily: 'var(--font-heading)' }}
                />
                <Bar dataKey="totalAnswers" fill="var(--ink)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="dropOffCount" fill="var(--danger)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-8 space-y-2">
            <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Environment</h3>
            <p className="text-xl font-heading">Device distribution</p>
          </div>
          <div className="space-y-8">
            {analytics.deviceBreakdown && Object.entries(analytics.deviceBreakdown).map(([device, value], i) => {
              const total = Object.values(analytics.deviceBreakdown!).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (value / total * 100).toFixed(1) : 0;
              return (
                <div key={device} className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-medium">
                    <span>{device}</span>
                    <span className="opacity-40">{percentage}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-muted">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      className="h-full bg-ink"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {analytics.dropOffRate > 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-danger p-8 flex items-start gap-6 bg-danger/5"
        >
          <AlertCircle className="w-6 h-6 text-danger" />
          <div className="space-y-2">
            <h3 className="text-xl font-heading uppercase italic tracking-tighter text-danger">Friction Detected</h3>
            <p className="text-sm opacity-60">
              {analytics.dropOffRate}% of narratives are abandoned. The current interaction flow suggests high resistance. 
              Improve the tempo or simplify the inquiry.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
