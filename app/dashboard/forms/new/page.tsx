'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@stackframe/stack';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Zap,
  Minus,
  ImagePlus,
  XCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  Calculator,
  Settings,
  Globe,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { 
  Question, 
  QuestionType, 
  FormStyle, 
  LogicJump,
  CalculationRule,
  ConditionOperator
} from '@/lib/types';
import { formsService, storageService, authService } from '@/lib/appwrite';
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
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
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

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative border border-muted bg-card transition-all overflow-hidden"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing bg-muted/30 border-r border-muted hover:bg-muted/50 transition-colors"
      >
        <GripVertical className="w-4 h-4 opacity-40" />
      </div>

      <Tabs value={activeQuestionTab} onValueChange={setActiveQuestionTab} className="w-full">
        <div className="flex items-center justify-between border-b border-muted bg-muted/10 px-6 py-3 pl-12">
          <TabsList className="h-8 bg-transparent p-0 gap-4">
            <TabsTrigger value="content" className="rounded-none bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-ink text-[10px] uppercase tracking-[0.3em] px-0 pb-1">
              Content
            </TabsTrigger>
            <TabsTrigger value="logic" className="rounded-none bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-ink text-[10px] uppercase tracking-[0.3em] px-0 pb-1">
              Logic
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 flex items-center justify-center text-[10px] font-heading italic opacity-40">
              {index + 1}
            </span>
            <div className="px-2 py-1 bg-muted text-[9px] uppercase tracking-[0.3em] opacity-60">
              {question.type.replace('_', ' ')}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => duplicateQuestion(question.id)}
              className="h-7 w-7 opacity-40 hover:opacity-100 transition-all"
              title="Duplicate Question"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteQuestion(question.id)}
              className="h-7 w-7 opacity-40 hover:opacity-100 hover:text-destructive transition-all"
              title="Delete Question"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <TabsContent value="content" className="p-8 pl-12 mt-0 space-y-6">
          <div className="space-y-4">
            <Input 
              value={question.title}
              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
              placeholder="Enter your question..."
              className="h-12 border-muted bg-transparent text-lg font-heading italic focus-visible:ring-0 focus-visible:border-ink transition-colors"
            />
            <Textarea 
              value={question.description}
              onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
              placeholder="Add a description (optional)..."
              className="min-h-[80px] border-muted bg-transparent text-sm opacity-60 focus-visible:ring-0"
            />
            {(question.type === 'short_text' || question.type === 'long_text' || question.type === 'email' || question.type === 'number') && (
              <Input 
                value={question.placeholder || ''}
                onChange={(e) => updateQuestion(question.id, { placeholder: e.target.value })}
                placeholder="Input placeholder (optional)..."
                className="h-10 border-muted bg-muted/5 text-sm focus-visible:ring-0"
              />
            )}
          </div>

          {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
            <div className="space-y-4 border-l border-muted pl-6 py-2">
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Choice Options</div>
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-foreground opacity-40 shrink-0" />
                  <Input 
                    value={option.label}
                    onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                    className="h-10 border-muted bg-card text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteOption(question.id, option.id)}
                    className="h-10 w-10 opacity-40 hover:opacity-100 hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addOption(question.id)}
                className="mt-4 border-muted text-[10px] uppercase tracking-[0.2em]"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add Option
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-muted flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Checkbox 
                id={`req-${question.id}`} 
                checked={question.required}
                onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                className="w-5 h-5 border-muted data-[state=checked]:bg-ink"
              />
              <Label htmlFor={`req-${question.id}`} className="text-[10px] uppercase tracking-[0.2em] cursor-pointer opacity-60">Required Question</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logic" className="p-8 pl-12 mt-0 space-y-8 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-heading italic flex items-center gap-2">
                  <GitBranch className="w-4 h-4 opacity-40" />
                  Jump Logic
                </h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Control the path of your form based on answers.</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addLogicJump}
                className="border-muted text-[10px] uppercase tracking-[0.2em]"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add Jump
              </Button>
            </div>

            {(!question.logicJumps || question.logicJumps.length === 0) ? (
              <div className="p-8 border border-dashed border-muted bg-muted/5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">No logic jumps defined. This question will always lead to the next one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(question.logicJumps || []).map((jump, jIndex) => (
                  <div key={jump.id} className="p-6 border border-muted bg-muted/5 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLogicJump(jump.id)}
                      className="absolute top-2 right-2 h-8 w-8 opacity-40 hover:opacity-100 hover:text-destructive"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
                      <span className="bg-ink text-bg px-2 py-0.5">If</span>
                      <span className="opacity-60">Answer</span>
                      <Select 
                        value={jump.conditions[0]?.operator || 'equals'}
                        onValueChange={(val) => {
                          const conds = [...jump.conditions];
                          if (conds[0]) conds[0].operator = val as ConditionOperator;
                          else conds.push({ id: uuidv4(), questionId: question.id, operator: val as ConditionOperator, value: '' });
                          updateLogicJump(jump.id, { conditions: conds });
                        }}
                      >
                        <SelectTrigger className="w-[140px] h-8 border-muted bg-card text-[10px] uppercase tracking-[0.1em]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="not_equals">Does Not Equal</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="not_contains">Does Not Contain</SelectItem>
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
                        className="h-8 w-[150px] border-muted bg-card text-sm"
                        placeholder="Value..."
                      />
                      <span className="bg-muted px-2 py-0.5">Then</span>
                      <span className="opacity-60">Jump to</span>
                      <Select 
                        value={jump.destinationQuestionId || ''}
                        onValueChange={(val) => updateLogicJump(jump.id, { 
                          action: val === 'end' ? 'end' : 'jump',
                          destinationQuestionId: val === 'end' ? undefined : val 
                        })}
                      >
                        <SelectTrigger className="w-[200px] h-8 border-muted bg-card text-[10px] uppercase tracking-[0.1em]">
                          <SelectValue placeholder="Select question" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="end">End of Form</SelectItem>
                          {allQuestions
                            .filter(q => q.id !== question.id)
                            .map((otherQ, otherIndex) => (
                              <SelectItem key={otherQ.id} value={otherQ.id}>
                                {otherIndex + 1}. {otherQ.title || 'Untitled'}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'number' && (
              <div className="pt-8 border-t border-muted space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-heading italic flex items-center gap-2">
                      <Calculator className="w-4 h-4 opacity-40" />
                      Calculations
                    </h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Update other fields based on this numeric answer.</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newCalc: CalculationRule = { id: uuidv4(), formula: '', targetQuestionId: '' };
                      updateQuestion(question.id, { calculations: [...(question.calculations || []), newCalc] });
                    }}
                    className="border-muted text-[10px] uppercase tracking-[0.2em]"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Add Calc
                  </Button>
                </div>

                {(!question.calculations || question.calculations.length === 0) ? (
                  <div className="p-8 border border-dashed border-muted bg-muted/5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">No calculations defined for this numeric field.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {question.calculations.map((calc, cIndex) => (
                      <div key={calc.id} className="p-6 border border-muted bg-muted/5 space-y-4 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuestion(question.id, { calculations: question.calculations?.filter(c => c.id !== calc.id) })}
                          className="absolute top-2 right-2 h-8 w-8 opacity-40 hover:opacity-100 hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
                          <span className="bg-ink text-bg px-2 py-0.5">Set</span>
                          <Select 
                            value={calc.targetQuestionId}
                            onValueChange={(val) => {
                              const calcs = [...(question.calculations || [])];
                              calcs[cIndex].targetQuestionId = val;
                              updateQuestion(question.id, { calculations: calcs });
                            }}
                          >
                            <SelectTrigger className="w-[180px] h-8 border-muted bg-card text-[10px] uppercase tracking-[0.1em]">
                              <SelectValue placeholder="Target field" />
                            </SelectTrigger>
                            <SelectContent>
                              {allQuestions
                                .filter(q => q.id !== question.id && q.type === 'number')
                                .map((otherQ, otherIndex) => (
                                  <SelectItem key={otherQ.id} value={otherQ.id}>
                                    {otherIndex + 1}. {otherQ.title || 'Untitled'}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <span className="bg-muted px-2 py-0.5">To</span>
                          <Input 
                            value={calc.formula}
                            onChange={(e) => {
                              const calcs = [...(question.calculations || [])];
                              calcs[cIndex].formula = e.target.value;
                              updateQuestion(question.id, { calculations: calcs });
                            }}
                            className="h-8 flex-1 min-w-[200px] border-muted bg-card text-sm"
                            placeholder="Formula (e.g. {{self}} * 1.1)"
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] opacity-60">Use {"{{self}}"} for this question's value, or {"{{qID}}"} for others.</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function NewFormPage() {
  const router = useRouter();
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
  const [limitOneResponse, setLimitOneResponse] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [activeTab, setActiveTab] = useState('build');
  const [saving, setSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [isSlugValidating, setIsSlugValidating] = useState(false);
  const [debouncedSlug, setDebouncedSlug] = useState('');

  // Debounce slug validation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(slug);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);

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
        body: JSON.stringify({ slug: value }),
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
      return false;
    } finally {
      setIsSlugValidating(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSlug && debouncedSlug !== '') {
      validateSlug(debouncedSlug);
    } else {
      setSlugError('');
    }
  }, [debouncedSlug, validateSlug]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    authService.ensureSession();
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
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
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
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
      toast.success('Question duplicated');
    }
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: [...q.options, { id: uuidv4(), label: `Option ${q.options.length + 1}` }]
        };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionId: string, label: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: q.options.map(o => o.id === optionId ? { ...o, label } : o)
        };
      }
      return q;
    }));
  };

  const deleteOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        return {
          ...q,
          options: q.options.filter(o => o.id !== optionId)
        };
      }
      return q;
    }));
  };

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
    // Store temporary form data in localStorage for preview
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

  const handleSave = async () => {
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
      let userId = user?.id;
      
      if (!userId) {
        const appwriteUser = await authService.getCurrentUser();
        userId = appwriteUser?.$id;
      }

      if (!userId) {
        toast.error('Authentication required');
        setSaving(false);
        return;
      }

      await formsService.create({
        userId,
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
        isPublished: true,
      });
      toast.success('Form created successfully!');
      router.push('/dashboard/forms');
    } catch (error) {
      console.error('Failed to create form:', error);
      toast.error('Failed to create form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-muted px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="h-10 w-10 opacity-40 hover:opacity-100 transition-opacity" asChild>
              <Link href="/dashboard/forms">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div className="h-6 w-px bg-muted hidden sm:block" />
            <div className="hidden sm:block">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                    autoFocus
                    className="h-8 w-[200px] border-muted bg-transparent font-heading italic text-lg"
                  />
                </div>
              ) : (
                <div 
                  className="group flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h1 className="text-xl font-heading italic tracking-tight truncate max-w-[200px]">
                    {title || 'Untitled Narrative'}
                  </h1>
                  <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                </div>
              )}
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">
                Draft
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handlePreview}
              size="lg"
              className="h-12"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              size="lg"
              className="h-12"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Publish
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-16">
          <div className="flex justify-center border-b border-muted">
            <TabsList className="h-auto p-0 bg-transparent flex gap-8">
              <TabsTrigger 
                value="build" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-[0.3em] font-medium pb-4"
              >
                Structure
              </TabsTrigger>
              <TabsTrigger 
                value="design" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-[0.3em] font-medium pb-4"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:bg-transparent text-[10px] uppercase tracking-[0.3em] font-medium pb-4"
              >
                Configuration
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="build" className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left: Question List */}
              <div className="lg:col-span-8 space-y-6">
                {questions.length === 0 ? (
                  <div className="py-32 text-center border border-muted border-dashed space-y-8">
                    <h2 className="text-4xl font-heading tracking-tight italic opacity-60">Begin your narrative</h2>
                    <p className="text-sm opacity-40 max-w-sm mx-auto leading-relaxed">
                      Add your first question from the sidebar to start composing your form.
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
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-32 p-6 border border-muted">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-medium mb-6">Add Element</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {questionTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant="ghost"
                        onClick={() => addQuestion(type.value)}
                        className="h-12 justify-start px-4 hover:bg-muted/10 transition-all"
                      >
                        <type.icon className="w-4 h-4 mr-3 opacity-40" />
                        <span className="text-sm">{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-12">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="p-8 border border-muted space-y-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">Style</p>
                  <h3 className="text-2xl font-heading italic">Choose a Style</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {(['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'] as FormStyle[]).map((s) => {
                    const Icon = styleIcons[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={cn(
                          "p-6 border transition-all flex flex-col items-center text-center gap-3",
                          style === s ? "border-ink bg-muted/20" : "border-muted hover:bg-muted/10"
                        )}
                      >
                        <Icon className={cn("w-8 h-8", style === s ? "opacity-100" : "opacity-40")} />
                        <div className="text-[10px] uppercase tracking-[0.2em]">{s.replace('_', ' ')}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 border border-muted space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-2">Customize</p>
                    <h3 className="text-2xl font-heading italic">Appearance</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetDesign}
                    className="border-muted text-[10px] uppercase tracking-[0.2em]"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reset
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Primary Color</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-12 w-16 border-muted bg-muted/30 p-1 cursor-pointer"
                      />
                      <Input 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                        className="h-12 border-muted bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:border-ink transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Background Color</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-12 w-16 border-muted bg-muted/30 p-1 cursor-pointer"
                      />
                      <Input 
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="h-12 border-muted bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:border-ink transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Text Color</Label>
                    <div className="flex gap-4">
                      <Input 
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-12 w-16 border-muted bg-muted/30 p-1 cursor-pointer"
                      />
                      <Input 
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        placeholder="#000000"
                        className="h-12 border-muted bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:border-ink transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="h-12 border-muted bg-transparent text-sm focus:ring-0">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent className="border-muted">
                        <SelectItem value="sans" className="font-sans">Sans Serif (Inter)</SelectItem>
                        <SelectItem value="serif" className="font-serif">Serif (Playfair)</SelectItem>
                        <SelectItem value="mono" className="font-mono">Monospace (JetBrains)</SelectItem>
                        <SelectItem value="heading">Heading (Impact Style)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Submit Button Text</Label>
                    <Input 
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Submit"
                      className="h-12 border-muted bg-transparent text-sm focus-visible:ring-0 focus-visible:border-ink transition-colors"
                    />
                  </div>

                  {style === 'conversational' && (
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Animation Speed ({animationSpeed}s)</Label>
                      <div className="flex items-center gap-4 h-12 border border-muted bg-muted/10 px-4 rounded-sm">
                        <input 
                          type="range" 
                          min="0.1" 
                          max="1.5" 
                          step="0.1"
                          value={animationSpeed}
                          onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                          className="flex-1 accent-ink"
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-span-full space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-60">Background Image</Label>
                    <div className="flex items-center gap-6">
                      {backgroundImage ? (
                        <div className="relative w-40 h-24 border border-muted group overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={backgroundImage} 
                            alt="Background" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setBackgroundImage('')}
                            className="absolute top-1 right-1 bg-destructive text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-muted bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <ImagePlus className="w-8 h-8 mb-3 opacity-40 group-hover:opacity-60 transition-opacity" />
                              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                                {isUploadingImage ? 'Uploading...' : 'Click to upload background image'}
                              </p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploadingImage}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Works best with Marketing style, but can be applied to any style</p>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-muted/60 bg-muted/5 space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-muted">
                  <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Narrative Details</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Form Title</Label>
                    <Input 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Customer Feedback"
                      className="h-12 !border-muted focus:!border-ink font-heading italic text-lg bg-transparent"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Description</Label>
                    <Textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell your audience what this form is about..."
                      className="min-h-[100px] !border-muted focus:!border-ink bg-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 border border-muted/60 bg-muted/5 space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-muted">
                  <h3 className="text-[10px] uppercase tracking-[0.5em] opacity-40">Collaboration</h3>
                  <span className="text-[9px] font-mono opacity-20">{collaborators.length} MEMBERS</span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Add Collaborator</Label>
                    <div className="flex gap-3">
                      <Input 
                        value={newCollaborator}
                        onChange={(e) => setNewCollaborator(e.target.value)}
                        placeholder="User ID or email address"
                        className="h-12 !border-muted focus:!border-ink font-heading italic bg-transparent"
                      />
                      <Button 
                        variant="outline"
                        onClick={() => {
                          if (newCollaborator && !collaborators.includes(newCollaborator)) {
                            setCollaborators([...collaborators, newCollaborator]);
                            setNewCollaborator('');
                            toast.success('Collaborator added');
                          }
                        }}
                        className="h-12 px-6 text-[10px] uppercase tracking-[0.2em]"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {collaborators.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-[10px] uppercase tracking-[0.3em] opacity-50">Current Collaborators</Label>
                      <div className="space-y-2">
                        {collaborators.map((c) => (
                          <div key={c} className="flex items-center justify-between p-4 border border-muted/60 bg-muted/5 group hover:border-muted transition-colors">
                            <span className="text-sm font-mono opacity-70">{c}</span>
                            <button 
                              onClick={() => setCollaborators(collaborators.filter(col => col !== c))}
                              className="opacity-30 hover:opacity-100 hover:text-destructive transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl space-y-16"
            >
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
                    <div className="relative flex-1">
                      <Input 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        placeholder="your-form-slug"
                        className={cn(
                          "h-12 !border-muted focus:!border-ink font-heading italic text-lg bg-transparent",
                          slugError && "!border-destructive",
                          slug && !isSlugValidating && !slugError && "!border-green-600"
                        )}
                      />
                      {isSlugValidating && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 animate-spin opacity-40" />
                        </div>
                      )}
                      {!isSlugValidating && slug && !slugError && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {!isSlugValidating && slug && slugError && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  {slugError ? (
                    <p className="text-[10px] text-destructive">{slugError}</p>
                  ) : (
                    <p className="text-[10px] font-mono opacity-30">
                      {slug ? `→ formora.com/f/${slug}` : 'Leave empty to use the form ID'}
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
                    <div className="text-[10px] opacity-40">Limit each user to one submission (IP + local storage)</div>
                  </div>
                  <Switch 
                    checked={limitOneResponse}
                    onCheckedChange={setLimitOneResponse}
                  />
                </motion.div>
              </section>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
