'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Question, Form } from '@/lib/types';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

const fonts = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  heading: 'font-black tracking-tighter uppercase italic',
};

export function MinimalRenderer({ form, onSubmit }: MinimalRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fontClass = fonts[form.fontFamily as keyof typeof fonts] || fonts.sans;
  const primaryColor = form.primaryColor || '#000000';
  const backgroundColor = form.backgroundColor || '#fafafa';
  const textColor = form.textColor || '#1a1a1a';

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
        newErrors[q.id] = 'Required';
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
      "w-full text-xl border-0 border-b border-gray-200 bg-transparent py-4 focus:outline-none transition-all duration-300 placeholder:text-gray-300",
      error ? 'border-red-500' : ''
    );

    switch (question.type) {
      case 'short_text':
      case 'email':
        return (
          <input
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder={question.placeholder || 'Type your answer...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={{ borderColor: error ? undefined : 'rgba(0,0,0,0.1)', color: textColor }}
          />
        );

      case 'long_text':
        return (
          <textarea
            placeholder={question.placeholder || 'Type your answer...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows={1}
            className={cn(inputClasses, "resize-none overflow-hidden")}
            style={{ borderColor: error ? undefined : 'rgba(0,0,0,0.1)', color: textColor }}
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
            style={{ borderColor: error ? undefined : 'rgba(0,0,0,0.1)', color: textColor }}
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3 pt-2">
            {question.options?.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateAnswer(question.id, option.label)}
                className={cn(
                  "w-full text-left px-6 py-4 border-2 transition-all duration-200 rounded-xl",
                  answers[question.id] === option.label
                    ? "border-black bg-black text-white"
                    : "border-gray-100 hover:border-gray-300 text-gray-600"
                )}
                style={answers[question.id] === option.label ? { backgroundColor: primaryColor, borderColor: primaryColor } : { color: textColor }}
              >
                {option.label}
              </button>
            ))}
          </div>
        );

      case 'checkboxes':
        const currentAnswers = (answers[question.id] as string[]) || [];
        return (
          <div className="space-y-3 pt-2">
            {question.options?.map((option) => {
              const isChecked = currentAnswers.includes(option.label);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    const newValue = isChecked
                      ? currentAnswers.filter((a) => a !== option.label)
                      : [...currentAnswers, option.label];
                    updateAnswer(question.id, newValue);
                  }}
                  className={cn(
                    "w-full text-left px-6 py-4 border-2 transition-all duration-200 flex items-center justify-between rounded-xl",
                    isChecked
                      ? "border-black bg-black text-white"
                      : "border-gray-100 hover:border-gray-300 text-gray-600"
                  )}
                  style={isChecked ? { backgroundColor: primaryColor, borderColor: primaryColor } : { color: textColor }}
                >
                  {option.label}
                  {isChecked && <Check className="w-5 h-5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={{ borderColor: error ? undefined : 'rgba(0,0,0,0.1)', color: textColor }}
          >
            <option value="" disabled>{question.placeholder || 'Select an option'}</option>
            {question.options?.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-500", fontClass)} style={{ backgroundColor }}>
      <div className="max-w-3xl mx-auto py-32 px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl font-medium tracking-tight mb-6" style={{ color: textColor }}>{form.title}</h1>
          {form.description && (
            <p className="text-xl mb-24 font-light leading-relaxed max-w-xl opacity-60" style={{ color: textColor }}>{form.description}</p>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-32">
          {form.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="group relative"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-medium tracking-widest uppercase opacity-40" style={{ color: textColor }}>
                    Question {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-[1px] w-8 bg-current opacity-10 group-focus-within:w-12 group-focus-within:opacity-100 transition-all duration-500" style={{ color: primaryColor }} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-3xl font-normal block leading-tight" style={{ color: textColor }}>
                    {question.title}
                    {question.required && <span className="ml-2 text-red-400 text-sm font-light">*</span>}
                  </label>
                  {question.description && (
                    <p className="text-base font-light max-w-lg opacity-50" style={{ color: textColor }}>{question.description}</p>
                  )}
                </div>

                <div className="mt-4 relative">
                  {renderQuestion(question)}
                  {errors[question.id] && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-red-500 mt-4 font-medium uppercase tracking-wider"
                    >
                      {errors[question.id]}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-12"
          >
            <button
              type="submit"
              className="group relative inline-flex items-center gap-4 text-white px-10 py-5 rounded-full text-lg font-medium transition-all duration-300 hover:gap-6 active:scale-95 shadow-xl hover:shadow-2xl"
              style={{ backgroundColor: primaryColor }}
            >
              {form.buttonText || 'Submit Response'}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </form>

        <footer className="mt-48 pt-12 border-t border-current opacity-10 flex justify-between items-center" style={{ color: textColor }}>
          <div className="text-[10px] uppercase tracking-[0.3em] font-medium">
            Powered by <span className="font-bold">Formora</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
