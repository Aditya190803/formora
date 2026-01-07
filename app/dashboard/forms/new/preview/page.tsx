'use client';

import { useEffect, useState } from 'react';
import { ClassicRenderer, ConversationalRenderer, MarketingRenderer, NeoBrutalismRenderer, MinimalRenderer } from '@/components/form-renderers';
import { Form } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function PreviewPage() {
  const [formData, setFormData] = useState<Partial<Form> | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('formora_preview');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Use a timeout to avoid cascading renders warning in strict mode
        setTimeout(() => setFormData(parsed), 0);
      } catch (e) {
        console.error('Failed to parse preview data', e);
      }
    }
  }, []);

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg font-body">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border border-muted flex items-center justify-center mx-auto">
            <span className="text-2xl opacity-20">∅</span>
          </div>
          <h1 className="text-3xl font-heading italic">No Preview Data</h1>
          <Button onClick={() => window.close()} variant="outline" size="sm" className="text-[10px] uppercase tracking-[0.3em]">
            Close Preview
          </Button>
        </div>
      </div>
    );
  }

  const renderForm = () => {
    const mockForm: Form = {
      $id: 'preview',
      userId: 'preview',
      title: formData.title || 'Untitled Form',
      description: formData.description,
      style: formData.style || 'classic',
      questions: formData.questions || [],
      isPublished: false,
      primaryColor: formData.primaryColor,
      backgroundColor: formData.backgroundColor,
      textColor: formData.textColor,
      fontFamily: formData.fontFamily,
      backgroundImage: formData.backgroundImage,
      animationSpeed: formData.animationSpeed,
      buttonText: formData.buttonText,
    };

    const handleMockSubmit = (answers: Record<string, string | string[]>) => {
      console.log('Preview Submit:', answers);
      alert('Form submitted successfully (Preview Mode)');
    };

    switch (formData.style) {
      case 'classic':
        return <ClassicRenderer form={mockForm} onSubmit={handleMockSubmit} />;
      case 'conversational':
        return <ConversationalRenderer form={mockForm} onSubmit={handleMockSubmit} />;
      case 'marketing':
        return <MarketingRenderer form={mockForm} onSubmit={handleMockSubmit} />;
      case 'neo_brutalism':
        return <NeoBrutalismRenderer form={mockForm} onSubmit={handleMockSubmit} />;
      case 'minimal':
        return <MinimalRenderer form={mockForm} onSubmit={handleMockSubmit} />;
      default:
        return <ConversationalRenderer form={mockForm} onSubmit={handleMockSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-bg relative font-body">
      <div className="fixed top-4 right-4 z-[100]">
        <Button 
          onClick={() => window.close()} 
          variant="outline" 
          size="sm"
          className="text-[10px] uppercase tracking-[0.2em] border-muted hover:border-ink"
        >
          <X className="w-3 h-3 mr-2" />
          Exit Preview
        </Button>
      </div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
        <div className="px-6 py-2 bg-ink text-bg text-[10px] uppercase tracking-[0.3em]">
          Preview Mode
        </div>
      </div>
      {renderForm()}
    </div>
  );
}
