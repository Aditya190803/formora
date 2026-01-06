/**
 * API Route: POST /api/forms/validate-slug
 * Validates and checks if a slug is available
 */

import { databases as serverDatabases, Query, DATABASE_ID, FORMS_COLLECTION_ID } from '@/lib/appwrite-server';

export async function POST(request: Request) {
  try {
    const { slug, currentFormId } = await request.json();

    if (!DATABASE_ID || !FORMS_COLLECTION_ID) {
      console.error('Missing Appwrite configuration (DATABASE_ID or FORMS_COLLECTION_ID)');
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validation
    if (!slug || typeof slug !== 'string') {
      return Response.json(
        { error: 'Slug is required and must be a string' },
        { status: 400 }
      );
    }

    // Check slug format (basic validation)
    const slugRegex = /^[a-z0-9]([a-z0-9-]{1,98}[a-z0-9])?$/;
    if (!slugRegex.test(slug)) {
      return Response.json(
        { error: 'Slug must be lowercase alphanumeric with hyphens (3-100 characters)' },
        { status: 400 }
      );
    }

    // Reserved slugs
    const reserved = [
      'api',
      'admin',
      'dashboard',
      'settings',
      'auth',
      'login',
      'signup',
      'logout',
      'forgot-password',
      'reset-password',
      'verify-email',
      'new',
      'edit',
      'delete',
      'preview',
      'public',
      'static',
      'images',
      'styles',
      'scripts',
      'fonts',
    ];

    if (reserved.includes(slug.toLowerCase())) {
      return Response.json(
        { error: 'This slug is reserved and cannot be used' },
        { status: 400 }
      );
    }

    // Check if slug exists in database
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      FORMS_COLLECTION_ID,
      [
        Query.equal('slug', slug),
        Query.limit(1)
      ]
    );

    if (response.documents.length > 0) {
      const existingForm = response.documents[0];
      // If it's the current form, it's fine
      if (currentFormId && existingForm.$id === currentFormId) {
        return Response.json({
          available: true,
          slug,
        });
      }

      return Response.json(
        { error: 'This slug is already taken' },
        { status: 400 }
      );
    }

    return Response.json({
      available: true,
      slug,
    });
  } catch (error) {
    console.error('Slug validation error:', error);
    return Response.json(
      { error: 'Failed to validate slug' },
      { status: 500 }
    );
  }
}
