'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketingRendererV2Props {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

/**
 * Redesigned Marketing Renderer - Hero section, large typography, improved CTAs
 */
export function MarketingRendererV2({ form, onSubmit }: MarketingRendererV2Props) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const updateAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const handleNext = () => {
    const question = form.questions[currentQuestion];
    if (question.required && !answers[question.id]) {
      setErrors({ ...errors, [question.id]: 'This field is required' });
      return;
    }

    if (currentQuestion < form.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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

  const question = form.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / form.questions.length) * 100;

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'short_text':
        return (
          <Input
            id={question.id}
            placeholder={question.placeholder || 'Your answer'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className="h-14 text-lg border-2 rounded-lg"
          />
        );

      case 'email':
        return (
          <Input
            id={question.id}
            type="email"
            placeholder={question.placeholder || 'your@email.com'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className="h-14 text-lg border-2 rounded-lg"
          />
        );

      case 'number':
        return (
          <Input
            id={question.id}
            type="number"
            placeholder={question.placeholder || 'Enter a number'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className="h-14 text-lg border-2 rounded-lg"
          />
        );

      case 'long_text':
        return (
          <Textarea
            id={question.id}
            placeholder={question.placeholder || 'Your answer'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows={4}
            className="border-2 rounded-lg text-base resize-none"
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option) => (
              <motion.label
                key={option.id}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  (answers[question.id] as string) === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground'
                )}
              >
                <RadioGroupItem value={option.id} id={option.id} className="w-5 h-5" />
                <span className="text-base font-medium">{option.label}</span>
              </motion.label>
            ))}
          </RadioGroup>
        );

      case 'checkboxes':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <motion.label
                key={option.id}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  'flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
                  ((answers[question.id] as string[])?.includes(option.id) || false)
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground'
                )}
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
                  className="w-5 h-5"
                />
                <span className="text-base font-medium">{option.label}</span>
              </motion.label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select value={(answers[question.id] as string) || ''} onValueChange={(value) => updateAnswer(question.id, value)}>
            <SelectTrigger className="h-14 text-lg border-2 rounded-lg">
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-primary/5">
      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-foreground">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-xl text-muted-foreground mb-8">
              {form.description}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Scroll to form
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
            style={{ backgroundColor: form.primaryColor || '#3b82f6' }}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto bg-background rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Progress Bar */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between text-sm text-muted-foreground mb-3">
              <span>
                Question {currentQuestion + 1} of {form.questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                style={{ backgroundColor: form.primaryColor || '#3b82f6' }}
              />
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question */}
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
                {question.description && (
                  <p className="text-muted-foreground">{question.description}</p>
                )}
              </div>

              {renderQuestion(question)}

              {errors[question.id] && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive font-medium"
                >
                  {errors[question.id]}
                </motion.p>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentQuestion > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-12"
                >
                  Back
                </Button>
              )}

              {currentQuestion < form.questions.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 h-12 text-base font-semibold"
                  style={{
                    backgroundColor: form.primaryColor || '#3b82f6',
                  }}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-12 text-base font-semibold"
                  style={{
                    backgroundColor: form.primaryColor || '#3b82f6',
                  }}
                >
                  Submit
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8 text-muted-foreground"
      >
        <p>Powered by Formora</p>
      </motion.footer>
    </div>
  );
}

export default MarketingRendererV2;
