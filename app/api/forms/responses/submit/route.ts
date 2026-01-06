/**
 * API Route: POST /api/forms/responses/submit
 * Handles form response submission
 */

import { formsService, isAppwriteConfigured } from '@/lib/appwrite';
import { databases as serverDatabases, DATABASE_ID, RESPONSES_COLLECTION_ID, ID, Query } from '@/lib/appwrite-server';
import { SecurityService } from '@/lib/services/security';
import { AnalyticsService } from '@/lib/services/analytics';

export async function POST(request: Request) {
  try {
    if (!isAppwriteConfigured()) {
      return Response.json(
        { error: 'Server is not configured properly' },
        { status: 500 }
      );
    }

    const { formId, answers } = await request.json();

    // Validation
    if (!formId || typeof formId !== 'string') {
      return Response.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== 'object') {
      return Response.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Get the form to verify it exists and is published
    const form = await formsService.getById(formId);
    if (!form) {
      return Response.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    if (!form.isPublished) {
      return Response.json(
        { error: 'Form is not published' },
        { status: 403 }
      );
    }

    // Get client IP for rate limiting and 1-response check
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : (request.headers.get('x-real-ip') || 'unknown');

    // Check if form limits to one response
    if (form.limitOneResponse) {
      const existingResponses = await serverDatabases.listDocuments(
        DATABASE_ID,
        RESPONSES_COLLECTION_ID,
        [
          Query.equal('formId', formId),
          Query.equal('ipAddress', clientIp),
          Query.limit(1)
        ]
      );
      
      if (existingResponses.total > 0 && clientIp !== 'unknown') {
        return Response.json(
          { error: 'You have already submitted a response to this form.' },
          { status: 403 }
        );
      }
    }

    // TODO: Implement rate limiting check
    // if (!SecurityService.checkRateLimit(clientIp, [])) {
    //   return Response.json(
    //     { error: 'Too many requests. Please try again later.' },
    //     { status: 429 }
    //   );
    // }

    // Sanitize answers
    const sanitizedAnswers = SecurityService.sanitizeAnswers(answers);

    // Check for spam
    if (SecurityService.isLikelySpam(form.title, sanitizedAnswers)) {
      console.warn(`Potential spam submission for form ${formId}`);
      // Still save it but log it
    }

    // Validate email fields if present
    for (const [questionId, answer] of Object.entries(sanitizedAnswers)) {
      const question = form.questions.find(q => q.id === questionId);
      if (question?.type === 'email' && typeof answer === 'string') {
        if (!SecurityService.isValidEmail(answer)) {
          return Response.json(
            { error: `Invalid email in field: ${question.title}` },
            { status: 400 }
          );
        }
      }
    }

    // Save the response using server client
    const response = await serverDatabases.createDocument(
      DATABASE_ID,
      RESPONSES_COLLECTION_ID,
      ID.unique(),
      {
        formId,
        answers: JSON.stringify(sanitizedAnswers),
        ipAddress: clientIp,
        submittedAt: new Date().toISOString(),
      }
    );

    // Track analytics
    AnalyticsService.trackFormSubmit(formId);

    return Response.json({
      success: true,
      responseId: response.$id,
      message: 'Response submitted successfully',
    });
  } catch (error) {
    console.error('Response submission error:', error);
    return Response.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}
