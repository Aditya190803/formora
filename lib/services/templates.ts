/**
 * Form Templates Service
 * Manages pre-built form templates for quick form creation
 */

import { FormTemplate, TemplateCategory } from '@/lib/types-extended';

export const formTemplates: FormTemplate[] = [
  {
    id: 'template_feedback',
    name: 'Customer Feedback Form',
    description: 'Collect feedback from customers to improve your product',
    category: 'feedback',
    recommendedStyle: 'conversational',
    baseForm: {
      title: 'Customer Feedback',
      description: 'We value your feedback!',
      style: 'conversational',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          title: 'How satisfied are you with our product?',
          required: true,
          options: [
            { id: 'o1', label: 'Very Satisfied' },
            { id: 'o2', label: 'Satisfied' },
            { id: 'o3', label: 'Neutral' },
            { id: 'o4', label: 'Dissatisfied' },
            { id: 'o5', label: 'Very Dissatisfied' },
          ],
        },
        {
          id: 'q2',
          type: 'long_text',
          title: 'What could we improve?',
          description: 'Please share any suggestions or concerns',
          required: false,
          placeholder: 'Your feedback...',
        },
        {
          id: 'q3',
          type: 'email',
          title: 'Email address',
          description: 'So we can follow up with you',
          required: false,
        },
      ],
      isPublished: false,
      buttonText: 'Submit Feedback',
      primaryColor: '#3b82f6',
    },
    tags: ['feedback', 'customer', 'satisfaction'],
  },
  {
    id: 'template_waitlist',
    name: 'Waitlist Signup',
    description: 'Collect signups for early access or upcoming features',
    category: 'waitlist',
    recommendedStyle: 'marketing',
    baseForm: {
      title: 'Join Our Waitlist',
      description: 'Be the first to know about our upcoming product launch',
      style: 'marketing',
      questions: [
        {
          id: 'q1',
          type: 'short_text',
          title: 'First Name',
          required: true,
        },
        {
          id: 'q2',
          type: 'short_text',
          title: 'Last Name',
          required: true,
        },
        {
          id: 'q3',
          type: 'email',
          title: 'Email Address',
          required: true,
        },
        {
          id: 'q4',
          type: 'multiple_choice',
          title: 'How interested are you?',
          required: true,
          options: [
            { id: 'o1', label: 'Very Interested' },
            { id: 'o2', label: 'Somewhat Interested' },
            { id: 'o3', label: 'Just Curious' },
          ],
        },
      ],
      isPublished: false,
      buttonText: 'Join Waitlist',
      primaryColor: '#ec4899',
    },
    tags: ['waitlist', 'signup', 'launch'],
  },
  {
    id: 'template_onboarding',
    name: 'User Onboarding',
    description: 'Onboard new users and collect their preferences',
    category: 'onboarding',
    recommendedStyle: 'conversational',
    baseForm: {
      title: 'Welcome!',
      description: 'Let us personalize your experience',
      style: 'conversational',
      questions: [
        {
          id: 'q1',
          type: 'short_text',
          title: 'What should we call you?',
          required: true,
          placeholder: 'Your name',
        },
        {
          id: 'q2',
          type: 'multiple_choice',
          title: 'What best describes you?',
          required: true,
          options: [
            { id: 'o1', label: 'Individual' },
            { id: 'o2', label: 'Small Business' },
            { id: 'o3', label: 'Enterprise' },
          ],
        },
        {
          id: 'q3',
          type: 'checkboxes',
          title: 'What features interest you most?',
          required: true,
          options: [
            { id: 'o1', label: 'Analytics' },
            { id: 'o2', label: 'Integrations' },
            { id: 'o3', label: 'Automation' },
            { id: 'o4', label: 'Reporting' },
          ],
        },
      ],
      isPublished: false,
      buttonText: 'Continue',
      primaryColor: '#06b6d4',
    },
    tags: ['onboarding', 'welcome', 'setup'],
  },
  {
    id: 'template_contact',
    name: 'Contact Us Form',
    description: 'Standard contact form for customer inquiries',
    category: 'contact',
    recommendedStyle: 'classic',
    baseForm: {
      title: 'Get In Touch',
      description: 'We\'d love to hear from you',
      style: 'classic',
      questions: [
        {
          id: 'q1',
          type: 'short_text',
          title: 'Name',
          required: true,
        },
        {
          id: 'q2',
          type: 'email',
          title: 'Email',
          required: true,
        },
        {
          id: 'q3',
          type: 'short_text',
          title: 'Subject',
          required: true,
        },
        {
          id: 'q4',
          type: 'long_text',
          title: 'Message',
          required: true,
          placeholder: 'Tell us how we can help...',
        },
      ],
      isPublished: false,
      buttonText: 'Send Message',
      primaryColor: '#3b82f6',
    },
    tags: ['contact', 'inquiry', 'support'],
  },
  {
    id: 'template_survey',
    name: 'Customer Survey',
    description: 'Comprehensive survey to gather detailed insights',
    category: 'survey',
    recommendedStyle: 'classic',
    baseForm: {
      title: 'Customer Survey',
      description: 'Help us serve you better',
      style: 'classic',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          title: 'How often do you use our service?',
          required: true,
          options: [
            { id: 'o1', label: 'Daily' },
            { id: 'o2', label: 'Weekly' },
            { id: 'o3', label: 'Monthly' },
            { id: 'o4', label: 'Rarely' },
          ],
        },
        {
          id: 'q2',
          type: 'number',
          title: 'On a scale of 1-10, how likely are you to recommend us?',
          required: true,
          placeholder: 'Enter a number between 1 and 10',
        },
        {
          id: 'q3',
          type: 'long_text',
          title: 'What is your biggest challenge with our service?',
          required: false,
        },
        {
          id: 'q4',
          type: 'checkboxes',
          title: 'Which features do you use most?',
          required: true,
          options: [
            { id: 'o1', label: 'Feature A' },
            { id: 'o2', label: 'Feature B' },
            { id: 'o3', label: 'Feature C' },
          ],
        },
      ],
      isPublished: false,
      buttonText: 'Submit Survey',
      primaryColor: '#8b5cf6',
    },
    tags: ['survey', 'feedback', 'insights'],
  },
];

export function getTemplatesByCategory(category: TemplateCategory): FormTemplate[] {
  return formTemplates.filter(template => template.category === category);
}

export function getTemplateById(id: string): FormTemplate | undefined {
  return formTemplates.find(template => template.id === id);
}

export function getAllTemplates(): FormTemplate[] {
  return formTemplates;
}

export function searchTemplates(query: string): FormTemplate[] {
  const lowerQuery = query.toLowerCase();
  return formTemplates.filter(
    template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
