'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Form } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

interface ConversationalRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

export function ConversationalRenderer({ form, onSubmit }: ConversationalRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [history, setHistory] = useState<Question[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const primaryColor = form.primaryColor || 'var(--accent)';
  const backgroundColor = form.backgroundColor || 'var(--bg)';
  const textColor = form.textColor || 'var(--ink)';

  const currentQuestion = form.questions[currentIndex];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, history]);

  const handleNext = () => {
    if (currentIndex < form.questions.length - 1) {
      setHistory([...history, form.questions[currentIndex]]);
      setCurrentIndex(currentIndex + 1);
    } else {
      onSubmit(answers);
    }
  };

  const updateAnswer = (value: string | string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (answers[currentQuestion.id]) {
        handleNext();
      }
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col font-body selection:bg-accent/20" style={{ backgroundColor, color: textColor }}>
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 md:px-20 pt-40 pb-60"
      >
        <div className="max-w-3xl mx-auto space-y-24">
          {/* History */}
          <AnimatePresence mode="popLayout">
            {history.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.3, y: 0 }}
                className="space-y-4"
              >
                <p className="text-xl md:text-2xl font-medium opacity-60">{q.title}</p>
                <p className="text-2xl md:text-4xl font-display italic">
                  {Array.isArray(answers[q.id]) 
                    ? (answers[q.id] as string[]).join(', ') 
                    : answers[q.id] || '—'}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Current Question */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] opacity-40">Question {currentIndex + 1}</span>
              <h2 className="text-4xl md:text-6xl font-display font-normal leading-[1.1]">
                {currentQuestion.title}
              </h2>
              {currentQuestion.description && (
                <p className="text-xl opacity-40">{currentQuestion.description}</p>
              )}
            </div>

            <div className="relative group">
              <input
                autoFocus
                type="text"
                placeholder="Type your answer here..."
                value={(answers[currentQuestion.id] as string) || ''}
                onChange={(e) => updateAnswer(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent text-3xl md:text-5xl font-heading border-0 p-0 focus:outline-none placeholder:opacity-10 caret-accent"
              />
              
              <div className="mt-12 flex items-center gap-6">
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className={cn(
                    "px-8 py-4 rounded-full font-heading text-lg transition-all duration-500 flex items-center gap-3",
                    answers[currentQuestion.id] 
                      ? "bg-ink text-bg opacity-100" 
                      : "bg-muted text-ink/20 opacity-50 cursor-not-allowed"
                  )}
                >
                  {currentIndex === form.questions.length - 1 ? 'Finish' : 'Continue'}
                  <CornerDownLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] uppercase tracking-widest opacity-30 hidden md:block">
                  Press Enter ↵
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Persistence Controls */}
      <div className="fixed bottom-12 right-12 flex flex-col gap-2">
        <button 
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          className="w-12 h-12 rounded-full border border-muted flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button 
          onClick={() => answers[currentQuestion.id] && handleNext()}
          className="w-12 h-12 rounded-full border border-muted flex items-center justify-center hover:bg-muted transition-colors text-accent"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Cursor Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-accent/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
