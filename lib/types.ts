export type QuestionType = 
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'checkboxes'
  | 'dropdown'
  | 'email'
  | 'number';

export type FormStyle = 'classic' | 'conversational' | 'marketing' | 'neo_brutalism' | 'minimal';

export interface QuestionOption {
  id: string;
  label: string;
}

export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';

export interface Condition {
  id: string;
  questionId: string;
  operator: ConditionOperator;
  value: string | number;
}

export interface LogicJump {
  id: string;
  conditions: Condition[];
  showWhenAll?: boolean;
  action: 'jump' | 'end';
  destinationQuestionId?: string;
}

export interface CalculationRule {
  id: string;
  formula: string;
  targetQuestionId: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  // Logic fields
  conditions?: Condition[];
  showWhenAll?: boolean;
  logicJumps?: LogicJump[];
  calculations?: CalculationRule[];
}

export interface Form {
  $id?: string;
  userId: string;
  title: string;
  description?: string;
  style: FormStyle;
  questions: Question[];
  isPublished: boolean;
  collaborators?: string[]; 
  primaryColor?: string;
  buttonText?: string;
  slug?: string; 
  limitOneResponse?: boolean; 
  fontFamily?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
  animationSpeed?: number;
  calculations?: CalculationRule[]; // Global calculations
  createdAt?: string;
  updatedAt?: string;
}

export interface FormResponse {
  $id?: string;
  formId: string;
  answers: Record<string, string | string[]>;
  ipAddress?: string; // For backend enforcement of 1 response
  submittedAt: string;
}

export const questionTypeLabels: Record<QuestionType, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text',
  multiple_choice: 'Multiple Choice',
  checkboxes: 'Checkboxes',
  dropdown: 'Dropdown',
  email: 'Email',
  number: 'Number',
};

export const styleLabels: Record<FormStyle, { name: string; description: string }> = {
  classic: {
    name: 'Classic',
    description: 'All questions on one page, minimal styling, fast scrolling',
  },
  conversational: {
    name: 'Conversational',
    description: 'One question at a time with smooth transitions',
  },
  marketing: {
    name: 'Marketing',
    description: 'Hero section, large typography, CTA-focused',
  },
  neo_brutalism: {
    name: 'Neo-Brutalism',
    description: 'Bold borders, high contrast, and vibrant colors',
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean, simple, and focused on content',
  },
};
