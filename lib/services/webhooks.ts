/**
 * Webhook Service
 * Manages webhooks for form events
 */

import { WebhookEndpoint, WebhookEvent } from '@/lib/types-extended';

export class WebhookService {
  /**
   * Trigger a webhook event
   */
  static async triggerWebhook(
    endpoint: WebhookEndpoint,
    event: WebhookEvent
  ): Promise<boolean> {
    try {
      // Check if endpoint handles this event type
      if (!endpoint.events.includes(event.event)) {
        return false;
      }

      if (!endpoint.isActive) {
        return false;
      }

      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event.event,
          'X-Webhook-Signature': this.generateSignature(event),
        },
        body: JSON.stringify(event),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to trigger webhook:', error);
      return false;
    }
  }

  /**
   * Generate webhook signature for verification
   */
  private static generateSignature(event: WebhookEvent): string {
    const payload = JSON.stringify(event);
    // In production, use HMAC with a shared secret
    return Buffer.from(payload).toString('base64');
  }

  /**
   * Validate webhook URL
   */
  static async validateWebhookUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'webhook.test',
          timestamp: new Date().toISOString(),
        }),
      });
      return response.ok || response.status === 400; // Accept if endpoint exists
    } catch {
      return false;
    }
  }

  /**
   * Create webhook endpoint
   */
  static createWebhookEndpoint(
    formId: string,
    url: string,
    events: WebhookEvent['event'][]
  ): WebhookEndpoint {
    return {
      id: `webhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      formId,
      url,
      events,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
  }
}
