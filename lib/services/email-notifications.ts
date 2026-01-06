/**
 * Email Notification Service
 * Handles email notifications for form submissions and events
 */

import { EmailNotification } from '@/lib/types-extended';

export class EmailNotificationService {
  /**
   * Send form submission email
   */
  static async sendSubmissionEmail(
    emailNotification: EmailNotification,
    formTitle: string,
    answers: Record<string, string | string[]>
  ): Promise<boolean> {
    if (!emailNotification.isActive || !emailNotification.notifyOnSubmit) {
      return false;
    }

    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailNotification.recipientEmail,
          type: 'form_submission',
          data: {
            formTitle,
            answers,
            submittedAt: new Date().toISOString(),
          },
          template: emailNotification.emailTemplate,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Create email notification
   */
  static createEmailNotification(
    formId: string,
    recipientEmail: string,
    notifyOnSubmit = true
  ): EmailNotification {
    return {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formId,
      recipientEmail,
      notifyOnSubmit,
      notifyOnAdminEvents: false,
      isActive: true,
    };
  }

  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate default email template
   */
  static getDefaultTemplate(formTitle: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px; }
    .content { margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Form Submission</h1>
    </div>
    <div class="content">
      <p>You received a new submission for: <strong>${formTitle}</strong></p>
      <p>Submitted at: {{submittedAt}}</p>
      <h3>Answers:</h3>
      <pre>{{answers}}</pre>
    </div>
    <div class="footer">
      <p>© {{currentYear}} Formora</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}
