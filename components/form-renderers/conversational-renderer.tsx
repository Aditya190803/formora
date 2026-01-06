'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Form, Question } from '@/lib/types';
import { FormWithLogic, ConditionalQuestion } from '@/lib/types-extended';
import { evaluateLogicJumps, evaluateCalculations, shouldShowQuestion } from '@/lib/services/conditional-logic';
import { ArrowLeft, ArrowRight, Check, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationalRendererProps {
  form: Form | FormWithLogic;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

const fonts = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  heading: 'font-black tracking-tighter uppercase italic',
};

export function ConversationalRenderer({ form, onSubmit }: ConversationalRendererProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [history, setHistory] = useState<number[]>([]); // To track the path taken for "back" button
  const [error, setError] = useState('');

  const questions = (form as FormWithLogic).questions || form.questions;
  const currentQuestion = questions[currentIndex] as ConditionalQuestion;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;

  const fontClass = fonts[form.fontFamily as keyof typeof fonts] || fonts.sans;
  const speed = form.animationSpeed || 0.4;
  const primaryColor = form.primaryColor || '#3b82f6';
  const backgroundColor = form.backgroundColor || '#ffffff';
  const textColor = form.textColor || '#000000';

  // Handle calculations
  useEffect(() => {
    if ((form as FormWithLogic).calculations) {
      const calculatedResults = evaluateCalculations((form as FormWithLogic).calculations!, answers);
      
      // Check if anything actually changed to avoid infinite loop
      let changed = false;
      const updatedAnswers = { ...answers };
      
      for (const [qId, value] of Object.entries(calculatedResults)) {
        if (answers[qId] !== value) {
          updatedAnswers[qId] = String(value);
          changed = true;
        }
      }

      if (changed) {
        setAnswers(updatedAnswers);
      }
    }
  }, [answers, form]);

  const updateAnswer = (value: string | string[]) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    setError('');
  };

  const goNext = useCallback(() => {
    // Validation
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setError('This field is required');
      return;
    }

    if (isLastQuestion) {
      onSubmit(answers);
      return;
    }

    // Logic Jumps
    const jumpResult = evaluateLogicJumps(currentQuestion, answers);
    
    setHistory(prev => [...prev, currentIndex]);

    if (jumpResult === 'end') {
      onSubmit(answers);
    } else if (jumpResult) {
      const nextIdx = questions.findIndex(q => q.id === jumpResult);
      if (nextIdx !== -1) {
        setCurrentIndex(nextIdx);
      } else {
        // Fallback to next if jump ID not found
        setCurrentIndex(currentIndex + 1);
      }
    } else {
      // Normal next, but skip hidden questions
      let nextIdx = currentIndex + 1;
      while (nextIdx < questions.length) {
        if (shouldShowQuestion(questions[nextIdx] as ConditionalQuestion, answers)) {
          setCurrentIndex(nextIdx);
          return;
        }
        nextIdx++;
      }
      
      // If no more visible questions, submit
      onSubmit(answers);
    }
  }, [currentQuestion, currentIndex, isLastQuestion, answers, onSubmit, questions]);

  const goPrev = () => {
    if (history.length > 0) {
      const prevIdx = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentIndex(prevIdx);
      setError('');
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setError('');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext]);

  const renderQuestionInput = () => {
    const value = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'short_text':
      case 'email':
        return (
          <Input
            type={currentQuestion.type === 'email' ? 'email' : 'text'}
            placeholder={currentQuestion.type === 'email' ? 'email@example.com' : 'Type your answer...'}
            value={(value as string) || ''}
            onChange={(e) => updateAnswer(e.target.value)}
            className={cn("text-2xl h-16 border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0", fontClass)}
            style={{ borderColor: primaryColor, color: textColor }}
            autoFocus
          />
        );

      case 'long_text':
        return (
          <Textarea
            placeholder="Type your answer..."
            value={(value as string) || ''}
            onChange={(e) => updateAnswer(e.target.value)}
            rows={4}
            className={cn("text-2xl border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 resize-none", fontClass)}
            style={{ borderColor: primaryColor, color: textColor }}
            autoFocus
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="0"
            value={(value as string) || ''}
            onChange={(e) => updateAnswer(e.target.value)}
            className="text-lg h-14 border-0 border-b-2 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
            autoFocus
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, idx) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                type="button"
                onClick={() => updateAnswer(option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  value === option.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-lg">{option.label}</span>
                {value === option.id && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </motion.button>
            ))}
          </div>
        );

      case 'checkboxes':
        const selectedOptions = (value as string[]) || [];
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, idx) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                type="button"
                onClick={() => {
                  if (selectedOptions.includes(option.id)) {
                    updateAnswer(selectedOptions.filter(id => id !== option.id));
                  } else {
                    updateAnswer([...selectedOptions, option.id]);
                  }
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  selectedOptions.includes(option.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Checkbox checked={selectedOptions.includes(option.id)} />
                <span className="text-lg">{option.label}</span>
              </motion.button>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, idx) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                type="button"
                onClick={() => updateAnswer(option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  value === option.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-lg">{option.label}</span>
                {value === option.id && (
                  <Check className="w-5 h-5 text-primary ml-auto" />
                )}
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-500", fontClass)} style={{ 
      backgroundColor,
      backgroundImage: form.backgroundImage ? `url(${form.backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Progress value={progress} className="h-2 rounded-none bg-black/5" style={{ color: primaryColor }} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: speed }}
              className="space-y-8"
            >
              {/* Question Number */}
              <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest" style={{ color: textColor, opacity: 0.5 }}>
                <span>{currentIndex + 1}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{form.questions.length}</span>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black leading-tight italic uppercase" style={{ color: textColor }}>
                  {currentQuestion.title}
                  {currentQuestion.required && (
                    <span className="ml-1" style={{ color: primaryColor }}>*</span>
                  )}
                </h2>
                {currentQuestion.description && (
                  <p className="text-xl font-bold uppercase" style={{ color: textColor, opacity: 0.7 }}>
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              {/* Input */}
              <div className="space-y-6">
                {renderQuestionInput()}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive font-black uppercase italic"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-6 pt-4">
                <Button 
                  onClick={goNext} 
                  size="lg" 
                  className="h-16 px-10 text-xl font-black uppercase italic transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-[-2px] hover:translate-y-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isLastQuestion ? (form.buttonText || 'Submit') : 'OK'}
                  <Check className="w-6 h-6 ml-2 stroke-[3]" />
                </Button>
                <div className="hidden sm:flex items-center gap-3 text-sm font-black uppercase tracking-widest" style={{ color: textColor, opacity: 0.5 }}>
                  <span>press</span>
                  <div className="flex items-center gap-1 border-2 border-current rounded px-2 py-1">
                    <span className="text-xs">Enter</span>
                    <CornerDownLeft className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 right-8 flex gap-2 border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="h-12 w-12 rounded-none border-r-2 border-foreground hover:bg-muted"
          style={{ color: textColor }}
        >
          <ArrowLeft className="w-5 h-5 stroke-[3]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          className="h-12 w-12 rounded-none hover:bg-muted"
          style={{ color: primaryColor }}
        >
          <ArrowRight className="w-5 h-5 stroke-[3]" />
        </Button>
      </div>
    </div>
  );
}
