/**
 * Conditional Questions Renderer
 * Renders questions conditionally based on previous answers
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { shouldShowQuestion } from '@/lib/services/conditional-logic';
import { ConditionalQuestion } from '@/lib/types-extended';
import { Question } from '@/lib/types';

interface ConditionalQuestionsRendererProps {
  questions: ConditionalQuestion[];
  answers: Record<string, string | string[]>;
  renderQuestion: (question: Question) => React.ReactNode;
}

export function ConditionalQuestionsRenderer({
  questions,
  answers,
  renderQuestion,
}: ConditionalQuestionsRendererProps) {
  const visibleQuestions = questions.filter(q => shouldShowQuestion(q, answers));

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {visibleQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.05 }}
          >
            {renderQuestion(question)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
