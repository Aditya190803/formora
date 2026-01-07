'use client';

import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Question, Form } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface MarketingRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export function MarketingRenderer({ form, onSubmit }: MarketingRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
      "w-full text-2xl md:text-5xl bg-transparent border-0 border-b-2 border-muted py-8 focus:outline-none transition-all duration-700 placeholder:text-muted-foreground/20",
      "font-heading tracking-tight",
      error ? 'border-danger/50' : 'focus:border-accent'
    );

    switch (question.type) {
      case 'short_text':
      case 'email':
        return (
          <input
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder={question.placeholder || 'Your response...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={{ color: textColor }}
          />
        );

      case 'multiple_choice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-12">
            {question.options?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateAnswer(question.id, option.label)}
                className={cn(
                  "text-left p-8 md:p-12 border-2 transition-all duration-500 group relative overflow-hidden",
                  answers[question.id] === option.label
                    ? "border-accent bg-accent/5"
                    : "border-muted hover:border-ink/20"
                )}
                style={{ color: textColor }}
              >
                <span className="relative z-10 text-xl md:text-3xl font-heading tracking-tight">
                  {option.label}
                </span>
                {answers[question.id] === option.label && (
                  <motion.div 
                    layoutId={`active-opt-${question.id}`}
                    className="absolute inset-0 bg-accent/5 z-0"
                  />
                )}
              </button>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            placeholder={question.placeholder || 'Your response...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={{ color: textColor }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-accent/30" style={{ backgroundColor, color: textColor }}>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-2 bg-accent origin-left z-50 shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]"
        style={{ scaleX }}
      />
      
      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl mx-auto w-full"
          >
            <h1 className="text-7xl md:text-[12rem] font-display font-medium leading-[0.85] tracking-tight mb-20">
              {form.title.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-4 md:mr-8 italic">
                  {word}
                </span>
              ))}
            </h1>
            {form.description && (
              <p className="text-2xl md:text-4xl font-heading max-w-3xl opacity-60 leading-tight">
                {form.description}
              </p>
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
          >
            <span className="font-body text-xs uppercase tracking-[0.4em]">Scroll to begin</span>
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </motion.div>
        </section>

        <form onSubmit={handleSubmit} className="relative z-10">
          {form.questions.map((question, index) => (
            <section key={question.id} className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-40 border-t border-muted">
              <div className="max-w-6xl mx-auto w-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-20%" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <label className="text-4xl md:text-7xl font-display font-normal leading-tight mb-16 block">
                    {question.title}
                  </label>
                  {question.description && (
                    <p className="text-xl md:text-2xl font-body max-w-2xl opacity-40 mb-12">
                      {question.description}
                    </p>
                  )}
                  <div className="relative">
                    {renderQuestion(question)}
                  </div>
                </motion.div>
              </div>
            </section>
          ))}

          <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 py-40 bg-ink text-bg">
            <div className="max-w-6xl mx-auto w-full text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-5xl md:text-9xl font-display font-medium leading-[0.9] tracking-tighter mb-20 italic">
                  Ready to proceed?
                </h2>
                <button
                  type="submit"
                  className="inline-flex items-center gap-8 group"
                >
                  <span className="text-4xl md:text-7xl font-heading border-b-4 border-accent pb-4 hover:pr-8 transition-all duration-700">
                    {form.buttonText || 'Securely Submit'}
                  </span>
                  <ArrowRight className="w-12 h-12 md:w-20 md:h-20 text-accent group-hover:translate-x-4 transition-transform duration-700" />
                </button>
              </motion.div>
            </div>
          </section>
        </form>

        <footer className="py-20 px-6 md:px-20 flex justify-between items-end opacity-20 font-body text-[10px] uppercase tracking-[0.5em]">
          <div>Formora © 2026</div>
          <div className="text-right italic font-display lowercase normal-case text-xl opacity-100">Narrative over Noise.</div>
        </footer>
      </div>
    </div>
  );
}
