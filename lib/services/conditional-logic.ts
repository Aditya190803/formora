/**
 * Conditional Logic Service
 * Handles form logic with conditional questions and skip logic
 */

import { Condition, ConditionalQuestion, ConditionOperator } from '@/lib/types-extended';

export function evaluateCondition(
  condition: Condition,
  answers: Record<string, string | string[]>
): boolean {
  const answerValue = answers[condition.questionId];
  
  if (answerValue === undefined || answerValue === null) {
    return false;
  }

  const stringValue = Array.isArray(answerValue) ? answerValue.join(',') : String(answerValue);
  const numericValue = Number(answerValue);
  const conditionValue = String(condition.value);

  switch (condition.operator) {
    case 'equals':
      return stringValue === conditionValue;
    case 'not_equals':
      return stringValue !== conditionValue;
    case 'contains':
      return stringValue.includes(conditionValue);
    case 'not_contains':
      return !stringValue.includes(conditionValue);
    case 'greater_than':
      return !isNaN(numericValue) && numericValue > Number(condition.value);
    case 'less_than':
      return !isNaN(numericValue) && numericValue < Number(condition.value);
    default:
      return false;
  }
}

export function shouldShowQuestion(
  question: ConditionalQuestion,
  answers: Record<string, string | string[]>
): boolean {
  if (!question.conditions || question.conditions.length === 0) {
    return true;
  }

  const results = question.conditions.map(condition => evaluateCondition(condition, answers));
  
  // Use AND logic (showWhenAll = true) or OR logic (showWhenAll = false)
  return question.showWhenAll ? results.every(r => r) : results.some(r => r);
}

export function getVisibleQuestions(
  questions: ConditionalQuestion[],
  answers: Record<string, string | string[]>
): ConditionalQuestion[] {
  return questions.filter(question => shouldShowQuestion(question, answers));
}

export function createCondition(
  questionId: string,
  operator: ConditionOperator,
  value: string | number
): Condition {
  return {
    id: `cond_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    questionId,
    operator,
    value,
  };
}

export function validateCondition(condition: Condition): boolean {
  const validOperators: ConditionOperator[] = [
    'equals',
    'not_equals',
    'contains',
    'not_contains',
    'greater_than',
    'less_than',
  ];
  
  return (
    Boolean(condition.questionId) &&
    validOperators.includes(condition.operator) &&
    condition.value !== undefined &&
    condition.value !== null &&
    String(condition.value).length > 0
  );
}
