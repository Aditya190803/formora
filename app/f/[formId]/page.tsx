'use client';

import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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
          // Redirect to slug URL if form has slug but was accessed by ID
          if (data.slug && formId !== data.slug && formId === data.$id) {
            router.replace(`/f/${data.slug}`);
            return;
          }
          
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
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <div className="flex flex-col items-center gap-8">
          <div className="w-12 h-12 border border-muted flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin opacity-40" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-30">Loading Narrative</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <div className="text-center max-w-lg px-6">
          <div className="w-16 h-16 border border-muted flex items-center justify-center mx-auto mb-8">
            <span className="text-2xl opacity-20">?</span>
          </div>
          <h1 className="text-4xl font-heading italic tracking-tight mb-4">Narrative Not Found</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-40">
            This form does not exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <div className="text-center max-w-lg px-6">
          <div className="w-16 h-16 border border-muted flex items-center justify-center mx-auto mb-8">
            <svg className="w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-heading italic tracking-tight mb-4">Already Submitted</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-40">
            You have already submitted a response to this narrative.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <div className="text-center max-w-lg px-6">
          <div className="w-20 h-20 border border-accent/40 flex items-center justify-center mx-auto mb-10">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-heading italic tracking-tight mb-4">Thank You</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-40 mb-12">
            Your response has been recorded successfully.
          </p>
          <div className="w-24 h-px bg-muted mx-auto" />
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
