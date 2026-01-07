import { QuestionType, FormStyle } from '@/lib/types';
import {
  FileText,
  MessageSquare,
  Megaphone,
  Zap,
  Minus,
  Type,
  Layout,
  List,
  CheckSquare,
  Settings2,
  Mail,
  Hash,
} from 'lucide-react';

export interface QuestionTypeOption {
  value: QuestionType;
  label: string;
  icon: React.ElementType;
}

export const questionTypes: QuestionTypeOption[] = [
  { value: 'short_text', label: 'Short Text', icon: Type },
  { value: 'long_text', label: 'Long Text', icon: Layout },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: List },
  { value: 'checkboxes', label: 'Checkboxes', icon: CheckSquare },
  { value: 'dropdown', label: 'Dropdown', icon: Settings2 },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'number', label: 'Number', icon: Hash },
];

export const styleIcons: Record<FormStyle, React.ElementType> = {
  classic: FileText,
  conversational: MessageSquare,
  marketing: Megaphone,
  neo_brutalism: Zap,
  minimal: Minus,
};

export const formStyles: FormStyle[] = ['classic', 'conversational', 'marketing', 'neo_brutalism', 'minimal'];

export const fontFamilies = [
  { value: 'sans', label: 'Sans Serif (Inter)' },
  { value: 'serif', label: 'Serif (Playfair)' },
  { value: 'mono', label: 'Monospace (JetBrains)' },
  { value: 'heading', label: 'Heading (Impact Style)' },
];
