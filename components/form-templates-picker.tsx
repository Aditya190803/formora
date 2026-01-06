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
    all: 'All Templates',
    feedback: 'Feedback',
    waitlist: 'Waitlist',
    onboarding: 'Onboarding',
    contact: 'Contact',
    survey: 'Survey',
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-muted hover:bg-muted-foreground/10'
            }`}
          >
            {categoryLabels[category]}
          </motion.button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectTemplate(template)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Template Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {template.recommendedStyle}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {template.baseForm.questions.length} questions
                      </Badge>
                    </div>
                    {template.tags && (
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Use Button */}
                  <Button className="w-full" size="sm">
                    Use This Template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {templates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No templates found in this category.</p>
        </motion.div>
      )}
    </div>
  );
}
