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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black uppercase italic">No preview data found</h1>
          <Button onClick={() => window.close()} variant="outline" className="border-4 border-foreground">
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
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-4 right-4 z-[100]">
        <Button 
          onClick={() => window.close()} 
          variant="destructive" 
          className="h-12 px-6 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic"
        >
          <X className="w-5 h-5 mr-2 stroke-[3]" />
          Exit Preview
        </Button>
      </div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
        <div className="px-6 py-2 bg-primary text-white border-4 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Preview Mode
        </div>
      </div>
      {renderForm()}
    </div>
  );
}
