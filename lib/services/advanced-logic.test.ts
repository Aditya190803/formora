import { describe, it, expect } from 'vitest';
import { evaluateLogicJumps, evaluateCalculations } from './conditional-logic';
import { Question, CalculationRule } from '@/lib/types';

describe('Advanced Logic Service', () => {
  describe('evaluateLogicJumps', () => {
    it('should return null when no logic jumps are defined', () => {
      const question: Question = {
        id: 'q1',
        type: 'short_text',
        title: 'Q1',
        required: true,
      };
      const answers = {};
      expect(evaluateLogicJumps(question, answers)).toBeNull();
    });

    it('should jump to destination when condition is met', () => {
      const question: Question = {
        id: 'q1',
        type: 'multiple_choice',
        title: 'Do you like cats?',
        required: true,
        logicJumps: [
          {
            id: 'jump1',
            action: 'jump',
            destinationQuestionId: 'cat_questions',
            conditions: [
              {
                id: 'c1',
                questionId: 'q1',
                operator: 'equals',
                value: 'yes',
              }
            ]
          }
        ]
      };
      
      expect(evaluateLogicJumps(question, { q1: 'yes' })).toBe('cat_questions');
      expect(evaluateLogicJumps(question, { q1: 'no' })).toBeNull();
    });

    it('should end form when action is end', () => {
      const question: Question = {
        id: 'q1',
        type: 'multiple_choice',
        title: 'Exit now?',
        required: true,
        logicJumps: [
          {
            id: 'jump1',
            action: 'end',
            conditions: [
              {
                id: 'c1',
                questionId: 'q1',
                operator: 'equals',
                value: 'yes',
              }
            ]
          }
        ]
      };
      
      expect(evaluateLogicJumps(question, { q1: 'yes' })).toBe('end');
    });
  });

  describe('evaluateCalculations', () => {
    it('should calculate simple math formulas', () => {
      const calculations: CalculationRule[] = [
        {
          id: 'calc1',
          targetQuestionId: 'total',
          formula: '{{q1}} + {{q2}}',
        }
      ];
      
      const answers = { q1: '10', q2: '20' };
      const result = evaluateCalculations(calculations, answers);
      
      expect(result.total).toBe(30);
    });

    it('should handle complex math', () => {
      const calculations: CalculationRule[] = [
        {
          id: 'calc1',
          targetQuestionId: 'result',
          formula: '({{q1}} + {{q2}}) * {{q3}}',
        }
      ];
      
      const answers = { q1: '2', q2: '3', q3: '10' };
      const result = evaluateCalculations(calculations, answers);
      
      expect(result.result).toBe(50);
    });

    it('should not evaluate if placeholders are missing', () => {
      const calculations: CalculationRule[] = [
        {
          id: 'calc1',
          targetQuestionId: 'result',
          formula: '{{q1}} + {{q2}}',
        }
      ];
      
      const answers = { q1: '2' };
      const result = evaluateCalculations(calculations, answers);
      
      expect(result.result).toBeUndefined();
    });
  });
});
