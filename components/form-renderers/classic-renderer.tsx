'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Question, Form } from '@/lib/types';
import { FormWithLogic, ConditionalQuestion } from '@/lib/types-extended';
import { shouldShowQuestion, evaluateCalculations } from '@/lib/services/conditional-logic';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface ClassicRendererProps {
  form: Form | FormWithLogic;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

const fonts = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  heading: 'font-black tracking-tighter uppercase italic',
};

export function ClassicRenderer({ form, onSubmit }: ClassicRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const questions = (form as FormWithLogic).questions || form.questions;

  // Handle calculations
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

      if (changed) {
        setAnswers(updatedAnswers);
      }
    }
  }, [answers, form]);

  const fontClass = fonts[form.fontFamily as keyof typeof fonts] || fonts.sans;
  const primaryColor = form.primaryColor || '#3b82f6';
  const backgroundColor = form.backgroundColor || '#ffffff';
  const textColor = form.textColor || '#000000';

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    questions.forEach((q) => {
      // Only validate visible questions
      if (shouldShowQuestion(q as ConditionalQuestion, answers)) {
        if (q.required && !answers[q.id]) {
          newErrors[q.id] = 'This field is required';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(answers);
  };

  const renderQuestion = (question: Question, index: number) => {
    const error = errors[question.id];

    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="space-y-2"
      >
        <Label htmlFor={question.id} className="flex items-center gap-1" style={{ color: textColor }}>
          {question.title}
          {question.required && <span className="text-destructive">*</span>}
        </Label>
        {question.description && (
          <p className="text-sm opacity-70" style={{ color: textColor }}>{question.description}</p>
        )}

        {question.type === 'short_text' && (
          <Input
            id={question.id}
            placeholder="Your answer"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={error ? 'border-destructive' : ''}
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: textColor, borderColor: error ? undefined : 'rgba(0,0,0,0.1)' }}
          />
        )}

        {question.type === 'long_text' && (
          <Textarea
            id={question.id}
            placeholder="Your answer"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows={4}
            className={error ? 'border-destructive' : ''}
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: textColor, borderColor: error ? undefined : 'rgba(0,0,0,0.1)' }}
          />
        )}

        {question.type === 'email' && (
          <Input
            id={question.id}
            type="email"
            placeholder="email@example.com"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={error ? 'border-destructive' : ''}
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: textColor, borderColor: error ? undefined : 'rgba(0,0,0,0.1)' }}
          />
        )}

        {question.type === 'number' && (
          <Input
            id={question.id}
            type="number"
            placeholder="0"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={error ? 'border-destructive' : ''}
            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: textColor, borderColor: error ? undefined : 'rgba(0,0,0,0.1)' }}
          />
        )}

        {question.type === 'multiple_choice' && question.options && (
          <RadioGroup
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
          >
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'checkboxes' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => {
              const selectedOptions = (answers[question.id] as string[]) || [];
              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateAnswer(question.id, [...selectedOptions, option.id]);
                      } else {
                        updateAnswer(question.id, selectedOptions.filter(id => id !== option.id));
                      }
                    }}
                  />
                  <Label htmlFor={option.id} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'dropdown' && question.options && (
          <Select
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
          >
            <SelectTrigger className={error ? 'border-destructive' : ''} style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: textColor, borderColor: error ? undefined : 'rgba(0,0,0,0.1)' }}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </motion.div>
    );
  };

  return (
    <div className={cn("min-h-screen py-8 px-4", fontClass)} style={{ backgroundColor, color: textColor }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: textColor }}>{form.title}</h1>
          {form.description && (
            <p className="mt-2 opacity-70" style={{ color: textColor }}>{form.description}</p>
          )}
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions
            .filter(q => shouldShowQuestion(q as ConditionalQuestion, answers))
            .map((question, index) => renderQuestion(question, index))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: questions.length * 0.05 + 0.1 }}
          >
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto"
              style={{ backgroundColor: primaryColor }}
            >
              {form.buttonText || 'Submit'}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
