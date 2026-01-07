/**
 * Conditional Logic Builder Page
 * /dashboard/forms/[formId]/conditional-logic
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { formsService } from '@/lib/appwrite';
import { Form, Question, ConditionOperator } from '@/lib/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

interface Condition {
  id: string;
  questionId: string;
  operator: ConditionOperator;
  value: string;
}

interface QuestionWithConditions extends Question {
  showConditions?: Condition[];
}

export default function ConditionalLogicPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enableLogic, setEnableLogic] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithConditions[]>([]);
  
  // Logic Lab state
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [selectedSourceId, setSelectedSourceId] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<ConditionOperator>('equals');
  const [conditionValue, setConditionValue] = useState<string>('');

  const fetchForm = useCallback(async () => {
    try {
      const data = await formsService.getById(formId);
      if (data) {
        setForm(data);
        // Parse questions and check for existing show conditions
        const questionsWithConditions = data.questions.map(q => ({
          ...q,
          showConditions: (q as QuestionWithConditions).showConditions || []
        }));
        setQuestions(questionsWithConditions);
        // Enable logic if any question has conditions
        const hasConditions = questionsWithConditions.some(q => q.showConditions && q.showConditions.length > 0);
        setEnableLogic(hasConditions);
      }
    } catch (error) {
      console.error('Failed to fetch form:', error);
      toast.error('Failed to load form');
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const handleAddCondition = () => {
    if (!selectedQuestionId || !selectedSourceId || !conditionValue) {
      toast.error('Please fill in all fields');
      return;
    }

    if (selectedQuestionId === selectedSourceId) {
      toast.error('A question cannot depend on itself');
      return;
    }

    const newCondition: Condition = {
      id: uuidv4(),
      questionId: selectedSourceId,
      operator: selectedOperator,
      value: conditionValue
    };

    setQuestions(prev => prev.map(q => {
      if (q.id === selectedQuestionId) {
        return {
          ...q,
          showConditions: [...(q.showConditions || []), newCondition]
        };
      }
      return q;
    }));

    // Reset form
    setConditionValue('');
    toast.success('Condition added');
  };

  const handleRemoveCondition = (questionId: string, conditionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          showConditions: (q.showConditions || []).filter(c => c.id !== conditionId)
        };
      }
      return q;
    }));
    toast.success('Condition removed');
  };

  const handleSave = async () => {
    if (!form) return;
    
    setSaving(true);
    try {
      await formsService.update(formId, {
        questions: questions
      });
      toast.success('Logic saved successfully');
    } catch (error) {
      console.error('Failed to save logic:', error);
      toast.error('Failed to save logic');
    } finally {
      setSaving(false);
    }
  };

  const getQuestionTitle = (questionId: string) => {
    const q = questions.find(q => q.id === questionId);
    return q?.title || 'Unknown question';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-body">
        <Loader2 className="w-6 h-6 animate-spin opacity-40" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center font-body">
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Form not found</p>
      </div>
    );
  }

  const formIdentifier = form.slug || form.$id;

  return (
    <div className="p-12 font-body space-y-16">
      <div className="flex items-center justify-between pb-12 border-b border-muted">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="opacity-40 hover:opacity-100" asChild>
              <Link href={`/dashboard/forms/${formId}`}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-5xl font-heading tracking-tighter italic">Logic</h1>
          </div>
          <div className="flex items-center gap-6 ml-14">
            <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">
              {form.title}
            </p>
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="h-12 px-6">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Changes
        </Button>
      </div>

      <div className="border border-muted divide-y divide-muted">
        <div className="p-10 flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-heading italic">Conditional Display</h3>
            <p className="text-sm opacity-60">Show or hide questions based on previous answers.</p>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 border border-muted">
            <Checkbox
              id="enable-logic"
              checked={enableLogic}
              onCheckedChange={(checked) => setEnableLogic(checked as boolean)}
              className="rounded-none border-muted data-[state=checked]:bg-ink data-[state=checked]:border-ink"
            />
            <Label htmlFor="enable-logic" className="text-[10px] uppercase tracking-[0.3em] cursor-pointer">
              Enable Logic Engine
            </Label>
          </div>
        </div>

        {!enableLogic ? (
          <div className="p-20 text-center space-y-6 opacity-30">
            <Sparkles className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-[10px] uppercase tracking-[0.5em]">Engine Offline</p>
          </div>
        ) : (
          <div className="divide-y divide-muted">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-x divide-muted">
              <div className="md:col-span-8 p-10 space-y-8">
                <h4 className="text-[10px] uppercase tracking-[0.4em] opacity-40">Active Conditions</h4>
                {questions.length > 0 ? (
                  <div className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id} className="p-8 border border-muted space-y-6 bg-muted/5">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest opacity-40">Question {index + 1}</p>
                            <h5 className="font-heading italic text-xl">{question.title || 'Untitled'}</h5>
                          </div>
                          <p className="text-[9px] uppercase tracking-widest opacity-40">Show if...</p>
                        </div>

                        {question.showConditions && question.showConditions.length > 0 ? (
                          <div className="space-y-3">
                            {question.showConditions.map(condition => (
                              <div key={condition.id} className="flex items-center justify-between p-4 border border-muted/50 text-sm">
                                <span className="opacity-80">
                                  <span className="opacity-40 uppercase mr-2 text-[10px] tracking-wider">If</span>
                                  <strong className="font-heading italic">{getQuestionTitle(condition.questionId)}</strong>
                                  <span className="mx-2 opacity-40">{condition.operator.replace('_', ' ')}</span>
                                  <strong className="font-heading italic">"{condition.value}"</strong>
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveCondition(question.id, condition.id)}
                                  className="h-8 w-8 p-0 opacity-40 hover:opacity-100 hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-6 text-center border border-dashed border-muted text-[10px] uppercase tracking-widest opacity-40">
                            Always visible
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-muted text-center italic opacity-40">
                    This form has no questions yet.
                  </div>
                )}
              </div>

              <div className="md:col-span-4 p-10 space-y-8">
                <h4 className="text-[10px] uppercase tracking-[0.4em] opacity-40">Logic Lab</h4>
                <div className="space-y-6 border border-muted p-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Target Question</Label>
                    <Select value={selectedQuestionId} onValueChange={setSelectedQuestionId}>
                      <SelectTrigger className="border-muted">
                        <SelectValue placeholder="Select question to control" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.slice(1).map((q, i) => (
                          <SelectItem key={q.id} value={q.id}>
                            {i + 2}. {q.title || 'Untitled'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[9px] opacity-40">This question will be shown/hidden based on the condition</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Source Question</Label>
                    <Select value={selectedSourceId} onValueChange={setSelectedSourceId}>
                      <SelectTrigger className="border-muted">
                        <SelectValue placeholder="Select trigger question" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.map((q, i) => (
                          <SelectItem key={q.id} value={q.id} disabled={q.id === selectedQuestionId}>
                            {i + 1}. {q.title || 'Untitled'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Condition</Label>
                    <Select value={selectedOperator} onValueChange={(v) => setSelectedOperator(v as ConditionOperator)}>
                      <SelectTrigger className="border-muted">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">equals</SelectItem>
                        <SelectItem value="not_equals">does not equal</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                        <SelectItem value="not_contains">does not contain</SelectItem>
                        <SelectItem value="greater_than">is greater than</SelectItem>
                        <SelectItem value="less_than">is less than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest opacity-60">Value</Label>
                    <Input 
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      placeholder="Enter expected value" 
                      className="border-muted"
                    />
                  </div>

                  <Button 
                    onClick={handleAddCondition}
                    disabled={!selectedQuestionId || !selectedSourceId || !conditionValue}
                    className="w-full uppercase tracking-[0.2em] text-[11px] py-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
