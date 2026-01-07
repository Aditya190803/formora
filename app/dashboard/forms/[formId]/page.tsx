'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import { Switch } from '@/components/ui/switch';
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
  Minus,
  ImagePlus,
  XCircle,
  RotateCcw,
  GitBranch,
  Calculator,
  Settings,
  AlertCircle,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { 
  Question, 
  QuestionType, 
  FormStyle,
  LogicJump,
  Condition, 
} from '@/lib/types';
import { formsService, storageService } from '@/lib/appwrite';
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
  allQuestions,
  updateQuestion, 
  deleteQuestion, 
  duplicateQuestion,
  addOption, 
  updateOption, 
  deleteOption 
}: { 
  question: Question; 
  index: number; 
  allQuestions: Question[];
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
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const [activeQuestionTab, setActiveQuestionTab] = useState('content');

  const addLogicJump = () => {
    const newJump: LogicJump = {
      id: uuidv4(),
      conditions: [],
      action: 'jump',
      destinationQuestionId: '',
    };
    updateQuestion(question.id, { 
      logicJumps: [...(question.logicJumps || []), newJump] 
    });
  };

  const removeLogicJump = (jumpId: string) => {
    updateQuestion(question.id, { 
      logicJumps: (question.logicJumps || []).filter(j => j.id !== jumpId) 
    });
  };

  const updateLogicJump = (jumpId: string, updates: Partial<LogicJump>) => {
    updateQuestion(question.id, { 
      logicJumps: (question.logicJumps || []).map(j => 
        j.id === jumpId ? { ...j, ...updates } : j
      ) 
    });
  };

  const addCondition = (jumpId: string) => {
    const newCondition: Condition = {
      id: uuidv4(),
      questionId: question.id,
      operator: 'equals',
      value: '',
    };
    updateLogicJump(jumpId, { 
      conditions: [...((question.logicJumps || []).find(j => j.id === jumpId)?.conditions || []), newCondition] 
    });
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "group relative border border-muted bg-bg transition-all duration-300",
        isDragging && "z-50 opacity-50 ring-1 ring-ink/10"
      )}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-12 top-0 bottom-0 flex items-center justify-center w-12 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-20 hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <Tabs value={activeQuestionTab} onValueChange={setActiveQuestionTab} className="w-full">
        <div className="flex items-center justify-between border-b border-muted bg-muted/5 px-6 py-3">
          <TabsList className="h-auto p-0 bg-transparent flex gap-6">
            <TabsTrigger 
              value="content" 
              className="rounded-none border-b border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-widest font-medium pb-1"
            >
              Structure
            </TabsTrigger>
            <TabsTrigger 
              value="logic" 
              className="rounded-none border-b border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-widest font-medium pb-1"
            >
              Logic
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] opacity-20 font-mono">[ { (index + 1).toString().padStart(2, '0') } ]</span>
              <div className="text-[9px] uppercase tracking-[0.2em] opacity-40">
                {question.type.replace('_', ' ')}
              </div>
            </div>
            
            <div className="flex items-center gap-2 border-l border-muted pl-4">
              <button 
                onClick={() => duplicateQuestion(question.id)}
                className="opacity-20 hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => deleteQuestion(question.id)}
                className="opacity-20 hover:text-danger hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <TabsContent value="content" className="p-10 space-y-10 mt-0">
          <div className="space-y-6">
            <Input 
              value={question.title}
              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
              placeholder="Inquiry label..."
              className="text-2xl font-heading tracking-tight italic !border-b-muted focus:!border-b-ink"
            />
            <Textarea 
              value={question.description}
              onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
              placeholder="Add contextual narrative (optional)..."
              className="min-h-[60px] border-0 border-b border-muted bg-transparent font-body text-sm rounded-none focus-visible:ring-0 focus-visible:border-ink resize-none p-0"
            />
          </div>

          {/* Options for choice types */}
          {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
            <div className="space-y-6 border-l border-muted pl-10 py-2">
              <div className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-6">Discrete Options</div>
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center gap-6 group/option">
                    <div className="w-4 h-4 border border-muted shrink-0" />
                    <Input 
                      value={option.label}
                      onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                      className="!h-8 !border-b-muted focus:!border-b-ink text-sm bg-transparent p-0"
                    />
                    <button 
                      onClick={() => deleteOption(question.id, option.id)}
                      className="opacity-0 group-hover/option:opacity-40 hover:opacity-100 hover:text-danger transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addOption(question.id)}
                className="mt-6"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add Node
              </Button>
            </div>
          )}

          <div className="pt-6 border-t border-muted flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox 
                id={`req-${question.id}`} 
                checked={question.required}
                onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                className="border-muted rounded-none"
              />
              <Label htmlFor={`req-${question.id}`} className="text-[10px] uppercase tracking-widest opacity-60 cursor-pointer">Mandatory</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logic" className="p-10 space-y-12 mt-0">
          <div className="flex items-center justify-between border-b border-muted pb-8">
            <div className="space-y-1">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium flex items-center gap-3">
                <GitBranch className="w-3 h-3" />
                Narrative Jumps
              </h4>
              <p className="text-[9px] opacity-40 uppercase tracking-widest">Control the sequence of inquiry.</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={addLogicJump}
            >
              <Plus className="w-3 h-3 mr-2" />
              New Path
            </Button>
          </div>

          {(!question.logicJumps || question.logicJumps.length === 0) ? (
            <div className="py-20 text-center border border-muted border-dashed">
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-20">Linear sequence maintained</p>
            </div>
          ) : (
            <div className="space-y-8">
              {(question.logicJumps || []).map((jump, jIndex) => (
                <div key={jump.id} className="p-8 border border-muted bg-muted/5 space-y-8 relative">
                  <button
                    onClick={() => removeLogicJump(jump.id)}
                    className="absolute top-6 right-6 opacity-20 hover:opacity-100 hover:text-danger transition-opacity"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>

                  <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-medium">
                    <span className="opacity-20 italic">If input matches</span>
                    <Select 
                      value={jump.conditions[0]?.operator || 'equals'}
                      onValueChange={(val) => {
                        const conds = [...jump.conditions];
                        if (conds[0]) conds[0].operator = val as any;
                        else conds.push({ id: uuidv4(), questionId: question.id, operator: val as any, value: '' });
                        updateLogicJump(jump.id, { conditions: conds });
                      }}
                    >
                      <SelectTrigger className="w-[140px] h-8 rounded-none border-0 border-b border-muted bg-transparent focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-muted">
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Does Not Equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      value={jump.conditions[0]?.value || ''}
                      onChange={(e) => {
                        const conds = [...jump.conditions];
                        if (conds[0]) conds[0].value = e.target.value;
                        else conds.push({ id: uuidv4(), questionId: question.id, operator: 'equals', value: e.target.value });
                        updateLogicJump(jump.id, { conditions: conds });
                      }}
                      className="h-8 w-[150px] !border-b-muted focus:!border-b-ink italic"
                      placeholder="Value..."
                    />
                    <span className="opacity-20 italic">then jump to</span>
                    <Select 
                      value={jump.destinationQuestionId || ''}
                      onValueChange={(val) => updateLogicJump(jump.id, { 
                        action: val === 'end' ? 'end' : 'jump',
                        destinationQuestionId: val === 'end' ? undefined : val 
                      })}
                    >
                      <SelectTrigger className="w-[200px] h-8 rounded-none border-0 border-b border-muted bg-transparent focus:ring-0">
                        <SelectValue placeholder="Target Node" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-muted">
                        <SelectItem value="end">End Narrative</SelectItem>
                        {allQuestions
                          .filter(q => q.id !== question.id)
                          .map((otherQ, otherIndex) => (
                            <SelectItem key={otherQ.id} value={otherQ.id} className="text-[10px] uppercase tracking-wider">
                              {otherIndex + 1}. {otherQ.title || 'Untitled Node'}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(0.4);
  const [buttonText, setButtonText] = useState('Submit');
  const [slug, setSlug] = useState('');
  const [isSlugValidating, setIsSlugValidating] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [limitOneResponse, setLimitOneResponse] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [history, setHistory] = useState<Question[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [debouncedSlug, setDebouncedSlug] = useState('');

  // Debounce slug validation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

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
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ slug: value, currentFormId: formId }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        setSlugError(data.error || 'Validation failed');
        return false;
      }
      setSlugError('');
      return true;
    } catch (error) {
      console.error('Network error during slug validation:', error);
      // Don't set error message for network errors to avoid flickering, 
      // but return false to prevent saving invalid states
      return false;
    } finally {
      setIsSlugValidating(false);
    }
  }, [formId]);

  // Validate slug when debounced value changes
  useEffect(() => {
    if (debouncedSlug && debouncedSlug !== '') {
      validateSlug(debouncedSlug);
    } else {
      setSlugError('');
    }
  }, [debouncedSlug, validateSlug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await storageService.uploadFile(file);
      setBackgroundImage(url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image. Make sure Storage is configured.');
    } finally {
      setIsUploadingImage(false);
    }
  };

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

  const handleResetDesign = () => {
    setPrimaryColor('#3b82f6');
    setBackgroundColor('#ffffff');
    setTextColor('#000000');
    setFontFamily('sans');
    setAnimationSpeed(0.4);
    setButtonText('Submit');
    setBackgroundImage('');
    toast.success('Design reset to defaults');
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
      backgroundColor,
      textColor,
      fontFamily,
      backgroundImage,
      animationSpeed,
      buttonText,
      questions,
    };
    localStorage.setItem('formora_preview', JSON.stringify(previewData));
    window.open('/dashboard/forms/new/preview', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-body">
        <div className="flex flex-col items-center gap-8">
          <Loader2 className="w-8 h-8 animate-spin opacity-20" />
          <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Synchronizing Atelier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-muted px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="opacity-40 hover:opacity-100 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="space-y-1">
              {isEditingTitle ? (
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="h-8 min-w-[300px] !border-b-ink"
                />
              ) : (
                <div 
                  className="group flex items-center gap-4 cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h1 className="text-2xl font-heading tracking-tighter italic">
                    {title || 'Untitled Narrative'}
                  </h1>
                  <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 pr-6 border-r border-muted mr-6">
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 opacity-40 hover:opacity-100 disabled:opacity-10 transition-opacity"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 opacity-40 hover:opacity-100 disabled:opacity-10 transition-opacity"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>
            
            <Button variant="outline" onClick={handlePreview}>
              Preview
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Changes'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-20">
          <div className="flex justify-start border-b border-muted">
            <TabsList className="h-auto p-0 bg-transparent flex gap-12">
              <TabsTrigger 
                value="build" 
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent pb-6 text-[10px] uppercase tracking-[0.4em] font-medium"
              >
                01. Structure
              </TabsTrigger>
              <TabsTrigger 
                value="design" 
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent pb-6 text-[10px] uppercase tracking-[0.4em] font-medium"
              >
                02. Aesthetic
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="relative rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent pb-6 text-[10px] uppercase tracking-[0.4em] font-medium"
              >
                03. Protocol
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="build" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
            >
              {/* Left: Question List */}
              <div className="lg:col-span-8 space-y-8">
                {questions.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 lg:py-48 flex flex-col items-center justify-center border border-dashed border-muted/60 bg-gradient-to-b from-muted/5 to-transparent"
                  >
                    <div className="w-16 h-16 border border-muted/40 flex items-center justify-center mb-8">
                      <Plus className="w-5 h-5 opacity-20" />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.4em] opacity-30 mb-6">No nodes defined</p>
                    <p className="text-sm font-heading italic opacity-50 mb-8">Begin structuring your narrative</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addQuestion('short_text')}
                      className="text-[10px] uppercase tracking-[0.3em]"
                    >
                      Create First Node
                    </Button>
                  </motion.div>
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
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <SortableQuestion 
                            key={question.id}
                            question={question}
                            index={index}
                            allQuestions={questions}
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
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-muted">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Node Types</h3>
                    <span className="text-[9px] font-mono opacity-20">{questionTypes.length}</span>
                  </div>
                  <div className="space-y-1">
                    {questionTypes.map((type, idx) => (
                      <motion.button
                        key={type.value}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        onClick={() => addQuestion(type.value)}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/10 border border-transparent hover:border-muted/50 transition-all group"
                      >
                        <div className="w-8 h-8 border border-muted/40 flex items-center justify-center group-hover:border-ink/30 transition-colors">
                          <type.icon className="w-3 h-3 opacity-30 group-hover:opacity-80 transition-opacity" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="text-[11px] uppercase tracking-[0.15em] font-medium block">{type.label}</span>
                        </div>
                        <Plus className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="design" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-5xl space-y-24"
            >
              <section className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-muted">
                  <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Presentation Mode</h3>
                  <span className="text-[9px] font-mono opacity-20">5 archetypes</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {(['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'] as FormStyle[]).map((s, idx) => {
                    const Icon = styleIcons[s];
                    const isSelected = style === s;
                    return (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setStyle(s)}
                        className={cn(
                          "relative p-6 flex flex-col items-center gap-4 border transition-all group",
                          isSelected 
                            ? "border-ink bg-ink text-bg" 
                            : "border-muted/60 hover:border-muted bg-transparent hover:bg-muted/5"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-bg rounded-full" />
                        )}
                        <div className={cn(
                          "w-10 h-10 border flex items-center justify-center transition-colors",
                          isSelected ? "border-bg/30" : "border-muted/40 group-hover:border-muted"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4 transition-opacity",
                            isSelected ? "opacity-80" : "opacity-30 group-hover:opacity-60"
                          )} />
                        </div>
                        <span className="text-[9px] uppercase tracking-[0.2em] font-medium">
                          {s.replace('_', ' ')}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-muted">
                  <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Visual Parameters</h3>
                  <button
                    onClick={handleResetDesign}
                    className="text-[9px] uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 border border-transparent hover:border-muted"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 p-6 border border-muted/50 bg-muted/5"
                  >
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                      Accent Color
                    </Label>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 border border-muted overflow-hidden">
                        <input 
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full h-full bg-transparent cursor-pointer scale-150"
                        />
                      </div>
                      <Input 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 h-10 font-mono text-sm !border-muted focus:!border-ink bg-transparent"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-4 p-6 border border-muted/50 bg-muted/5"
                  >
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50 flex items-center gap-2">
                      <div className="w-2 h-2 border border-muted" style={{ backgroundColor: backgroundColor }} />
                      Canvas Color
                    </Label>
                    <div className="flex gap-3 items-center">
                      <div className="w-14 h-14 border border-muted overflow-hidden">
                        <input 
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-full h-full bg-transparent cursor-pointer scale-150"
                        />
                      </div>
                      <Input 
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 h-10 font-mono text-sm !border-muted focus:!border-ink bg-transparent"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 p-6 border border-muted/50 bg-muted/5"
                  >
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Typography Set</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="h-12 rounded-none border border-muted bg-transparent focus:ring-0 focus:border-ink">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-muted">
                        <SelectItem value="sans" className="text-[11px] uppercase tracking-wider">Sans — Standard</SelectItem>
                        <SelectItem value="serif" className="text-[11px] uppercase tracking-wider">Serif — Editorial</SelectItem>
                        <SelectItem value="mono" className="text-[11px] uppercase tracking-wider">Mono — Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-4 p-6 border border-muted/50 bg-muted/5"
                  >
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Submit Button Text</Label>
                    <Input 
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Submit"
                      className="h-12 !border-muted focus:!border-ink bg-transparent font-heading italic text-lg"
                    />
                  </motion.div>
                </div>
              </section>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24"
            >
              <div className="lg:col-span-8 space-y-16">
                <section className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-muted">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Access & Distribution</h3>
                    <span className="text-[9px] font-mono opacity-20">PUBLIC</span>
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-8 border border-muted/60 bg-muted/5 space-y-6"
                  >
                    <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] opacity-40">
                      <Globe className="w-3 h-3" />
                      <span>Public URL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-30 font-mono">formora.com/f/</span>
                      <Input 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        placeholder="your-form-slug"
                        className="flex-1 h-12 !border-muted focus:!border-ink font-heading italic text-lg bg-transparent"
                      />
                    </div>
                    {slug && (
                      <p className="text-[10px] font-mono opacity-30">
                        → formora.com/f/{slug}
                      </p>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center justify-between p-6 border border-muted/60 bg-muted/5 group hover:border-muted transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                        <Shield className="w-3 h-3 opacity-40" />
                        Single Response Mode
                      </div>
                      <div className="text-[10px] opacity-40">Limit each user to one submission</div>
                    </div>
                    <Switch 
                      checked={limitOneResponse}
                      onCheckedChange={setLimitOneResponse}
                    />
                  </motion.div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-muted">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Extensions</h3>
                    <span className="text-[9px] font-mono opacity-20">3 AVAILABLE</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { href: `/dashboard/forms/${formId}/analytics`, icon: BarChart3, label: 'Analytics', desc: 'Response metrics & insights' },
                      { href: `/dashboard/forms/${formId}/conditional-logic`, icon: Zap, label: 'Logic Flows', desc: 'Conditional branching rules' },
                      { href: `/dashboard/forms/${formId}/integrations`, icon: Globe, label: 'Integrations', desc: 'Webhooks & notifications' },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.05 }}
                      >
                        <Link 
                          href={item.href} 
                          className="group flex flex-col p-6 border border-muted/60 hover:border-ink bg-transparent hover:bg-muted/5 transition-all h-full"
                        >
                          <div className="w-10 h-10 border border-muted/40 flex items-center justify-center mb-6 group-hover:border-ink/30 transition-colors">
                            <item.icon className="w-4 h-4 opacity-30 group-hover:opacity-80 transition-opacity" />
                          </div>
                          <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium mb-2">{item.label}</h4>
                          <p className="text-[10px] opacity-30 group-hover:opacity-50 transition-opacity">{item.desc}</p>
                          <div className="mt-auto pt-6">
                            <span className="text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-40 transition-opacity">Configure →</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4">
                <div className="sticky top-32 p-6 border border-dashed border-muted/40 bg-muted/5">
                  <div className="text-[9px] uppercase tracking-[0.3em] opacity-30 mb-4">Quick Actions</div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-[10px] uppercase tracking-[0.2em]" asChild>
                      <Link href={`/f/${slug || formId}`} target="_blank">
                        <Eye className="w-3 h-3 mr-2" />
                        Preview Form
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-[10px] uppercase tracking-[0.2em]"
                      onClick={() => {
                        const url = `${window.location.origin}/f/${slug || formId}`;
                        navigator.clipboard.writeText(url);
                        toast.success('Form link copied!');
                      }}
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
