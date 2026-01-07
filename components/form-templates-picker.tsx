/**
 * Form Templates Picker Component
 * Allows users to select from predefined form templates
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllTemplates, getTemplatesByCategory } from '@/lib/services/templates';
import { FormTemplate, TemplateCategory } from '@/lib/types-extended';
import { ArrowRight } from 'lucide-react';

interface FormTemplatesPickerProps {
  onSelectTemplate: (template: FormTemplate) => void;
}

export function FormTemplatesPicker({ onSelectTemplate }: FormTemplatesPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  
  const templates = selectedCategory === 'all'
    ? getAllTemplates()
    : getTemplatesByCategory(selectedCategory as TemplateCategory);

  const categories: (TemplateCategory | 'all')[] = [
    'all',
    'feedback',
    'waitlist',
    'onboarding',
    'contact',
    'survey',
  ];

  const categoryLabels: Record<TemplateCategory | 'all', string> = {
    all: 'All',
    feedback: 'Feedback Systems',
    waitlist: 'Lead Capture',
    onboarding: 'Guided Flow',
    contact: 'Touchpoints',
    survey: 'Inquiry',
  };

  return (
    <div className="space-y-16 font-body">
      {/* Category Filter - Editorial Navigation */}
      <div className="flex flex-wrap gap-x-12 gap-y-4 border-b border-muted pb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-[10px] uppercase tracking-[0.4em] font-medium transition-all relative py-2 ${
              selectedCategory === category
                ? 'opacity-100'
                : 'opacity-30 hover:opacity-60'
            }`}
          >
            {categoryLabels[category]}
            {selectedCategory === category && (
              <motion.div 
                layoutId="activeCategory"
                className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-ink"
              />
            )}
          </button>
        ))}
      </div>

      {/* Templates Grid - Industrial Index/Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y border border-muted">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectTemplate(template)}
            className="group cursor-pointer p-8 space-y-8 hover:bg-muted/5 transition-colors aspect-square flex flex-col justify-between"
          >
            <div className="space-y-4">
              <span className="text-[10px] opacity-20 font-mono tracking-tighter">
                [ {index.toString().padStart(2, '0')} ]
              </span>
              <h3 className="text-2xl font-heading tracking-tight leading-tight group-hover:italic transition-all">
                {template.name}
              </h3>
              <p className="text-sm opacity-50 line-clamp-2 leading-relaxed">
                {template.description}
              </p>
            </div>

            <div className="flex items-end justify-between uppercase text-[9px] tracking-[0.2em] font-medium">
              <div className="space-y-1">
                <div className="opacity-40">Style</div>
                <div>{template.recommendedStyle}</div>
              </div>
              <div className="space-y-1 text-right">
                <div className="opacity-40">Elements</div>
                <div>{template.baseForm.questions.length} Nodes</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
