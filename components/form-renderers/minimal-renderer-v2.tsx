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
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalRendererV2Props {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

/**
 * Redesigned Minimal Renderer - Clean, minimalist design with improved typography and spacing
 */
export function MinimalRendererV2({ form, onSubmit }: MinimalRendererV2Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedQuestion, setFocusedQuestion] = useState<string | null>(null);

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

  const renderQuestion = (question: Question, index: number) => {
    const error = errors[question.id];
    const isFocused = focusedQuestion === question.id;

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } },
    };

    return (
      <motion.div
        key={question.id}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <div>
          <Label htmlFor={question.id} className="text-sm font-medium">
            {question.title}
            {question.required && <span className="ml-1 text-destructive">*</span>}
          </Label>
          {question.description && (
            <p className="text-xs text-muted-foreground mt-1">{question.description}</p>
          )}
        </div>

        {question.type === 'short_text' && (
          <Input
            id={question.id}
            placeholder={question.placeholder || 'Enter your answer'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            onFocus={() => setFocusedQuestion(question.id)}
            onBlur={() => setFocusedQuestion(null)}
            className={cn(
              'h-10 border-b-2 border-muted rounded-none px-0 bg-transparent',
              isFocused ? 'border-primary' : '',
              error ? 'border-destructive' : ''
            )}
          />
        )}

        {question.type === 'email' && (
          <Input
            id={question.id}
            type="email"
            placeholder={question.placeholder || 'your@email.com'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            onFocus={() => setFocusedQuestion(question.id)}
            onBlur={() => setFocusedQuestion(null)}
            className={cn(
              'h-10 border-b-2 border-muted rounded-none px-0 bg-transparent',
              isFocused ? 'border-primary' : '',
              error ? 'border-destructive' : ''
            )}
          />
        )}

        {question.type === 'number' && (
          <Input
            id={question.id}
            type="number"
            placeholder={question.placeholder || 'Enter a number'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            onFocus={() => setFocusedQuestion(question.id)}
            onBlur={() => setFocusedQuestion(null)}
            className={cn(
              'h-10 border-b-2 border-muted rounded-none px-0 bg-transparent',
              isFocused ? 'border-primary' : '',
              error ? 'border-destructive' : ''
            )}
          />
        )}

        {question.type === 'long_text' && (
          <Textarea
            id={question.id}
            placeholder={question.placeholder || 'Enter your answer'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            onFocus={() => setFocusedQuestion(question.id)}
            onBlur={() => setFocusedQuestion(null)}
            rows={3}
            className={cn(
              'border rounded-lg resize-none',
              error ? 'border-destructive' : 'border-muted',
              isFocused ? 'ring-1 ring-primary' : ''
            )}
          />
        )}

        {question.type === 'multiple_choice' && (
          <RadioGroup
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
          >
            {question.options?.map((option) => (
              <motion.div
                key={option.id}
                className="flex items-center space-x-3 py-2"
                whileHover={{ x: 4 }}
              >
                <RadioGroupItem value={option.id} id={option.id} className="w-4 h-4" />
                <Label htmlFor={option.id} className="cursor-pointer text-sm font-normal">
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        )}

        {question.type === 'checkboxes' && (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <motion.div
                key={option.id}
                className="flex items-center space-x-3"
                whileHover={{ x: 4 }}
              >
                <Checkbox
                  id={option.id}
                  checked={(
                    (answers[question.id] as string[])?.includes(option.id) || false
                  )}
                  onCheckedChange={(checked) => {
                    const current = (answers[question.id] as string[]) || [];
                    updateAnswer(
                      question.id,
                      checked
                        ? [...current, option.id]
                        : current.filter((id) => id !== option.id)
                    );
                  }}
                  className="w-4 h-4"
                />
                <Label htmlFor={option.id} className="cursor-pointer text-sm font-normal">
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </div>
        )}

        {question.type === 'dropdown' && (
          <Select value={(answers[question.id] as string) || ''} onValueChange={(value) => updateAnswer(question.id, value)}>
            <SelectTrigger className={cn(
              'h-10 border-b-2 border-muted rounded-none',
              error ? 'border-destructive' : ''
            )}>
              <SelectValue placeholder={question.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{form.title}</h1>
          {form.description && (
            <p className="text-base text-muted-foreground">{form.description}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {form.questions.map((question, index) => renderQuestion(question, index))}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              style={{
                backgroundColor: form.primaryColor || '#3b82f6',
              }}
            >
              {form.buttonText || 'Submit'}
            </Button>
          </motion.div>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Powered by Formora
        </motion.p>
      </motion.div>
    </div>
  );
}

export default MinimalRendererV2;
