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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        <p className="text-muted-foreground">
          No analytics data available yet. Start collecting responses to see insights.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Form Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track responses, completion rates, and user behavior
        </p>
      </div>

      <FormAnalyticsDashboard formId={formId} analytics={analytics} />
    </div>
  );
}
