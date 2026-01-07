/**
 * Form Analytics Page
 * /dashboard/forms/[formId]/analytics
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FormAnalyticsDashboard } from '@/components/form-analytics-dashboard';
import { FormAnalytics } from '@/lib/types-extended';

export default function FormAnalyticsPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/forms/${formId}/analytics`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [formId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] font-body">
        <div className="flex flex-col items-center gap-8">
          <Loader2 className="w-8 h-8 animate-spin opacity-20" />
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Decrypting Narrative Data</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-12 font-body text-center border border-muted border-dashed py-32">
        <h1 className="text-4xl font-heading italic opacity-20 mb-4">No Resonance Detected</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40">
          The narrative has not yet been inhabited by users.
        </p>
      </div>
    );
  }

  return (
    <div className="p-12 font-body space-y-16">
      <div className="space-y-4 pb-12 border-b border-muted">
        <h1 className="text-6xl font-heading tracking-tighter italic">Insights</h1>
        <div className="flex items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">
            Form Node ID: {formId} 
          </p>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </div>
      </div>

      <FormAnalyticsDashboard formId={formId} analytics={analytics} />
    </div>
  );
}
