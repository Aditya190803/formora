'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Form } from '@/lib/types';
import { formsService } from '@/lib/appwrite';
import { ClassicRenderer } from '@/components/form-renderers/classic-renderer';
import { ConversationalRenderer } from '@/components/form-renderers/conversational-renderer';
import { MarketingRenderer } from '@/components/form-renderers/marketing-renderer';
import { NeoBrutalismRenderer } from '@/components/form-renderers/neo-brutalism-renderer';
import { MinimalRenderer } from '@/components/form-renderers/minimal-renderer';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        // Try fetching by ID first, then by slug
        let data = await formsService.getById(formId);
        if (!data) {
          data = await formsService.getBySlug(formId);
        }

        if (!data || !data.isPublished) {
          setForm(null);
        } else {
          setForm(data);
          
          // Check localStorage for 1-response limit
          if (data.limitOneResponse) {
            const hasSubmitted = localStorage.getItem(`form_submitted_${data.$id}`);
            if (hasSubmitted) {
              setAlreadySubmitted(true);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch form:', error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (answers: Record<string, string | string[]>) => {
    try {
      if (form?.limitOneResponse) {
        const localSubmission = localStorage.getItem(`form_submitted_${form.$id}`);
        if (localSubmission) {
          setAlreadySubmitted(true);
          toast.error('You have already submitted a response to this form.');
          return;
        }
      }

      const response = await fetch('/api/forms/responses/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form?.$id,
          answers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 403 && form?.limitOneResponse) {
          localStorage.setItem(`form_submitted_${form.$id}`, 'true');
          setAlreadySubmitted(true);
          toast.error(result.error || 'You have already submitted a response to this form.');
          return;
        }
        throw new Error(result.error || 'Failed to submit response');
      }

      if (form?.limitOneResponse) {
        localStorage.setItem(`form_submitted_${form.$id}`, 'true');
      }

      setSubmitted(true);
      toast.success('Response submitted successfully!');
    } catch (error) {
      console.error('Failed to submit response:', error);
      const message = error instanceof Error ? error.message : 'Failed to submit response. Please try again.';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground">This form doesn&apos;t exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8 max-w-md border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black uppercase italic mb-4">Already Submitted</h1>
          <p className="text-muted-foreground font-bold uppercase">You have already submitted a response to this form.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Thank You!</h1>
          <p className="text-muted-foreground text-lg">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  switch (form.style) {
    case 'classic':
      return <ClassicRenderer form={form} onSubmit={handleSubmit} />;
    case 'conversational':
      return <ConversationalRenderer form={form} onSubmit={handleSubmit} />;
    case 'marketing':
      return <MarketingRenderer form={form} onSubmit={handleSubmit} />;
    case 'neo_brutalism':
      return <NeoBrutalismRenderer form={form} onSubmit={handleSubmit} />;
    case 'minimal':
      return <MinimalRenderer form={form} onSubmit={handleSubmit} />;
    default:
      return <ClassicRenderer form={form} onSubmit={handleSubmit} />;
  }
}
