# Formora Features Documentation

## 🔄 Response Storage (FIXED)

**Issue:** Responses were not being stored in the database.

**Solution:** 
- Enhanced the response submission endpoint at `/api/forms/responses/submit`
- Added proper error handling and validation
- Implemented sanitization of user inputs
- Added security checks for rate limiting and spam detection
- Responses are now properly saved to the Appwrite database

**Key Endpoints:**
- `POST /api/forms/responses/submit` - Submit form responses
- `GET /api/forms/:formId/responses` - List all responses for a form
- `GET /api/forms/:formId/responses/count` - Get response count

---

## 📱 Custom Form Slugs (NEW)

Users can now set custom slugs for their forms instead of using auto-generated IDs.

**Features:**
- Custom URL slugs (e.g., `/f/my-feedback-form` instead of `/f/abc123`)
- Slug validation (alphanumeric, 3-100 characters)
- Reserved slug protection
- Real-time slug availability checking

**Files:**
- `lib/slug-utils.ts` - Slug validation and generation utilities
- `app/api/forms/validate-slug/route.ts` - Slug validation endpoint
- `app/api/forms/[formId]/slug/route.ts` - Update form slug endpoint

**Usage:**
```typescript
import { generateSlug, isValidSlug } from '@/lib/slug-utils';

const slug = generateSlug('My Feedback Form'); // 'my-feedback-form'
const valid = isValidSlug('my-form-123'); // true
```

---

## 🎨 Redesigned Form Renderers (NEW)

### Minimalist Renderer V2
- **File:** `components/form-renderers/minimal-renderer-v2.tsx`
- Clean, minimalist design with improved typography
- Underline-style inputs for a modern look
- Smooth focus states with color transitions
- Better spacing and visual hierarchy
- Error messages with icons for clarity

### Marketing Renderer V2
- **File:** `components/form-renderers/marketing-renderer-v2.tsx`
- Full-screen hero section with call-to-action
- Large, engaging typography
- One-question-at-a-time flow with progress bar
- Smooth animations and transitions
- Better mobile responsiveness
- Enhanced visual hierarchy

---

## 🧪 Conditional Logic (V1.1 - IN PROGRESS)

Create dynamic forms that show/hide questions based on user answers.

**Files:**
- `lib/types-extended.ts` - Condition and ConditionalQuestion types
- `lib/services/conditional-logic.ts` - Logic evaluation service
- `components/form-renderers/conditional-questions-renderer.tsx` - Renderer component
- `app/dashboard/forms/[formId]/conditional-logic/page.tsx` - Builder UI

**Features:**
- Show/hide questions based on previous answers
- Multiple condition types: equals, not equals, contains, greater than, less than
- AND/OR logic combinations
- Visual condition builder in form settings

**Example:**
```typescript
const condition: Condition = {
  id: 'cond_123',
  questionId: 'q_1',
  operator: 'equals',
  value: 'option_a',
};

// Shows next question only if q_1 equals "option_a"
const visible = shouldShowQuestion(question, answers);
```

---

## 📊 Analytics & Insights (V1.2 - IN PROGRESS)

Track form performance with detailed analytics.

**Files:**
- `lib/types-extended.ts` - FormAnalytics, QuestionAnalytics types
- `lib/services/analytics.ts` - AnalyticsService for tracking
- `components/form-analytics-dashboard.tsx` - Analytics UI component
- `app/api/forms/[formId]/analytics/route.ts` - Analytics API
- `app/api/forms/[formId]/analytics/events/route.ts` - Event tracking API
- `app/dashboard/forms/[formId]/analytics/page.tsx` - Analytics dashboard page

**Metrics:**
- Total views and submissions
- Completion rate
- Drop-off tracking per question
- Average time to complete
- Device breakdown (mobile, tablet, desktop)
- Time spent per question

**Usage:**
```typescript
import { AnalyticsService } from '@/lib/services/analytics';

AnalyticsService.trackFormView(formId);
AnalyticsService.trackQuestionAnswered(formId, questionId, timeSpent);
AnalyticsService.trackFormSubmit(formId);

// Send events to server
const events = AnalyticsService.getAndClearEvents();
```

---

## 📋 Form Templates (V1.3 - IN PROGRESS)

Pre-built form templates for quick form creation.

**Files:**
- `lib/types-extended.ts` - FormTemplate type
- `lib/services/templates.ts` - Template management service
- `components/form-templates-picker.tsx` - Template selection UI

**Built-in Templates:**
1. **Customer Feedback Form** - Collect feedback with rating and suggestions
2. **Waitlist Signup** - Early access signup form
3. **User Onboarding** - Personalize user experience
4. **Contact Us Form** - Standard contact form
5. **Customer Survey** - Comprehensive survey form

**Usage:**
```typescript
import { getTemplateById, getAllTemplates } from '@/lib/services/templates';

const template = getTemplateById('template_feedback');
const allTemplates = getAllTemplates();
```

---

## 🔗 Integrations (V1.4 - IN PROGRESS)

Connect forms with external services.

### Webhooks
- **File:** `lib/services/webhooks.ts`, `app/api/forms/[formId]/webhooks/route.ts`
- Send form submissions to your webhook endpoint
- Support for multiple event types
- Signature verification for security

### Email Notifications
- **File:** `lib/services/email-notifications.ts`, `app/api/forms/[formId]/integrations/email/route.ts`
- Send email on form submission
- Customizable email templates
- Multiple recipient support

### Slack Integration
- **File:** `lib/services/slack-integration.ts`, `app/api/forms/[formId]/integrations/slack/route.ts`
- Post form submissions to Slack
- Rich message formatting
- Channel customization

**Dashboard Page:** `app/dashboard/forms/[formId]/integrations/page.tsx`

---

## 👥 Team Features (V2.0 - IN PROGRESS)

Collaborate on forms with team members.

**Files:**
- `lib/types-extended.ts` - Team, TeamMember, AuditLog types
- `lib/services/team.ts` - Team management service

**Features:**
- Team workspaces
- Role-based access control (owner, editor, viewer, analyst)
- Member permissions
- Audit logging

**Roles:**
- **Owner:** Full control, manage members
- **Editor:** Create and modify forms
- **Viewer:** View forms and responses
- **Analyst:** View analytics only

---

## 🔒 Security Features (IN PROGRESS)

Protect your forms from abuse and ensure data safety.

**Files:**
- `lib/types-extended.ts` - RateLimit, CaptchaConfig, GdprRequest types
- `lib/services/security.ts` - Security utilities

**Features:**
- Rate limiting per IP address
- CAPTCHA support (reCAPTCHA v3, hCaptcha)
- Spam detection
- Input sanitization
- GDPR compliance tools
- Data export/deletion requests

**Usage:**
```typescript
import { SecurityService } from '@/lib/services/security';

// Sanitize input
const clean = SecurityService.sanitizeInput(userInput);

// Check rate limit
const allowed = SecurityService.checkRateLimit(ipAddress, rateLimits);

// Validate email
const valid = SecurityService.isValidEmail(email);

// Detect spam
const isSpam = SecurityService.isLikelySpam(title, answers);
```

---

## 🚀 Enterprise Features (V3.0 - IN PROGRESS)

Advanced features for enterprise customers.

**Files:**
- `lib/types-extended.ts` - SSO, API Key, CustomDomain types
- `lib/services/enterprise.ts` - Enterprise service

**Features:**
- SSO (SAML, OIDC)
- Custom domains
- White-label branding
- API keys for programmatic access
- SLA support

---

## 🛠️ Developer Guide

### Adding a New Renderer

1. Create file in `components/form-renderers/`
2. Implement the form renderer component
3. Add to the form style type in `lib/types.ts`
4. Update the form display logic in `app/f/[formId]/page.tsx`

### Adding a New Integration

1. Create service in `lib/services/`
2. Create API route(s) in `app/api/forms/[formId]/integrations/`
3. Create UI component in `components/`
4. Add to integrations page

### Adding Analytics Tracking

1. Call `AnalyticsService` methods from client
2. Send events to `/api/forms/[formId]/analytics/events`
3. Fetch analytics from `/api/forms/[formId]/analytics`

---

## 📚 Related Files

- **Type Definitions:** `lib/types.ts`, `lib/types-extended.ts`
- **Appwrite Integration:** `lib/appwrite.ts`
- **Utilities:** `lib/utils.ts`, `lib/slug-utils.ts`
- **Services:** `lib/services/`
- **API Routes:** `app/api/`
- **Components:** `components/`
- **Dashboard:** `app/dashboard/`
- **Public Forms:** `app/f/`
