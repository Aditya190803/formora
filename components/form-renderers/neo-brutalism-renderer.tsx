'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question, Form } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NeoBrutalismRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export function NeoBrutalismRenderer({ form, onSubmit }: NeoBrutalismRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const primaryColor = form.primaryColor || 'var(--accent)';
  const backgroundColor = form.backgroundColor || 'var(--bg)';
  const textColor = form.textColor || 'var(--ink)';

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    form.questions.forEach((q) => {
      if (q.required && !answers[q.id]) {
        newErrors[q.id] = 'REQUIRED';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(answers);
  };

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];

    const inputClasses = cn(
      "w-full text-2xl md:text-5xl bg-ink text-bg p-6 md:p-10 border-0 focus:outline-none transition-none",
      "font-heading uppercase tracking-tighter",
      error ? 'bg-danger text-white' : 'focus:bg-accent'
    );

    switch (question.type) {
      case 'short_text':
      case 'email':
        return (
          <input
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder="Type response..."
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
          />
        );

      case 'multiple_choice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {question.options?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateAnswer(question.id, option.label)}
                className={cn(
                  "text-left p-6 md:p-10 text-xl md:text-3xl font-heading uppercase tracking-tighter transition-none",
                  answers[question.id] === option.label
                    ? "bg-accent text-bg"
                    : "bg-muted text-ink hover:bg-ink hover:text-bg"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            placeholder="Type response..."
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
          />
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-accent selection:text-bg" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-40">
        <header className="mb-40 border-b-[20px] border-ink pb-20">
          <h1 className="text-8xl md:text-[15rem] font-display font-medium leading-[0.8] tracking-tighter uppercase">
            {form.title}
          </h1>
          {form.description && (
            <p className="mt-12 text-2xl md:text-5xl font-heading uppercase tracking-tight opacity-100 max-w-4xl">
              {form.description}
            </p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-40">
          {form.questions.map((question, index) => (
            <div key={question.id} className="space-y-12">
              <div className="flex flex-col gap-4">
                <span className="text-xl md:text-2xl font-heading opacity-50">/{String(index + 1).padStart(2, '0')}</span>
                <label className="text-4xl md:text-8xl font-heading font-normal leading-[0.9] tracking-tighter uppercase">
                  {question.title}
                </label>
              </div>
              
              <div className="relative">
                {renderQuestion(question)}
                {errors[question.id] && (
                  <div className="bg-danger text-white inline-block px-4 py-2 mt-4 font-heading text-xl uppercase italic">
                    {errors[question.id]}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="pt-40 border-t-[20px] border-ink">
            <button
              type="submit"
              className="w-full bg-ink text-bg text-6xl md:text-[10rem] font-display uppercase font-medium leading-[0.85] tracking-tighter p-10 md:p-20 hover:bg-accent transition-none group text-left"
            >
              <div className="flex justify-between items-center group-hover:italic">
                <span>{form.buttonText || 'SUBMIT'}</span>
                <span className="hidden md:inline">→</span>
              </div>
            </button>
          </div>
        </form>

        <footer className="mt-40 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 font-heading text-xl uppercase tracking-tighter border-t-2 border-muted pt-10">
          <div>Formora-Brutal-NX</div>
          <div className="opacity-40 italic">Intent is not negotiable.</div>
        </footer>
      </div>
    </div>
  );
}
