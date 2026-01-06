/**
 * Security Service
 * Handles rate limiting, CAPTCHA, spam detection, and input sanitization
 */

import { RateLimit, CaptchaConfig } from '@/lib/types-extended';

export class SecurityService {
  private static readonly RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
  private static readonly RATE_LIMIT_MAX_REQUESTS = 10;

  /**
   * Check rate limit for IP
   */
  static checkRateLimit(ipAddress: string, rateLimits: RateLimit[]): boolean {
    const now = Date.now();
    const userLimit = rateLimits.find(rl => rl.ipAddress === ipAddress);

    if (!userLimit) {
      return true; // First request
    }

    const windowResetTime = new Date(userLimit.windowResetAt).getTime();

    if (now > windowResetTime) {
      return true; // Window has reset
    }

    return userLimit.requestCount < this.RATE_LIMIT_MAX_REQUESTS;
  }

  /**
   * Update rate limit
   */
  static updateRateLimit(ipAddress: string, rateLimits: RateLimit[]): RateLimit[] {
    const now = Date.now();
    const windowResetTime = new Date(now + this.RATE_LIMIT_WINDOW).toISOString();

    const existingLimit = rateLimits.find(rl => rl.ipAddress === ipAddress);

    if (!existingLimit) {
      return [
        ...rateLimits,
        {
          id: `ratelimit_${Date.now()}`,
          formId: '', // Will be set by caller
          ipAddress,
          requestCount: 1,
          windowResetAt: windowResetTime,
        },
      ];
    }

    const limitWindowTime = new Date(existingLimit.windowResetAt).getTime();
    if (now > limitWindowTime) {
      // Reset the window
      return rateLimits.map(rl =>
        rl.ipAddress === ipAddress
          ? {
              ...rl,
              requestCount: 1,
              windowResetAt: windowResetTime,
            }
          : rl
      );
    }

    return rateLimits.map(rl =>
      rl.ipAddress === ipAddress
        ? {
            ...rl,
            requestCount: rl.requestCount + 1,
          }
        : rl
    );
  }

  /**
   * Sanitize form input
   */
  static sanitizeInput(input: string): string {
    // Remove potentially dangerous characters and tags
    return input
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>\"\']/g, '') // Remove dangerous characters
      .trim();
  }

  /**
   * Sanitize form answers
   */
  static sanitizeAnswers(answers: Record<string, string | string[]>): Record<string, string | string[]> {
    const sanitized: Record<string, string | string[]> = {};

    for (const [key, value] of Object.entries(answers)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(v => this.sanitizeInput(v));
      }
    }

    return sanitized;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Detect spam patterns
   */
  static isLikelySpam(
    input: string,
    answers: Record<string, string | string[]>
  ): boolean {
    const content = (
      input +
      ' ' +
      Object.values(answers)
        .map(v => (Array.isArray(v) ? v.join(' ') : v))
        .join(' ')
    ).toLowerCase();

    // Check for common spam patterns
    const spamPatterns = [
      /viagra|cialis|casino|lottery/gi,
      /\b(http|https):\/\/[^\s]+/g, // URLs
      /click here|buy now|limited offer/gi,
      /\$\d+|cheap|free money/gi,
    ];

    return spamPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Create CAPTCHA config
   */
  static createCaptchaConfig(
    formId: string,
    provider: 'recaptcha_v3' | 'hcaptcha',
    siteKey: string
  ): CaptchaConfig {
    return {
      id: `captcha_${Date.now()}`,
      formId,
      provider,
      enabled: true,
      siteKey,
    };
  }

  /**
   * Verify CAPTCHA token
   */
  static async verifyCaptchaToken(
    captchaConfig: CaptchaConfig,
    token: string
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/captcha/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: captchaConfig.provider,
          token,
          siteKey: captchaConfig.siteKey,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('CAPTCHA verification failed:', error);
      return false;
    }
  }
}
