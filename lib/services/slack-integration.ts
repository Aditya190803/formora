/**
 * Slack Integration Service
 * Handles Slack notifications for form submissions
 */

import { SlackIntegration } from '@/lib/types-extended';

export class SlackIntegrationService {
  /**
   * Send Slack notification on form submission
   */
  static async sendSlackNotification(
    integration: SlackIntegration,
    formTitle: string,
    answers: Record<string, string | string[]>
  ): Promise<boolean> {
    if (!integration.isActive || !integration.notifyOnSubmit) {
      return false;
    }

    try {
      const message = this.buildSlackMessage(formTitle, answers, integration.messageTemplate);
      
      const response = await fetch(integration.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
      return false;
    }
  }

  /**
   * Build Slack message
   */
  private static buildSlackMessage(
    formTitle: string,
    answers: Record<string, string | string[]>,
    customTemplate?: string
  ): Record<string, unknown> {
    if (customTemplate) {
      // Use custom template if provided
      return JSON.parse(
        customTemplate
          .replace('{{formTitle}}', formTitle)
          .replace('{{answers}}', JSON.stringify(answers, null, 2))
          .replace('{{timestamp}}', new Date().toISOString())
      );
    }

    // Default message format
    const fields = Object.entries(answers).map(([key, value]) => ({
      title: key,
      value: Array.isArray(value) ? value.join(', ') : String(value),
      short: true,
    }));

    return {
      text: `New submission for: ${formTitle}`,
      attachments: [
        {
          color: '#3b82f6',
          fields: [
            {
              title: 'Form',
              value: formTitle,
              short: false,
            },
            {
              title: 'Submitted At',
              value: new Date().toISOString(),
              short: false,
            },
            ...fields,
          ],
        },
      ],
    };
  }

  /**
   * Validate Slack webhook URL
   */
  static async validateWebhookUrl(webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Slack webhook verification test',
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Create Slack integration
   */
  static createSlackIntegration(
    formId: string,
    webhookUrl: string,
    channel: string
  ): SlackIntegration {
    return {
      id: `slack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formId,
      webhookUrl,
      channel,
      notifyOnSubmit: true,
      isActive: true,
    };
  }
}
