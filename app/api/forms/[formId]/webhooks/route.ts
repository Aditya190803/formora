/**
 * API Route: POST /api/forms/:formId/webhooks
 * Manage webhooks for forms
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const { url, events } = await request.json();

    if (!url || !Array.isArray(events) || events.length === 0) {
      return Response.json(
        { error: 'URL and events array are required' },
        { status: 400 }
      );
    }

    // TODO: Validate and save webhook endpoint
    const webhook = {
      id: `webhook_${Date.now()}`,
      formId,
      url,
      events,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return Response.json({
      success: true,
      webhook,
      message: 'Webhook created successfully',
    });
  } catch (error) {
    console.error('Webhook creation error:', error);
    return Response.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    await params;

    // TODO: Fetch webhooks from database
    const webhooks: unknown[] = [];

    return Response.json({
      success: true,
      webhooks,
    });
  } catch (error) {
    console.error('Webhook fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}
