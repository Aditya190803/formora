'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  GripVertical,
  Trash2,
  Copy,
  GitBranch,
  XCircle,
} from 'lucide-react';
import { Question, LogicJump, Condition, ConditionOperator } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableQuestionProps {
  question: Question;
  index: number;
  allQuestions: Question[];
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  addOption: (id: string) => void;
  updateOption: (questionId: string, optionId: string, label: string) => void;
  deleteOption: (questionId: string, optionId: string) => void;
}

export function SortableQuestion({
  question,
  index,
  allQuestions,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  addOption,
  updateOption,
  deleteOption,
}: SortableQuestionProps) {
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
      logicJumps: [...(question.logicJumps || []), newJump],
    });
  };

  const removeLogicJump = (jumpId: string) => {
    updateQuestion(question.id, {
      logicJumps: (question.logicJumps || []).filter((j) => j.id !== jumpId),
    });
  };

  const updateLogicJump = (jumpId: string, updates: Partial<LogicJump>) => {
    updateQuestion(question.id, {
      logicJumps: (question.logicJumps || []).map((j) =>
        j.id === jumpId ? { ...j, ...updates } : j
      ),
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative border border-muted bg-bg transition-all duration-300',
        isDragging && 'z-50 opacity-50 ring-1 ring-ink/10'
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
              <span className="text-[10px] opacity-20 font-mono">
                [ {(index + 1).toString().padStart(2, '0')} ]
              </span>
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
                className="opacity-20 hover:text-destructive hover:opacity-100 transition-opacity"
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
          {(question.type === 'multiple_choice' ||
            question.type === 'checkboxes' ||
            question.type === 'dropdown') && (
            <div className="space-y-6 border-l border-muted pl-10 py-2">
              <div className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-6">
                Discrete Options
              </div>
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
                      className="opacity-0 group-hover/option:opacity-40 hover:opacity-100 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => addOption(question.id)} className="mt-6">
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
              <Label
                htmlFor={`req-${question.id}`}
                className="text-[10px] uppercase tracking-widest opacity-60 cursor-pointer"
              >
                Mandatory
              </Label>
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
              <p className="text-[9px] opacity-40 uppercase tracking-widest">
                Control the sequence of inquiry.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={addLogicJump}>
              <Plus className="w-3 h-3 mr-2" />
              New Path
            </Button>
          </div>

          {!question.logicJumps || question.logicJumps.length === 0 ? (
            <div className="py-20 text-center border border-muted border-dashed">
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-20">
                Linear sequence maintained
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {(question.logicJumps || []).map((jump) => (
                <div
                  key={jump.id}
                  className="p-8 border border-muted bg-muted/5 space-y-8 relative"
                >
                  <button
                    onClick={() => removeLogicJump(jump.id)}
                    className="absolute top-6 right-6 opacity-20 hover:opacity-100 hover:text-destructive transition-opacity"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>

                  <div className="flex flex-wrap items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-medium">
                    <span className="opacity-20 italic">If input matches</span>
                    <Select
                      value={jump.conditions[0]?.operator || 'equals'}
                      onValueChange={(val) => {
                        const conds = [...jump.conditions];
                        if (conds[0]) conds[0].operator = val as ConditionOperator;
                        else
                          conds.push({
                            id: uuidv4(),
                            questionId: question.id,
                            operator: val as ConditionOperator,
                            value: '',
                          });
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
                        else
                          conds.push({
                            id: uuidv4(),
                            questionId: question.id,
                            operator: 'equals',
                            value: e.target.value,
                          });
                        updateLogicJump(jump.id, { conditions: conds });
                      }}
                      className="h-8 w-[150px] !border-b-muted focus:!border-b-ink italic"
                      placeholder="Value..."
                    />
                    <span className="opacity-20 italic">then jump to</span>
                    <Select
                      value={jump.destinationQuestionId || ''}
                      onValueChange={(val) =>
                        updateLogicJump(jump.id, {
                          action: val === 'end' ? 'end' : 'jump',
                          destinationQuestionId: val === 'end' ? undefined : val,
                        })
                      }
                    >
                      <SelectTrigger className="w-[200px] h-8 rounded-none border-0 border-b border-muted bg-transparent focus:ring-0">
                        <SelectValue placeholder="Target Node" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-muted">
                        <SelectItem value="end">End Narrative</SelectItem>
                        {allQuestions
                          .filter((q) => q.id !== question.id)
                          .map((otherQ, otherIndex) => (
                            <SelectItem
                              key={otherQ.id}
                              value={otherQ.id}
                              className="text-[10px] uppercase tracking-wider"
                            >
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
