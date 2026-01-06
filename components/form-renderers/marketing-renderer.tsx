'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { ArrowRight, Sparkles, Check, ShieldCheck, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketingRendererProps {
  form: Form;
  onSubmit: (answers: Record<string, string | string[]>) => void;
}

const fonts = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  heading: 'font-black tracking-tighter uppercase italic',
};

export function MarketingRenderer({ form, onSubmit }: MarketingRendererProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fontClass = fonts[form.fontFamily as keyof typeof fonts] || fonts.sans;
  const primaryColor = form.primaryColor || '#3b82f6';
  const backgroundColor = form.backgroundColor || '#ffffff';
  const textColor = form.textColor || '#0f172a';

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
      const firstError = document.getElementById(Object.keys(newErrors)[0]);
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitted(true);
    onSubmit(answers);
  };

  const renderQuestion = (question: Question) => {
    const error = errors[question.id];

    const inputClasses = cn(
      "h-16 text-xl bg-white border-2 border-slate-200 placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary rounded-2xl transition-all px-6 font-medium shadow-sm",
      error ? 'border-red-400 bg-red-50' : ''
    );

    const inputStyle = { 
      '--tw-ring-color': primaryColor ? `${primaryColor}1a` : undefined,
      borderColor: error ? undefined : 'rgba(0,0,0,0.1)',
      color: textColor
    } as React.CSSProperties;

    switch (question.type) {
      case 'short_text':
      case 'email':
        return (
          <Input
            type={question.type === 'email' ? 'email' : 'text'}
            placeholder={question.placeholder || 'Your answer'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            className={inputClasses}
            style={inputStyle}
          />
        );

      case 'long_text':
        return (
          <Textarea
            placeholder={question.placeholder || 'Your answer'}
            value={(answers[question.id] as string) || ''}
            onChange={(e) => updateAnswer(question.id, e.target.value)}
            rows={4}
            className={cn(
              "text-xl bg-white border-2 border-slate-200 placeholder:text-slate-300 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary rounded-2xl transition-all p-6 font-medium shadow-sm min-h-[160px]",
              error ? 'border-red-400 bg-red-50' : ''
            )}
            style={inputStyle}
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
            style={inputStyle}
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={(answers[question.id] as string) || ''}
            onValueChange={(value) => updateAnswer(question.id, value)}
            className="grid grid-cols-1 gap-4"
          >
            {question.options?.map((option) => (
              <div 
                key={option.id} 
                className={cn(
                  "flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all cursor-pointer group/opt relative overflow-hidden",
                  answers[question.id] === option.id 
                    ? "shadow-lg shadow-black/5" 
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md"
                )}
                style={{ 
                  borderColor: answers[question.id] === option.id ? primaryColor : undefined,
                  backgroundColor: answers[question.id] === option.id ? `${primaryColor}0d` : undefined,
                  color: textColor,
                }}
                onClick={() => updateAnswer(question.id, option.id)}
              >
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id}
                  className="sr-only"
                />
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                    answers[question.id] === option.id ? "" : "border-slate-200 bg-slate-50 group-hover/opt:border-slate-400"
                  )}
                  style={{ 
                    borderColor: answers[question.id] === option.id ? primaryColor : undefined,
                    backgroundColor: answers[question.id] === option.id ? primaryColor : undefined,
                  }}
                >
                  {answers[question.id] === option.id && <Check className="w-5 h-5 text-white stroke-[4]" />}
                </div>
                <Label 
                  htmlFor={option.id} 
                  className="font-bold text-xl cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkboxes':
        const selectedOptions = (answers[question.id] as string[]) || [];
        return (
          <div className="grid grid-cols-1 gap-4">
            {question.options?.map((option) => (
              <div 
                key={option.id} 
                className={cn(
                  "flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all cursor-pointer group/opt relative overflow-hidden",
                  selectedOptions.includes(option.id)
                    ? "shadow-lg shadow-black/5"
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md"
                )}
                style={{ 
                  borderColor: selectedOptions.includes(option.id) ? primaryColor : undefined,
                  backgroundColor: selectedOptions.includes(option.id) ? `${primaryColor}0d` : undefined,
                  color: textColor,
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
                <div 
                  className={cn(
                    "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0",
                    selectedOptions.includes(option.id) ? "" : "border-slate-200 bg-slate-50 group-hover/opt:border-slate-400"
                  )}
                  style={{ 
                    borderColor: selectedOptions.includes(option.id) ? primaryColor : undefined,
                    backgroundColor: selectedOptions.includes(option.id) ? primaryColor : undefined,
                  }}
                >
                  {selectedOptions.includes(option.id) && <Check className="w-5 h-5 text-white stroke-[4]" />}
                </div>
                <Label 
                  htmlFor={option.id} 
                  className="font-bold text-xl cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
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
            <SelectTrigger className={inputClasses} style={inputStyle}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2">
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.id} className="py-3 font-medium">
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
      <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
        {/* Left Side: Hero (Same as main) */}
        <div className="lg:w-1/2 bg-primary p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-white blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-black blur-[120px]" />
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-16 shadow-2xl rotate-3">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-10 leading-[0.9] tracking-tighter">
              {form.title}
            </h1>
          </div>
        </div>

        {/* Right Side: Success Message */}
        <div className="lg:w-1/2 p-6 lg:p-24 flex items-center justify-center bg-slate-50 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl p-16 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-black/5 relative z-10"
          >
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-10">
              <Check className="w-12 h-12 text-primary stroke-[3]" />
            </div>
            <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-900">Thank You!</h1>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed">
              Your response has been successfully submitted. We&apos;ll be in touch soon!
            </p>
            <Button 
              variant="outline" 
              className="mt-12 h-14 px-8 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
              onClick={() => window.location.reload()}
            >
              Submit Another Response
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex flex-col lg:flex-row selection:text-white", fontClass)} style={{ backgroundColor: backgroundColor }}>
      {/* Left Side: Brand & Value Proposition */}
      <div 
        className="lg:w-1/2 p-8 lg:p-20 flex flex-col justify-between relative overflow-hidden min-h-[400px] lg:min-h-screen"
        style={{ 
          backgroundColor: form.primaryColor || undefined,
          backgroundImage: form.backgroundImage ? `url(${form.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Abstract background shapes */}
        {!form.backgroundImage && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-[100px]" />
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 text-white/90 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold tracking-wider uppercase text-sm">Formora Premium</span>
          </div>
        </motion.div>

        <div className="relative z-10 max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-8"
          >
            {form.title}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {form.description && (
              <p className="text-xl lg:text-2xl text-white/80 font-medium leading-relaxed">
                {form.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Secure</p>
                  <p className="text-white/60 text-xs">End-to-end encrypted</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Fast</p>
                  <p className="text-white/60 text-xs">&lt; 2 min to finish</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-slate-200 overflow-hidden" style={{ borderColor: form.primaryColor || undefined }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm font-bold">Joined by 2,000+ others</p>
          </div>
        </div>
      </div>

      {/* Right Side: Modern Form Container */}
      <div 
        className="lg:w-1/2 p-6 lg:p-12 flex items-center justify-center relative overflow-y-auto"
        style={{ backgroundColor: backgroundColor }}
      >
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
            backgroundSize: '60px 60px' 
          }} 
        />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl bg-white rounded-[3.5rem] p-10 lg:p-16 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.12)] border border-black/5 relative z-10 my-12"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit} 
                className="space-y-16"
              >
                <div className="space-y-12">
                  {form.questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      id={question.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span 
                            className="px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs tracking-widest uppercase"
                            style={{ 
                              color: form.primaryColor || undefined,
                              backgroundColor: form.primaryColor ? `${form.primaryColor}1a` : undefined
                            }}
                          >
                            Step 0{index + 1}
                          </span>
                          {question.required && (
                            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">Required</span>
                          )}
                        </div>
                        <Label className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 block leading-tight">
                          {question.title}
                        </Label>
                        {question.description && (
                          <p className="text-lg text-slate-500 font-medium leading-relaxed">{question.description}</p>
                        )}
                      </div>

                      <div className="relative group">
                        {renderQuestion(question)}
                      </div>

                      <AnimatePresence>
                        {errors[question.id] && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-red-500 font-bold flex items-center gap-2 bg-red-50 p-4 rounded-xl border border-red-100"
                          >
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {errors[question.id]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8"
                >
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-24 text-3xl font-black bg-primary text-white hover:bg-primary/90 rounded-[2rem] shadow-2xl shadow-primary/30 group transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-tight relative overflow-hidden"
                    style={{ 
                      backgroundColor: form.primaryColor || undefined,
                      boxShadow: form.primaryColor ? `0 30px 60px -12px ${form.primaryColor}66` : undefined
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {form.buttonText || 'Get Started Now'}
                      <ArrowRight className="w-10 h-10 ml-4 group-hover:translate-x-2 transition-transform stroke-[4]" />
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-white/10"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                  
                  <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-slate-900 font-black text-lg">4.9/5</span>
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
                      Trusted by industry leaders
                    </p>
                  </div>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-10"
              >
                <div className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-100">
                  <Check className="w-16 h-16 stroke-[4]" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight">Success!</h2>
                  <p className="text-xl text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                    Your response has been recorded. We&apos;ll be in touch soon!
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="rounded-2xl font-bold border-2 h-16 px-8"
                  onClick={() => setSubmitted(false)}
                >
                  Submit another response
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
