'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Save,
  Eye,
  FileText,
  MessageSquare,
  Megaphone,
  Loader2,
  Settings2,
  Layout,
  Type,
  CheckSquare,
  List,
  Mail,
  Hash,
  Edit3,
  Undo2,
  Redo2,
  Zap,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import { 
  Question, 
  QuestionType, 
  FormStyle, 
} from '@/lib/types';
import { formsService } from '@/lib/appwrite';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const questionTypes: { value: QuestionType; label: string; icon: React.ElementType }[] = [
  { value: 'short_text', label: 'Short Text', icon: Type },
  { value: 'long_text', label: 'Long Text', icon: Layout },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: List },
  { value: 'checkboxes', label: 'Checkboxes', icon: CheckSquare },
  { value: 'dropdown', label: 'Dropdown', icon: Settings2 },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'number', label: 'Number', icon: Hash },
];

const styleIcons: Record<FormStyle, React.ElementType> = {
  classic: FileText,
  conversational: MessageSquare,
  marketing: Megaphone,
  neo_brutalism: Zap,
  minimal: Minus,
};

function SortableQuestion({ 
  question, 
  index, 
  updateQuestion, 
  deleteQuestion, 
  duplicateQuestion,
  addOption, 
  updateOption, 
  deleteOption 
}: { 
  question: Question; 
  index: number; 
  updateQuestion: (id: string, updates: Partial<Question>) => void; 
  deleteQuestion: (id: string) => void; 
  duplicateQuestion: (id: string) => void;
  addOption: (id: string) => void; 
  updateOption: (questionId: string, optionId: string, label: string) => void; 
  deleteOption: (questionId: string, optionId: string) => void; 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-4 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 border-4 border-foreground bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        <GripVertical className="w-6 h-6 stroke-[3]" />
      </div>
      
      <div className="flex items-start justify-between gap-6 mb-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-10 h-10 border-4 border-foreground bg-primary text-white flex items-center justify-center font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {index + 1}
            </span>
            <Input 
              value={question.title}
              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
              placeholder="ENTER YOUR QUESTION..."
              className="h-12 border-4 border-foreground bg-muted/30 text-xl font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
          </div>
          <Textarea 
            value={question.description}
            onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
            placeholder="ADD A DESCRIPTION (OPTIONAL)..."
            className="min-h-[80px] border-4 border-foreground bg-muted/10 font-bold uppercase focus-visible:ring-0"
          />
          {(question.type === 'short_text' || question.type === 'long_text' || question.type === 'email' || question.type === 'number') && (
            <Input 
              value={question.placeholder || ''}
              onChange={(e) => updateQuestion(question.id, { placeholder: e.target.value })}
              placeholder="INPUT PLACEHOLDER (OPTIONAL)..."
              className="h-10 border-2 border-foreground bg-muted/5 font-bold uppercase italic focus-visible:ring-0"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => duplicateQuestion(question.id)}
            className="h-12 w-12 border-2 border-transparent hover:border-primary hover:bg-primary/10 text-primary transition-all"
            title="Duplicate Question"
          >
            <Copy className="w-6 h-6 stroke-[3]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => deleteQuestion(question.id)}
            className="h-12 w-12 border-2 border-transparent hover:border-destructive hover:bg-destructive/10 text-destructive transition-all"
            title="Delete Question"
          >
            <Trash2 className="w-6 h-6 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* Options for choice types */}
      {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
        <div className="space-y-4 pl-14">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Options</div>
          {question.options?.map((option) => (
            <div key={option.id} className="flex items-center gap-4">
              <div className="w-6 h-6 border-2 border-foreground bg-muted" />
              <Input 
                value={option.label}
                onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                className="h-10 border-2 border-foreground bg-card font-bold uppercase"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => deleteOption(question.id, option.id)}
                className="h-10 w-10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addOption(question.id)}
            className="mt-4 border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-xs"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Option
          </Button>
        </div>
      )}

      <div className="mt-8 pt-6 border-t-4 border-foreground/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox 
            id={`req-${question.id}`} 
            checked={question.required}
            onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
            className="w-6 h-6 border-4 border-foreground data-[state=checked]:bg-primary"
          />
          <Label htmlFor={`req-${question.id}`} className="font-black uppercase italic text-sm cursor-pointer">Required</Label>
        </div>
        <div className="px-4 py-1 border-2 border-foreground bg-muted text-[10px] font-black uppercase tracking-widest">
          {question.type.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
}

export default function EditFormPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const user = useUser();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<FormStyle>('conversational');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('sans');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState(0.4);
  const [buttonText, setButtonText] = useState('Submit');
  const [slug, setSlug] = useState('');
  const [isSlugValidating, setIsSlugValidating] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [limitOneResponse, setLimitOneResponse] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [history, setHistory] = useState<Question[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((newQuestions: Question[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push([...newQuestions]);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => {
      const next = prev + 1;
      return next > 49 ? 49 : next;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevQuestions = history[historyIndex - 1];
      setQuestions([...prevQuestions]);
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextQuestions = history[historyIndex + 1];
      setQuestions([...nextQuestions]);
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history]);

  // Initialize history
  useEffect(() => {
    if (questions.length > 0 && history.length === 0) {
      setHistory([[...questions]]);
      setHistoryIndex(0);
    }
  }, [questions, history.length]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [activeTab, setActiveTab] = useState('build');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchForm = async () => {
      if (!user?.id) return;
      try {
        const data = await formsService.getById(formId);
        if (data) {
          setTitle(data.title);
          setDescription(data.description || '');
          setStyle(data.style);
          setPrimaryColor(data.primaryColor || '#3b82f6');
          setBackgroundColor(data.backgroundColor || '#ffffff');
          setTextColor(data.textColor || '#000000');
          setFontFamily(data.fontFamily || 'sans');
          setBackgroundImage(data.backgroundImage || '');
          setAnimationSpeed(data.animationSpeed || 0.4);
          setButtonText(data.buttonText || 'Submit');
          setSlug(data.slug || '');
          setLimitOneResponse(data.limitOneResponse || false);
          setQuestions(data.questions);
          setCollaborators(data.collaborators || []);
        }
      } catch (error) {
        console.error('Failed to fetch form:', error);
        toast.error('Failed to load form');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId, user?.id]);

  const validateSlug = useCallback(async (value: string) => {
    if (!value) {
      setSlugError('');
      return true;
    }

    setIsSlugValidating(true);
    try {
      const response = await fetch('/api/forms/validate-slug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: value, currentFormId: formId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSlugError(data.error);
        return false;
      }
      setSlugError('');
      return true;
    } catch (error) {
      console.error('Failed to validate slug:', error);
      return false;
    } finally {
      setIsSlugValidating(false);
    }
  }, [formId]);

  const handleSave = useCallback(async () => {
    if (!title) {
      toast.error('Please enter a form title');
      return;
    }
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    if (slug) {
      const isSlugAvailable = await validateSlug(slug);
      if (!isSlugAvailable) {
        toast.error('Please fix the slug error before saving');
        setActiveTab('settings');
        return;
      }
    }

    setSaving(true);
    try {
      await formsService.update(formId, {
        title,
        description,
        style,
        primaryColor,
        backgroundColor,
        textColor,
        fontFamily,
        backgroundImage,
        animationSpeed,
        buttonText,
        slug,
        limitOneResponse,
        questions,
        collaborators,
      });
      toast.success('Form updated successfully!');
    } catch (error) {
      console.error('Failed to update form:', error);
      toast.error('Failed to update form');
    } finally {
      setSaving(false);
    }
  }, [formId, title, description, style, primaryColor, backgroundColor, textColor, fontFamily, backgroundImage, animationSpeed, buttonText, slug, limitOneResponse, questions, collaborators, validateSlug]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [redo, undo, handleSave]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        addToHistory(newItems);
        return newItems;
      });
    }
  };

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      title: '',
      description: '',
      required: false,
      options: type === 'multiple_choice' || type === 'checkboxes' || type === 'dropdown'
        ? [{ id: uuidv4(), label: 'Option 1' }]
        : undefined,
    };
    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    addToHistory(newQuestions);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    const newQuestions = questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    );
    setQuestions(newQuestions);
    // Debounce history for text updates? For now just add
    addToHistory(newQuestions);
  };

  const deleteQuestion = (id: string) => {
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    addToHistory(newQuestions);
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questions.find(q => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: uuidv4(),
        options: questionToDuplicate.options?.map(o => ({ ...o, id: uuidv4() }))
      };
      const index = questions.findIndex(q => q.id === id);
      const newQuestions = [...questions];
      newQuestions.splice(index + 1, 0, newQuestion);
      setQuestions(newQuestions);
      addToHistory(newQuestions);
      toast.success('Question duplicated');
    }
  };

  const addOption = (questionId: string) => {
    const newQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: [...q.options, { id: uuidv4(), label: `Option ${q.options.length + 1}` }]
        };
      }
      return q;
    });
    setQuestions(newQuestions);
    addToHistory(newQuestions);
  };

  const updateOption = (questionId: string, optionId: string, label: string) => {
    const newQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: q.options.map(o => o.id === optionId ? { ...o, label } : o)
        };
      }
      return q;
    });
    setQuestions(newQuestions);
    addToHistory(newQuestions);
  };

  const deleteOption = (questionId: string, optionId: string) => {
    const newQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: q.options.filter(o => o.id !== optionId)
        };
      }
      return q;
    });
    setQuestions(newQuestions);
    addToHistory(newQuestions);
  };

  const handlePreview = () => {
    if (questions.length === 0) {
      toast.error('Add at least one question to preview');
      return;
    }
    const previewData = {
      title: title || 'Untitled Form',
      description,
      style,
      primaryColor,
      buttonText,
      questions,
    };
    localStorage.setItem('formora_preview', JSON.stringify(previewData));
    window.open('/dashboard/forms/new/preview', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary stroke-[3]" />
          <p className="text-xl font-black uppercase italic">Loading Form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b-4 border-foreground p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="h-12 w-12 border-2 border-transparent hover:border-foreground hover:bg-muted transition-all" asChild>
              <Link href="/dashboard/forms">
                <ArrowLeft className="w-6 h-6 stroke-[3]" />
              </Link>
            </Button>
            <div className="h-10 w-1 bg-foreground/10 hidden sm:block" />
            <div className="hidden sm:block">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    autoFocus
                    className="h-8 w-[200px] border-2 border-foreground bg-card font-black uppercase italic text-sm"
                  />
                </div>
              ) : (
                <div 
                  className="group flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h1 className="text-xl font-black uppercase italic truncate max-w-[200px]">
                    {title || 'UNTITLED FORM'}
                  </h1>
                  <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                EDITING FORM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mr-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="h-10 w-10 rounded-none border-r-2 border-foreground hover:bg-muted transition-all"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-5 h-5 stroke-[3]" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="h-10 w-10 rounded-none hover:bg-muted transition-all"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-5 h-5 stroke-[3]" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              onClick={handlePreview}
              className="h-12 px-6 border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic"
            >
              <Eye className="w-5 h-5 mr-2 stroke-[3]" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="h-12 px-8 border-4 border-foreground bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2 stroke-[3]" />}
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <div className="flex justify-center">
            <TabsList className="h-16 p-2 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <TabsTrigger value="build" className="h-full px-8 font-black uppercase italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                1. Build
              </TabsTrigger>
              <TabsTrigger value="design" className="h-full px-8 font-black uppercase italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                2. Design
              </TabsTrigger>
              <TabsTrigger value="settings" className="h-full px-8 font-black uppercase italic data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                3. Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="build" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Question List */}
              <div className="lg:col-span-8 space-y-8">
                {questions.length === 0 ? (
                  <div className="py-32 text-center border-4 border-foreground border-dashed bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12">
                    <div className="w-24 h-24 border-4 border-foreground bg-muted flex items-center justify-center mx-auto mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <Plus className="w-12 h-12 text-muted-foreground stroke-[3]" />
                    </div>
                    <h2 className="text-3xl font-black mb-4 uppercase italic">Your form is empty</h2>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg font-bold uppercase">
                      Add your first question from the sidebar to start building.
                    </p>
                  </div>
                ) : (
                  <DndContext 
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext 
                      items={questions.map(q => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-6">
                        {questions.map((question, index) => (
                          <SortableQuestion 
                            key={question.id}
                            question={question}
                            index={index}
                            updateQuestion={updateQuestion}
                            deleteQuestion={deleteQuestion}
                            duplicateQuestion={duplicateQuestion}
                            addOption={addOption}
                            updateOption={updateOption}
                            deleteOption={deleteOption}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              {/* Right: Question Types Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-32 p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-2xl font-black uppercase italic mb-6">Add Question</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {questionTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant="outline"
                        onClick={() => addQuestion(type.value)}
                        className="h-14 justify-start border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic text-sm"
                      >
                        <type.icon className="w-5 h-5 mr-4 stroke-[3] text-primary" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-12">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <h3 className="text-3xl font-black uppercase italic">Choose Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {(['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'] as FormStyle[]).map((s) => {
                    const Icon = styleIcons[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={cn(
                          "p-8 border-4 border-foreground transition-all flex flex-col items-center text-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                          style === s ? "bg-primary text-white" : "bg-card"
                        )}
                      >
                        <Icon className={cn("w-12 h-12 stroke-[3]", style === s ? "text-white" : "text-primary")} />
                        <div className="font-black uppercase italic text-xs">{s.replace('_', ' ')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <h3 className="text-3xl font-black uppercase italic">Customization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Primary Color</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-14 w-24 border-4 border-foreground bg-muted/30 p-1 cursor-pointer"
                      />
                      <Input 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                        className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Background Color</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-14 w-24 border-4 border-foreground bg-muted/30 p-1 cursor-pointer"
                      />
                      <Input 
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Text Color</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-14 w-24 border-4 border-foreground bg-muted/30 p-1 cursor-pointer"
                      />
                      <Input 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#000000"
                        className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus:ring-0">
                        <SelectValue placeholder="SELECT FONT" />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-foreground p-2">
                        <SelectItem value="sans" className="font-sans font-black uppercase italic">Sans Serif (Inter)</SelectItem>
                        <SelectItem value="serif" className="font-serif font-black uppercase italic">Serif (Playfair)</SelectItem>
                        <SelectItem value="mono" className="font-mono font-black uppercase italic">Monospace (JetBrains)</SelectItem>
                        <SelectItem value="heading" className="font-black uppercase italic">Heading (Impact Style)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Submit Button Text</Label>
                    <Input 
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="SUBMIT"
                      className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    />
                  </div>

                  {style === 'conversational' && (
                    <div className="space-y-3">
                      <Label className="text-sm font-black uppercase tracking-widest ml-1">Animation Speed ({animationSpeed}s)</Label>
                      <div className="flex items-center gap-4 h-14 border-4 border-foreground bg-muted/30 px-4">
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.5" 
                          step="0.1"
                          value={animationSpeed}
                          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                          className="flex-1 accent-primary"
                        />
                      </div>
                    </div>
                  )}

                  {style === 'marketing' && (
                    <div className="col-span-full space-y-3">
                      <Label className="text-sm font-black uppercase tracking-widest ml-1">Background Image URL</Label>
                      <Input 
                        value={backgroundImage}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        placeholder="HTTPS://EXAMPLE.COM/IMAGE.JPG"
                        className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                      <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Used as a subtle background element in Marketing style</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <h3 className="text-3xl font-black uppercase italic">Form Info</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Form Title</Label>
                    <Input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="E.G. CUSTOMER FEEDBACK"
                      className="h-14 border-4 border-foreground bg-muted/30 text-xl font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Description</Label>
                    <Textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="TELL YOUR AUDIENCE WHAT THIS FORM IS ABOUT..."
                      className="min-h-[120px] border-4 border-foreground bg-muted/10 font-bold uppercase focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <h3 className="text-3xl font-black uppercase italic">Collaboration</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-black uppercase tracking-widest ml-1">Add Collaborator (User ID or Email)</Label>
                    <div className="flex gap-4">
                      <Input 
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        placeholder="USER ID OR EMAIL..."
                        className="h-14 border-4 border-foreground bg-muted/30 text-lg font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
                      />
                      <Button 
                        onClick={() => {
                          if (newCollaborator && !collaborators.includes(newCollaborator)) {
                            setCollaborators([...collaborators, newCollaborator]);
                            setNewCollaborator('');
                            toast.success('Collaborator added');
                          }
                        }}
                        className="h-14 px-8 border-4 border-foreground bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-black uppercase italic"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {collaborators.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-sm font-black uppercase tracking-widest ml-1">Current Collaborators</Label>
                      <div className="grid gap-3">
                        {collaborators.map((c) => (
                          <div key={c} className="flex items-center justify-between p-4 border-4 border-foreground bg-muted/10">
                            <span className="font-bold uppercase">{c}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setCollaborators(collaborators.filter(col => col !== c))}
                              className="h-10 w-10 hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-12">
            <div className="max-w-4xl mx-auto">
              <div className="p-8 border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
                <h3 className="text-3xl font-black uppercase italic">Form Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-black text-xl uppercase italic">Custom Slug</Label>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 border-4 border-foreground bg-muted font-bold">formora.com/f/</div>
                      <div className="relative flex-1">
                        <Input 
                          value={slug}
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                            setSlug(val);
                            if (val) validateSlug(val);
                            else setSlugError('');
                          }}
                          placeholder="your-custom-slug"
                          className={cn(
                            "h-12 border-4 border-foreground bg-muted/30 text-xl font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors",
                            slugError ? "border-destructive" : ""
                          )}
                        />
                        {isSlugValidating && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                    {slugError ? (
                      <p className="text-destructive font-bold uppercase text-xs">{slugError}</p>
                    ) : (
                      <p className="text-muted-foreground font-bold uppercase text-xs">Leave empty to use the form ID</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-6 border-4 border-foreground bg-muted/30">
                    <div>
                      <div className="font-black text-xl uppercase italic">Limit to 1 response</div>
                      <div className="text-muted-foreground font-bold uppercase text-sm">Uses IP-based check and local storage</div>
                    </div>
                    <Checkbox 
                      checked={limitOneResponse}
                      onCheckedChange={(checked) => setLimitOneResponse(!!checked)}
                      className="w-8 h-8 border-4 border-foreground data-[state=checked]:bg-primary" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
