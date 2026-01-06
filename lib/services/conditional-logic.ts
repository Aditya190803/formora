/**
 * Conditional Logic Service
 * Handles form logic with conditional questions and skip logic
 */

import { Condition, Question as ConditionalQuestion, ConditionOperator, LogicJump, CalculationRule } from '@/lib/types';

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

/**
 * Evaluates logic jumps for a question based on current answers
 * Returns the destination question ID or 'end' if a jump condition is met, null otherwise
 */
export function evaluateLogicJumps(
  question: ConditionalQuestion,
  answers: Record<string, string | string[]>
): string | 'end' | null {
  if (!question.logicJumps || question.logicJumps.length === 0) {
    return null;
  }

  for (const jump of question.logicJumps) {
    const results = jump.conditions.map(condition => evaluateCondition(condition, answers));
    const isMet = jump.showWhenAll ? results.every(r => r) : results.some(r => r);

    if (isMet) {
      return jump.action === 'end' ? 'end' : jump.destinationQuestionId || null;
    }
  }

  return null;
}

/**
 * Calculates values for fields based on calculation rules
 */
export function evaluateCalculations(
  calculations: CalculationRule[],
  answers: Record<string, string | string[]>
): Record<string, string | number> {
  const newAnswers: Record<string, string | number> = {};

  for (const calc of calculations) {
    let formula = calc.formula;
    
    // Replace placeholders like {{questionId}} with values
    const placeholders = formula.match(/\{\{([^}]+)\}\}/g) || [];
    let canEvaluate = true;

    for (const placeholder of placeholders) {
      const qId = placeholder.slice(2, -2);
      const val = answers[qId];
      
      if (val === undefined || val === null || val === '') {
        canEvaluate = false;
        break;
      }
      
      formula = formula.replace(placeholder, String(val));
    }

    if (canEvaluate) {
      try {
        // Basic safe evaluation (only allow simple math)
        // In a real app, use a proper expression parser library
        const result = eval(formula.replace(/[^0-9+\-*/(). ]/g, ''));
        newAnswers[calc.targetQuestionId] = result;
      } catch (e) {
        console.error('Calculation error:', e);
      }
    }
  }

  return newAnswers;
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
