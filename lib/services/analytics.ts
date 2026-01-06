/**
 * Analytics Service
 * Tracks form views, submissions, drop-offs, and user behavior
 */

import { FormSessionEvent } from '@/lib/types-extended';

export class AnalyticsService {
  private static readonly SESSION_STORAGE_KEY = 'form_session_id';
  private static readonly EVENT_STORAGE_KEY = 'form_events';

  /**
   * Generate or retrieve a session ID
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  }

  /**
   * Track a form view
   */
  static trackFormView(formId: string): void {
    this.trackEvent({
      sessionId: this.getSessionId(),
      formId,
      eventType: 'view',
      timestamp: new Date().toISOString(),
      deviceType: this.getDeviceType(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
  }

  /**
   * Track when user starts filling the form
   */
  static trackFormStart(formId: string): void {
    this.trackEvent({
      sessionId: this.getSessionId(),
      formId,
      eventType: 'start',
      timestamp: new Date().toISOString(),
      deviceType: this.getDeviceType(),
    });
  }

  /**
   * Track when a question is viewed
   */
  static trackQuestionViewed(formId: string, questionId: string): void {
    this.trackEvent({
      sessionId: this.getSessionId(),
      formId,
      eventType: 'question_viewed',
      questionId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track when a question is answered
   */
  static trackQuestionAnswered(formId: string, questionId: string, timeSpent: number): void {
    this.trackEvent({
      sessionId: this.getSessionId(),
      formId,
      eventType: 'question_answered',
      questionId,
      timestamp: new Date().toISOString(),
      timeSpent,
    });
  }

  /**
   * Track form submission
   */
  static trackFormSubmit(formId: string): void {
    this.trackEvent({
      sessionId: this.getSessionId(),
      formId,
      eventType: 'submit',
      timestamp: new Date().toISOString(),
      deviceType: this.getDeviceType(),
    });
  }

  /**
   * Track form abandonment
   */
  static trackFormAbandon(formId: string): void {
    this.trackEvent({
      sessionId: this.getSessionId(),
      formId,
      eventType: 'abandon',
      timestamp: new Date().toISOString(),
      deviceType: this.getDeviceType(),
    });
  }

  /**
   * Store event locally (to be sent to server)
   */
  private static trackEvent(event: FormSessionEvent): void {
    if (typeof window === 'undefined') return;
    
    const events = JSON.parse(localStorage.getItem(this.EVENT_STORAGE_KEY) || '[]');
    events.push(event);
    localStorage.setItem(this.EVENT_STORAGE_KEY, JSON.stringify(events));
  }

  /**
   * Get and clear stored events
   */
  static getAndClearEvents(): FormSessionEvent[] {
    if (typeof window === 'undefined') return [];
    
    const events = JSON.parse(localStorage.getItem(this.EVENT_STORAGE_KEY) || '[]');
    localStorage.removeItem(this.EVENT_STORAGE_KEY);
    return events;
  }

  /**
   * Get device type
   */
  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(userAgent)) return 'mobile';
    if (/ipad|tablet|kindle/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  /**
   * Calculate completion rate
   */
  static calculateCompletionRate(
    submissions: number,
    views: number
  ): number {
    if (views === 0) return 0;
    return Math.round((submissions / views) * 100);
  }

  /**
   * Calculate drop-off rate
   */
  static calculateDropOffRate(
    views: number,
    submissions: number
  ): number {
    if (views === 0) return 0;
    return Math.round(((views - submissions) / views) * 100);
  }

  /**
   * Calculate average time to complete
   */
  static calculateAverageTimeToComplete(events: FormSessionEvent[]): number {
    const completionTimes: number[] = [];
    const sessionMap = new Map<string, FormSessionEvent[]>();

    // Group events by session
    events.forEach(event => {
      if (!sessionMap.has(event.sessionId)) {
        sessionMap.set(event.sessionId, []);
      }
      sessionMap.get(event.sessionId)!.push(event);
    });

    // Calculate time for each completed session
    sessionMap.forEach((sessionEvents) => {
      const startEvent = sessionEvents.find(e => e.eventType === 'start' || e.eventType === 'view');
      const submitEvent = sessionEvents.find(e => e.eventType === 'submit');

      if (startEvent && submitEvent) {
        const startTime = new Date(startEvent.timestamp).getTime();
        const endTime = new Date(submitEvent.timestamp).getTime();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        if (duration > 0) {
          completionTimes.push(duration);
        }
      }
    });

    if (completionTimes.length === 0) return 0;
    return Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length);
  }
}
