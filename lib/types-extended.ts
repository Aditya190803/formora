import { Form, Question } from './types';

// ============================================
// CONDITIONAL LOGIC (v1.1)
// ============================================

export type ConditionOperator = 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';

export interface Condition {
  id: string;
  questionId: string;
  operator: ConditionOperator;
  value: string | number;
}

export interface ConditionalQuestion extends Question {
  conditions?: Condition[];
  showWhenAll?: boolean; // true = AND logic, false = OR logic
  logicJumps?: LogicJump[];
}

export interface LogicJump {
  id: string;
  conditions: Condition[];
  showWhenAll?: boolean;
  action: 'jump' | 'end';
  destinationQuestionId?: string; // If action is jump
}

export interface CalculationRule {
  id: string;
  formula: string; // e.g., "{{q1}} + {{q2}} * 0.1"
  targetQuestionId: string;
}

export interface FormWithLogic extends Form {
  questions: ConditionalQuestion[];
  enableLogic?: boolean;
  calculations?: CalculationRule[];
}

// ============================================
// ANALYTICS (v1.2)
// ============================================

export interface QuestionAnalytics {
  questionId: string;
  questionTitle: string;
  totalAnswers: number;
  dropOffCount: number;
  averageTimeSpent: number; // in seconds
  mostCommonAnswer?: string;
  answerDistribution?: Record<string, number>;
}

export interface FormAnalytics {
  formId: string;
  totalViews: number;
  totalSubmissions: number;
  completionRate: number; // percentage
  averageTimeToComplete: number; // in seconds
  dropOffRate: number; // percentage
  questionsAnalytics: QuestionAnalytics[];
  deviceBreakdown?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  viewsByDate?: Record<string, number>;
  submissionsByDate?: Record<string, number>;
}

export interface FormSessionEvent {
  sessionId: string;
  formId: string;
  eventType: 'view' | 'start' | 'question_viewed' | 'question_answered' | 'submit' | 'abandon';
  questionId?: string;
  timestamp: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  userAgent?: string;
  timeSpent?: number; // in seconds
}

// ============================================
// FORM TEMPLATES (v1.3)
// ============================================

export type TemplateCategory = 'feedback' | 'waitlist' | 'onboarding' | 'contact' | 'survey';

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  recommendedStyle: Form['style'];
  baseForm: Omit<Form, '$id' | 'userId' | 'createdAt' | 'updatedAt'>;
  previewImageUrl?: string;
  tags?: string[];
}

// ============================================
// INTEGRATIONS (v1.4)
// ============================================

export interface WebhookEvent {
  event: 'form_response_submitted' | 'form_published' | 'form_deleted' | 'response_deleted';
  formId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookEndpoint {
  id: string;
  formId: string;
  url: string;
  events: WebhookEvent['event'][];
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

export interface SlackIntegration {
  id: string;
  formId: string;
  webhookUrl: string;
  channel: string;
  notifyOnSubmit: boolean;
  messageTemplate?: string;
  isActive: boolean;
}

export interface EmailNotification {
  id: string;
  formId: string;
  recipientEmail: string;
  notifyOnSubmit: boolean;
  notifyOnAdminEvents?: boolean;
  emailTemplate?: string;
  isActive: boolean;
}

export interface ZapierIntegration {
  id: string;
  formId: string;
  zapierWebhookUrl: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================
// TEAM FEATURES (v2.0)
// ============================================

export type UserRole = 'owner' | 'editor' | 'viewer' | 'analyst';

export interface TeamMember {
  id: string;
  email: string;
  role: UserRole;
  addedAt: string;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  forms: string[]; // array of form IDs
  createdAt: string;
  updatedAt: string;
}

export interface TeamWorkspace {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  forms: string[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  teamId?: string;
  formId?: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'share' | 'remove_member' | 'edit_response';
  resource: 'form' | 'response' | 'team' | 'member';
  resourceId: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  timestamp: string;
}

// ============================================
// ENTERPRISE FEATURES (v3.0)
// ============================================

export interface SSOConfig {
  id: string;
  teamId: string;
  provider: 'saml' | 'oidc';
  isActive: boolean;
  // SAML
  entityId?: string;
  ssoUrl?: string;
  certificate?: string;
  // OIDC
  clientId?: string;
  clientSecret?: string;
  discoveryUrl?: string;
  createdAt: string;
}

export interface CustomDomain {
  id: string;
  teamId: string;
  domain: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: string;
}

export interface WhiteLabelBranding {
  id: string;
  teamId: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customCss?: string;
  footerText?: string;
}

export interface ApiKey {
  id: string;
  teamId: string;
  name: string;
  key: string;
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
}

// ============================================
// SECURITY & COMPLIANCE
// ============================================

export interface RateLimit {
  id: string;
  formId: string;
  ipAddress: string;
  requestCount: number;
  windowResetAt: string;
}

export interface CaptchaConfig {
  id: string;
  formId: string;
  provider: 'recaptcha_v3' | 'hcaptcha';
  enabled: boolean;
  siteKey: string;
  secretKey?: string;
}

export interface GdprRequest {
  id: string;
  userId: string;
  type: 'data_export' | 'data_deletion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
}

// ============================================
// FORM WITH ALL EXTENDED FEATURES
// ============================================

export interface FormFull extends Form {
  slug?: string;
  conditions?: Condition[];
  enableLogic?: boolean;
  templateId?: string;
  template?: FormTemplate;
  analytics?: FormAnalytics;
  webhooks?: WebhookEndpoint[];
  slackIntegration?: SlackIntegration;
  emailNotifications?: EmailNotification[];
  rateLimit?: RateLimit;
  captchaConfig?: CaptchaConfig;
}
