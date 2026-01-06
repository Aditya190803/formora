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
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NeoBrutalismRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

const fonts = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  heading: 'font-black tracking-tighter uppercase italic',
};

export function NeoBrutalismRenderer({ form, onSubmit }: NeoBrutalismRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fontClass = fonts[form.fontFamily as keyof typeof fonts] || fonts.sans;
  const primaryColor = form.primaryColor || '#000000';
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

    setSubmitted(true);
    onSubmit(answers);
  };

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];

    const inputClasses = cn(
      "h-14 text-lg border-4 border-foreground bg-card font-bold uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      error ? 'border-destructive' : ''
    );

    switch (question.type) {
      case 'short_text':
      case 'email':
        return (
          <Input
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder={question.placeholder || 'ENTER YOUR ANSWER...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
          />
        );

      case 'long_text':
        return (
          <Textarea
            placeholder={question.placeholder || 'ENTER YOUR ANSWER...'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows={4}
            className={cn(
              "text-lg border-4 border-foreground bg-card font-bold uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
              error ? 'border-destructive' : ''
            )}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder="0"
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
            className="space-y-4"
          >
            {question.options?.map((option) => (
              <div 
                key={option.id} 
                className={cn(
                  "flex items-center space-x-3 p-4 border-4 border-foreground transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer",
                  answers[question.id] === option.id ? "bg-primary text-white" : "bg-card"
                )}
                style={{ 
                  backgroundColor: answers[question.id] === option.id ? (form.primaryColor || undefined) : undefined 
                }}
                onClick={() => updateAnswer(question.id, option.id)}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id}
                  className="sr-only"
                />
                <Label 
                  htmlFor={option.id} 
                  className="font-black uppercase italic text-lg cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
                {answers[question.id] === option.id && <Check className="w-6 h-6 stroke-[4]" />}
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkboxes':
        const selectedOptions = (answers[question.id] as string[]) || [];
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <div 
                key={option.id} 
                className={cn(
                  "flex items-center space-x-3 p-4 border-4 border-foreground transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer",
                  selectedOptions.includes(option.id) ? "bg-primary text-white" : "bg-card"
                )}
                style={{ 
                  backgroundColor: selectedOptions.includes(option.id) ? (form.primaryColor || undefined) : undefined 
                }}
                onClick={() => {
                  if (selectedOptions.includes(option.id)) {
                    updateAnswer(question.id, selectedOptions.filter(id => id !== option.id));
                  } else {
                    updateAnswer(question.id, [...selectedOptions, option.id]);
                  }
                }}
              >
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  className="sr-only"
                />
                <Label 
                  htmlFor={option.id} 
                  className="font-black uppercase italic text-lg cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
                {selectedOptions.includes(option.id) && <Check className="w-6 h-6 stroke-[4]" />}
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <Select
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
          >
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder="SELECT AN OPTION" />
            </SelectTrigger>
            <SelectContent className="border-4 border-foreground p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.id} className="font-black uppercase italic focus:bg-primary focus:text-white">
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

  if (submitted) {
    return (
      <div 
        className={cn("min-h-screen flex items-center justify-center p-4", fontClass)}
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-12 border-8 border-foreground shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          <div 
            className="w-24 h-24 border-4 border-foreground flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: primaryColor }}
          >
            <Sparkles className="w-12 h-12 text-white stroke-[3]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-6">THANK YOU!</h1>
          <p className="text-xl font-bold uppercase italic opacity-70">
            YOUR RESPONSE HAS BEEN SUBMITTED SUCCESSFULLY.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className={cn("min-h-screen p-4 md:p-12 transition-colors", fontClass)}
      style={{ 
        backgroundColor: backgroundColor, 
        color: textColor,
        backgroundImage: form.backgroundImage ? `url(${form.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-3xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-6 tracking-tighter">
            {form.title}
          </h1>
          {form.description && (
            <div 
              className="inline-block p-4 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              style={{ backgroundColor: 'white', color: 'black' }}
            >
              <p className="text-xl font-black uppercase italic">
                {form.description}
              </p>
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {form.questions.map((question, index) => {
            const error = errors[question.id];
            return (
              <div key={question.id} className="space-y-6">
                <div className="flex items-center gap-4">
                  <span 
                    className="w-12 h-12 border-4 border-foreground text-white flex items-center justify-center font-black italic text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {index + 1}
                  </span>
                  <Label className="text-2xl font-black uppercase italic flex items-center gap-2" style={{ color: textColor }}>
                    {question.title}
                    {question.required && <span className="text-destructive">*</span>}
                  </Label>
                </div>
                
                {question.description && (
                  <p className="text-lg font-bold uppercase italic opacity-70 ml-16">
                    {question.description}
                  </p>
                )}

                <div className="ml-16">
                  {renderQuestion(question)}
                  {error && (
                    <p className="mt-4 text-destructive font-black uppercase italic text-sm">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-12 ml-16">
            <Button 
              type="submit" 
              size="lg" 
              className="h-20 px-12 text-2xl border-8 border-foreground text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all font-black uppercase italic group"
              style={{ backgroundColor: primaryColor }}
            >
              {form.buttonText?.toUpperCase() || 'SUBMIT FORM'}
              <ArrowRight className="w-8 h-8 ml-4 stroke-[4] group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </form>

        <footer className="mt-24 text-center">
          <div className="inline-block px-6 py-2 border-4 border-foreground bg-card font-black uppercase italic text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            POWERED BY FORMORA
          </div>
        </footer>
      </div>
    </div>
  );
}
