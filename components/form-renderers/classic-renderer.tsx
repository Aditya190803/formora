'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Form } from '@/lib/types';
import { FormWithLogic, ConditionalQuestion } from '@/lib/types-extended';
import { shouldShowQuestion, evaluateCalculations } from '@/lib/services/conditional-logic';
import { cn } from '@/lib/utils';

interface ClassicRendererProps {
  form: Form | FormWithLogic;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export function ClassicRenderer({ form, onSubmit }: ClassicRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const questions = (form as FormWithLogic).questions || form.questions;

  const primaryColor = form.primaryColor || 'var(--accent)';
  const backgroundColor = form.backgroundColor || 'var(--bg)';
  const textColor = form.textColor || 'var(--ink)';

  useEffect(() => {
    if ((form as FormWithLogic).calculations) {
      const calculatedResults = evaluateCalculations((form as FormWithLogic).calculations!, answers);
      let changed = false;
      const updatedAnswers = { ...answers };
      for (const [qId, value] of Object.entries(calculatedResults)) {
        if (answers[qId] !== String(value)) {
          updatedAnswers[qId] = String(value);
          changed = true;
        }
      }
      if (changed) setAnswers(updatedAnswers);
    }
  }, [answers, form]);

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    questions.forEach((q) => {
      if (shouldShowQuestion(q as ConditionalQuestion, answers)) {
        if (q.required && !answers[q.id]) {
          newErrors[q.id] = 'Required';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(answers);
  };

  return (
    <div className="min-h-screen bg-bg selection:bg-accent/20 font-body" style={{ backgroundColor, color: textColor }}>
      <div className="max-w-3xl mx-auto py-24 md:py-40 px-6">
        <header className="mb-24 space-y-6">
          <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight leading-[1.1]">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-xl opacity-50 font-body leading-relaxed max-w-2xl">
              {form.description}
            </p>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-20">
          {questions.map((q, i) => {
            if (!shouldShowQuestion(q as ConditionalQuestion, answers)) return null;
            const error = errors[q.id];

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-20 bg-muted px-2 py-0.5 rounded uppercase tracking-tighter">
                      Field {String(i + 1).padStart(2, '0')}
                    </span>
                    <label className="text-xl md:text-2xl font-heading font-normal tracking-tight">
                      {q.title}
                    </label>
                  </div>
                  {q.description && (
                    <p className="text-sm opacity-40 pl-16">{q.description}</p>
                  )}
                </div>

                <div className="pl-16">
                  {q.type === 'long_text' ? (
                    <textarea
                      placeholder={q.placeholder || 'Type here...'}
                      value={(answers[q.id] as string) || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors text-lg font-body min-h-[100px] resize-none"
                    />
                  ) : (
                    <input
                      type={q.type === 'email' ? 'email' : 'text'}
                      placeholder={q.placeholder || 'Type here...'}
                      value={(answers[q.id] as string) || ''}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-muted py-2 focus:outline-none focus:border-accent transition-colors text-lg font-body"
                    />
                  )}
                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-danger uppercase tracking-widest mt-2 font-bold"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}

          <div className="pt-12 pl-16">
            <button
              type="submit"
              className="px-10 py-4 bg-ink text-bg font-heading text-lg rounded-full hover:bg-accent hover:scale-[1.02] transition-all duration-500"
            >
              {form.buttonText || 'Complete Response'}
            </button>
          </div>
        </form>

        <footer className="mt-40 border-t border-muted pt-8 flex justify-between items-center opacity-20 text-[10px] uppercase tracking-[0.4em] font-body">
          <span>Formora / Experience v4.0</span>
          <span>Built for Authored Intent</span>
        </footer>
      </div>
    </div>
  );
}
