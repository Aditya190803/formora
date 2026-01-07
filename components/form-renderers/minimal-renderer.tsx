'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Form } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MinimalRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export function MinimalRenderer({ form, onSubmit }: MinimalRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const primaryColor = form.primaryColor || 'var(--accent)';
  const backgroundColor = form.backgroundColor || 'var(--bg)';
  const textColor = form.textColor || 'var(--ink)';

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    form.questions.forEach((q) => {
      if (q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && (answers[q.id] as string[]).length === 0))) {
        newErrors[q.id] = 'This field is required';
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
      "w-full text-2xl md:text-4xl border-0 border-b border-muted bg-transparent py-4 focus:outline-none transition-all duration-700 placeholder:text-muted-foreground/30",
      "font-body tracking-tight",
      error ? 'border-danger/50' : 'focus:border-ink'
    );

    switch (question.type) {
      case 'short_text':
      case 'email':
        return (
          <input
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder={question.placeholder || 'Type here...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={{ color: textColor }}
          />
        );

      case 'long_text':
        return (
          <textarea
            placeholder={question.placeholder || 'Type here...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows={1}
            className={cn(inputClasses, "resize-none overflow-hidden")}
            style={{ color: textColor }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder="0"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={{ color: textColor }}
          />
        );

      case 'multiple_choice':
        return (
          <div className="flex flex-wrap gap-4 pt-4">
            {question.options?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateAnswer(question.id, option.label)}
                className={cn(
                  "text-lg md:text-xl px-0 py-2 border-0 border-b-2 transition-all duration-500 font-body",
                  answers[question.id] === option.label
                    ? "border-ink opacity-100"
                    : "border-transparent opacity-40 hover:opacity-100"
                )}
                style={{ color: textColor }}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg selection:bg-accent/20" style={{ 
      backgroundColor,
      color: textColor
    }}>
      <div className="max-w-4xl mx-auto pt-40 pb-60 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-40"
        >
          <h1 className="text-5xl md:text-8xl font-display font-normal leading-[0.9] tracking-tight mb-8">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-lg md:text-2xl font-body max-w-2xl opacity-50 leading-relaxed">
              {form.description}
            </p>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-40">
          {form.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="flex flex-col gap-8">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-body text-xs opacity-30 mt-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <label className="text-3xl md:text-5xl font-display font-normal leading-tight">
                      {question.title}
                    </label>
                  </div>
                  {question.description && (
                    <p className="text-base md:text-lg font-body max-w-xl opacity-40 pl-8">
                      {question.description}
                    </p>
                  )}
                </div>

                <div className="pl-8 relative">
                  {renderQuestion(question)}
                  <AnimatePresence>
                    {errors[question.id] && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute -bottom-8 left-8 text-xs text-danger font-body uppercase tracking-widest"
                      >
                        {errors[question.id]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-20 pl-8"
          >
            <button
              type="submit"
              className="text-2xl md:text-4xl font-display group flex items-center gap-4 transition-all duration-500 hover:gap-8"
            >
              <span className="border-b-2 border-ink py-1">
                {form.buttonText || 'Submit response'}
              </span>
              <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500">→</span>
            </button>
          </motion.div>
        </form>

        <footer className="mt-80 opacity-20 font-body text-[10px] uppercase tracking-[0.4em]">
          Formora / Experience-First
        </footer>
      </div>
    </div>
  );
}
