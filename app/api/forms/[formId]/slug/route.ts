/**
 * API Route: POST /api/forms/:formId/slug
 * Update form slug
 */

import { formsService, isAppwriteConfigured } from '@/lib/appwrite';
import { isValidSlug, isReservedSlug } from '@/lib/slug-utils';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    if (!isAppwriteConfigured()) {
      return Response.json(
        { error: 'Server is not configured properly' },
        { status: 500 }
      );
    }

    const { slug } = await request.json();

    if (!slug || typeof slug !== 'string') {
      return Response.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!isValidSlug(slug)) {
      return Response.json(
        { error: 'Invalid slug format (must be 3-100 lowercase alphanumeric characters with hyphens)' },
        { status: 400 }
      );
    }

    // Check if slug is reserved
    if (isReservedSlug(slug)) {
      return Response.json(
        { error: 'This slug is reserved and cannot be used' },
        { status: 400 }
      );
    }

    // TODO: Check if slug already exists in database
    // For now, allow it

    // Update the form
    const form = await formsService.getById(formId);
    if (!form) {
      return Response.json(
        { error: 'Form not found' },
        { status: 404 }
      );
    }

    const updatedForm = await formsService.update(formId, { slug });

    return Response.json({
      success: true,
      form: updatedForm,
      message: 'Slug updated successfully',
    });
  } catch (error) {
    console.error('Slug update error:', error);
    return Response.json(
      { error: 'Failed to update slug' },
      { status: 500 }
    );
  }
}
