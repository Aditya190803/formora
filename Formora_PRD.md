# ✨ Project Name: **Formora**
### Tagline: *Forms that adapt to your intent, not the other way around.*

---

# Product Requirements Document (PRD)

## 1. Product Overview

**Formora** is a next-generation form builder focused on experience-first design.  
Unlike traditional form tools that offer shallow theming, Formora allows users to choose **distinct form styles** that fundamentally change how a form looks, feels, and behaves — while keeping the underlying data structure the same.

**Core Value Proposition:**  
> Build once. Choose how it feels.

---

## 2. Problem Statement

Existing form builders suffer from:
- Generic, boring UI
- Overwhelming configuration panels
- Shallow customization (themes instead of experiences)
- Poor alignment between form intent and design

Users want:
- Forms that match context (marketing, ops, onboarding)
- Minimal setup time
- Clean, modern UI
- Flexibility without complexity

---

## 3. Target Users

### Primary Users (MVP)
- Indie hackers & startups
- Creators & marketers
- Product teams creating onboarding or feedback flows

### Secondary Users
- Internal teams (HR, education, operations)

---

## 4. Goals & Success Metrics

### Product Goals
- Enable fast form creation with high-quality UX
- Increase form completion rates through better design
- Make form styling a strategic choice, not a design chore

### Success Metrics
- Time to first published form < 5 minutes
- Form completion rate higher than Google Forms baseline
- % of users switching form styles
- Qualitative feedback referencing design/experience

---

## 5. Core Product Principles

1. Opinionated over flexible
2. Few excellent styles over many mediocre ones
3. Users choose experiences, not design elements
4. Performance and clarity first

---

## 6. Core Features (MVP)

### 6.1 Form Builder

- Create, edit, delete forms
- Question types:
  - Short text
  - Long text
  - Multiple choice
  - Checkboxes
  - Dropdown
  - Email
  - Number
- Required/optional toggle
- Form title & description
- Question helper text

---

### 6.2 Style System (Key Differentiator)

Styles affect:
- Layout
- Flow
- Spacing
- Typography hierarchy
- Interaction patterns
- Animations

#### Initial Styles (MVP)

##### 1. Classic / Utility
**Use case:** Internal tools, education, ops  
- All questions on one page
- Minimal styling
- Fast scrolling
- No animations

##### 2. Conversational
**Use case:** Onboarding, lead capture, feedback  
- One question at a time
- Keyboard-first navigation
- Smooth transitions
- Progress indicator

##### 3. Marketing / Branded
**Use case:** Landing pages, creators, startups  
- Hero section
- Large typography
- Optional background image or gradient
- CTA-focused submit action

---

### 6.3 Style Switching

- Instantly switch between styles
- Same questions, different presentation
- No data loss
- Live preview

---

### 6.4 Sharing & Embedding

- Public shareable link
- Mobile responsive by default
- Basic iframe embed support

---

### 6.5 Responses & Data

- Dashboard response view
- Table layout
- CSV export
- Email notifications on submission

---

## 7. Out of Scope (MVP)

- Advanced conditional logic
- Payments
- Automations
- Team collaboration
- Enterprise compliance features
- Excessive theming options

---

## 8. Technical Considerations (High-Level)

- Decouple form schema from presentation
- Component-based style renderer
- Performance-first rendering (especially conversational mode)
- Secure data handling

---

## 9. Future Scope

### 9.1 Advanced Logic
- Conditional questions
- Skip logic
- Dynamic paths

---

### 9.2 Analytics
- Drop-off tracking
- Completion rate by style
- Time spent per question

---

### 9.3 Templates
- Feedback form
- Waitlist signup
- User onboarding
- Each template auto-selects a recommended style

---

### 9.4 Custom HTML / CSS / JS (Advanced / Pro Feature)

**Decision:** Yes, but post-MVP only.

#### Rationale
- Enables deep branding
- Attracts power users and developers
- Prevents churn to custom-built solutions

#### Constraints
- Pro-only feature
- Clear security sandboxing
- Optional CSS overrides
- Limited JS hooks (onLoad, onSubmit)
- HTML content blocks (non-question)

---

## 10. Monetization (Initial Direction)

- Free Tier:
  - Limited forms
  - Formora branding

- Paid Tier:
  - Unlimited forms
  - Branding removal
  - Access to all styles
  - Advanced features (future)

---

## 11. MVP Definition of Done

- Form builder functional
- Three opinionated styles implemented
- Style switching enabled
- Public sharing live
- Response collection working

---

## 12. Summary

Formora reimagines forms as experiences rather than utilities.  
By anchoring design decisions to intent and interaction style, it aims to become the go-to tool for creators and teams who care how their forms feel — not just what they collect.

