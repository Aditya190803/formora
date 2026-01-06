# Formora

### Forms that adapt to your intent, not the other way around.

Formora is a next-generation form builder focused on experience-first design. Unlike traditional form tools that offer shallow theming, Formora allows users to choose distinct form styles that fundamentally change how a form looks, feels, and behaves — while keeping the underlying data structure the same.

---

## ✨ Key Features

### 🎨 Style-First Experience
- **Minimalist Renderer**: Clean typography, underline-style inputs, and modern aesthetic.
- **Marketing Renderer**: High-conversion landing page style with hero sections and progress bars.
- **Conversational Renderer**: One-at-a-time question flow for higher engagement.
- **Neo-Brutalism**: Bold, high-contrast, and unique design language.

### 🧠 Intelligence & Logic
- **Conditional Logic (V1.1)**: Show/hide questions based on user responses with support for complex AND/OR logic.
- **Advanced Logic Evaluation**: Built-in service to handle dynamic form states.

### 📊 Powerful Analytics (V1.2)
- **Detailed Insights**: Track views, submissions, completion rates, and drop-off points.
- **Question-Level Data**: Understand where users get stuck.
- **Device & Interaction**: Track how users interact with your forms across different platforms.

### 🔗 Robust Integrations (V1.4)
- **Webhooks**: Connect your form data to any external service.
- **Slack Notifications**: Get real-time alerts for new submissions.
- **Email Notifications**: Keep your team or users informed automatically.

### 🛠️ Developer & Power User Tools
- **Custom Slugs**: User-friendly URLs (e.g., `/f/my-feedback-form`).
- **Templating System**: 5+ pre-built templates for common use cases (Feedback, Waitlists, Onboarding).
- **Security First**: Built-in rate limiting, spam detection, and input sanitization.

### 🏢 Enterprise Ready (V3.0)
- **Team Collaboration**: Roles, permissions, and shared workspaces.
- **SSO & Custom Domains**: Support for advanced security and branding needs.
- **Audit Logs & Security**: Detailed tracking for compliance.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Appwrite Instance
- Environment variables configured (see `.env.example`)

### Installation & Development

```bash
# Install dependencies
npm install

# Setup Appwrite
./scripts/setup-appwrite-cli.sh

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI
- **Backend & DB**: Appwrite (Database, Storage, Functions)
- **Auth**: Stack Auth / Appwrite Auth
- **Testing**: Vitest, Playwright
- **Analytics**: Custom-built session tracking service

---

## 📂 Project Structure

- `app/`: Next.js application routes and pages
- `components/`: Reusable UI components and form renderers
- `lib/`: Business logic, services (Logic, Analytics, Team, etc.) and type definitions
- `scripts/`: Devops and initialization scripts
- `tests/`: E2E and unit tests

---

## 📄 Documentation

- [Formora PRD](Formora_PRD.md): Product vision and requirements.
- [Features Documentation](FEATURES.md): In-depth look at implemented features.
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md): Technical breakdown of the build.

---

Built with ❤️ by the Formora Team.
