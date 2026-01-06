/**
 * Conditional Logic Builder Page
 * /dashboard/forms/[formId]/conditional-logic
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { ConditionalQuestion } from '@/lib/types-extended';

export default function ConditionalLogicPage() {
  const [enableLogic, setEnableLogic] = useState(false);
  const [questions] = useState<ConditionalQuestion[]>([]);

  const handleAddCondition = (_questionId: string) => {
    // TODO: Implement condition addition
  };

  const handleRemoveCondition = (_questionId: string, _conditionId: string) => {
    // TODO: Implement condition removal
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Conditional Logic</h1>
        <p className="text-muted-foreground mt-2">
          Show or hide questions based on user answers
        </p>
      </div>

      {/* Enable Logic */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enable Conditional Logic</CardTitle>
          <CardDescription>
            Use conditions to create dynamic forms that adapt to user responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Checkbox
              id="enable-logic"
              checked={enableLogic}
              onCheckedChange={(checked) => setEnableLogic(checked as boolean)}
            />
            <Label htmlFor="enable-logic" className="font-normal cursor-pointer">
              Enable conditional logic for this form
            </Label>
          </div>
        </CardContent>
      </Card>

      {!enableLogic ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3 text-muted-foreground">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                Enable conditional logic above to start adding conditions to your form questions.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Conditions</CardTitle>
              <CardDescription>
                Select a question to add conditions for when it should be shown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions.length > 0 ? (
                questions.map(question => (
                  <div
                    key={question.id}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <h4 className="font-medium">{question.title}</h4>

                    {question.conditions && question.conditions.length > 0 ? (
                      <div className="space-y-3">
                        {question.conditions.map(condition => (
                          <div
                            key={condition.id}
                            className="flex items-center justify-between bg-muted p-3 rounded-lg"
                          >
                            <span className="text-sm">
                              When <strong>{condition.questionId}</strong> {condition.operator} <strong>{condition.value}</strong>
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCondition(question.id, condition.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No conditions set for this question yet
                      </p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCondition(question.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Condition
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No questions available. Create a form first.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condition Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>When this question...</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a question" />
                    </SelectTrigger>
                    <SelectContent>
                      {questions.map(q => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>...is...</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select condition" />
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

                <div>
                  <Label>...this value</Label>
                  <Input
                    placeholder="Enter value"
                    className="mt-2"
                  />
                </div>
              </div>

              <Button className="w-full">Add This Condition</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
