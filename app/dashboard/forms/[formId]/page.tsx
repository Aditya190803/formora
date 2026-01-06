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
  Minus,
  ImagePlus,
  XCircle,
  RotateCcw,
  GitBranch,
  Calculator,
  Settings,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  Question, 
  QuestionType, 
  FormStyle, 
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
      className="group relative border-4 border-foreground bg-card shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-grab active:cursor-grabbing p-2 border-4 border-foreground bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        <GripVertical className="w-6 h-6 stroke-[3]" />
      </div>

      <Tabs value={activeQuestionTab} onValueChange={setActiveQuestionTab} className="w-full">
        <div className="flex items-center justify-between border-b-4 border-foreground bg-muted/30 px-6 py-2">
          <TabsList className="h-10 border-2 border-foreground bg-background p-1">
            <TabsTrigger value="content" className="font-black uppercase italic text-[10px] px-4 data-[state=active]:bg-primary data-[state=active]:text-white">
              Content
            </TabsTrigger>
            <TabsTrigger value="logic" className="font-black uppercase italic text-[10px] px-4 data-[state=active]:bg-primary data-[state=active]:text-white">
              Logic
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 border-2 border-foreground bg-primary text-white flex items-center justify-center font-black italic text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              {index + 1}
            </span>
            <div className="px-3 py-1 border-2 border-foreground bg-muted text-[8px] font-black uppercase tracking-widest">
              {question.type.replace('_', ' ')}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => duplicateQuestion(question.id)}
              className="h-8 w-8 hover:text-primary transition-all"
              title="Duplicate Question"
            >
              <Copy className="w-4 h-4 stroke-[2]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteQuestion(question.id)}
              className="h-8 w-8 hover:text-destructive transition-all"
              title="Delete Question"
            >
              <Trash2 className="w-4 h-4 stroke-[2]" />
            </Button>
          </div>
        </div>

        <TabsContent value="content" className="p-8 mt-0 space-y-6">
          <div className="space-y-4">
            <Input 
              value={question.title}
              onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
              placeholder="ENTER YOUR QUESTION..."
              className="h-12 border-4 border-foreground bg-muted/30 text-xl font-black uppercase italic focus-visible:ring-0 focus-visible:border-primary transition-colors"
            />
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

          {/* Options for choice types */}
          {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
            <div className="space-y-4 border-l-4 border-foreground/10 pl-6 py-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Choice Options</div>
              {question.options?.map((option) => (
                <div key={option.id} className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-foreground bg-muted shrink-0" />
                  <Input 
                    value={option.label}
                    onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                    className="h-10 border-2 border-foreground bg-card font-bold uppercase"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteOption(question.id, option.id)}
                    className="h-10 w-10 hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addOption(question.id)}
                className="mt-4 border-2 border-foreground bg-card shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-[10px]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          )}

          <div className="pt-4 border-t-2 border-foreground/5 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Checkbox 
                id={`req-${question.id}`} 
                checked={question.required}
                onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                className="w-6 h-6 border-4 border-foreground data-[state=checked]:bg-primary"
              />
              <Label htmlFor={`req-${question.id}`} className="font-black uppercase italic text-xs cursor-pointer">Required Question</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logic" className="p-8 mt-0 space-y-8 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black uppercase italic flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Jump Logic
                </h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Control the path of your form based on answers.</p>
              </div>
              <Button
                size="sm"
                onClick={addLogicJump}
                className="border-4 border-foreground bg-card text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-[10px]"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add Jump
              </Button>
            </div>

            {(!question.logicJumps || question.logicJumps.length === 0) ? (
              <div className="p-8 border-4 border-foreground border-dashed bg-muted/5 text-center">
                <p className="font-black uppercase italic text-xs text-muted-foreground">No logic jumps defined. This question will always lead to the next one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(question.logicJumps || []).map((jump, jIndex) => (
                  <div key={jump.id} className="p-6 border-4 border-foreground bg-muted/10 space-y-4 relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLogicJump(jump.id)}
                      className="absolute top-2 right-2 h-8 w-8 hover:text-destructive"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>

                    <div className="flex flex-wrap items-center gap-3 font-black uppercase italic text-xs">
                      <span className="bg-foreground text-white px-2 py-0.5">IF</span>
                      <span>ANSWER</span>
                      <Select 
                        value={jump.conditions[0]?.operator || 'equals'}
                        onValueChange={(val) => {
                          const conds = [...jump.conditions];
                          if (conds[0]) conds[0].operator = val as ConditionOperator;
                          else conds.push({ id: uuidv4(), questionId: question.id, operator: val as ConditionOperator, value: '' });
                          updateLogicJump(jump.id, { conditions: conds });
                        }}
                      >
                        <SelectTrigger className="w-[140px] h-8 border-2 border-foreground bg-card text-[10px] font-black uppercase">
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
                        className="h-8 w-[150px] border-2 border-foreground bg-card text-[10px] font-black uppercase"
                        placeholder="VALUE..."
                      />
                      <span className="bg-primary text-white px-2 py-0.5">THEN</span>
                      <span className="bg-foreground text-white px-2 py-0.5">JUMP TO</span>
                      <Select 
                        value={jump.destinationQuestionId || ''}
                        onValueChange={(val) => updateLogicJump(jump.id, { 
                          action: val === 'end' ? 'end' : 'jump',
                          destinationQuestionId: val === 'end' ? undefined : val 
                        })}
                      >
                        <SelectTrigger className="w-[200px] h-8 border-2 border-foreground bg-card text-[10px] font-black uppercase">
                          <SelectValue placeholder="SELECT QUESTION" />
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
              <div className="pt-8 border-t-4 border-foreground/10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-black uppercase italic flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      Calculations
                    </h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Update other fields based on this numeric answer.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const newCalc: CalculationRule = { id: uuidv4(), formula: '', targetQuestionId: '' };
                      updateQuestion(question.id, { calculations: [...(question.calculations || []), newCalc] });
                    }}
                    className="border-4 border-foreground bg-card text-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-black uppercase italic text-[10px]"
                  >
                    <Plus className="w-3 h-3 mr-2" />
                    Add Calc
                  </Button>
                </div>

                {(!question.calculations || question.calculations.length === 0) ? (
                  <div className="p-8 border-4 border-foreground border-dashed bg-muted/5 text-center">
                    <p className="font-black uppercase italic text-xs text-muted-foreground">No calculations defined for this numeric field.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {question.calculations.map((calc, cIndex) => (
                      <div key={calc.id} className="p-6 border-4 border-foreground bg-muted/10 space-y-4 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuestion(question.id, { calculations: question.calculations?.filter(c => c.id !== calc.id) })}
                          className="absolute top-2 right-2 h-8 w-8 hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>

                        <div className="flex flex-wrap items-center gap-3 font-black uppercase italic text-xs">
                          <span className="bg-foreground text-white px-2 py-0.5">SET</span>
                          <Select 
                            value={calc.targetQuestionId}
                            onValueChange={(val) => {
                              const calcs = [...(question.calculations || [])];
                              calcs[cIndex].targetQuestionId = val;
                              updateQuestion(question.id, { calculations: calcs });
                            }}
                          >
                            <SelectTrigger className="w-[180px] h-8 border-2 border-foreground bg-card text-[10px] font-black uppercase">
                              <SelectValue placeholder="TARGET FIELD" />
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
                          <span className="bg-primary text-white px-2 py-0.5">TO</span>
                          <Input 
                            value={calc.formula}
                            onChange={(e) => {
                              const calcs = [...(question.calculations || [])];
                              calcs[cIndex].formula = e.target.value;
                              updateQuestion(question.id, { calculations: calcs });
                            }}
                            className="h-8 flex-1 min-w-[200px] border-2 border-foreground bg-card text-[10px] font-black uppercase"
                            placeholder="FORMULA (e.g. {{self}} * 1.1)"
                          />
                        </div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70">Use {"{{self}}"} for this question's value, or {"{{qID}}"} for others.</p>
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

  useEffect(() => {
    if (debouncedSlug && debouncedSlug !== '') {
      validateSlug(debouncedSlug);
    } else {
      setSlugError('');
    }
  }, [debouncedSlug, validateSlug]);

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
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black uppercase italic">Customization</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetDesign}
                    className="border-2 border-foreground font-black uppercase italic text-xs h-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reset to Default
                  </Button>
                </div>
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
                      <Label className="text-sm font-black uppercase tracking-widest ml-1">Background Image</Label>
                      <div className="flex items-center gap-6">
                        {backgroundImage ? (
                          <div className="relative w-40 h-24 border-4 border-foreground group overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                            <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-foreground bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImagePlus className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                <p className="text-xs font-black uppercase italic">
                                  {isUploadingImage ? 'UPLOADING...' : 'CLICK TO UPLOAD BACKGROUND IMAGE'}
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
                      <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Used as a signature visual element in Marketing style</p>
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
