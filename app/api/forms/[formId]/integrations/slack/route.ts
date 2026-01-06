/**
 * API Route: POST /api/forms/:formId/integrations/slack
 * Manage Slack integrations for forms
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const { webhookUrl, channel } = await request.json();

    if (!webhookUrl || typeof webhookUrl !== 'string') {
      return Response.json(
        { error: 'Slack webhook URL is required' },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(webhookUrl);
    } catch {
      return Response.json(
        { error: 'Invalid webhook URL' },
        { status: 400 }
      );
    }

    // TODO: Validate webhook URL with Slack
    // TODO: Save integration to database

    const integration = {
      id: `slack_${Date.now()}`,
      formId,
      webhookUrl,
      channel: channel || 'default',
      notifyOnSubmit: true,
      isActive: true,
    };

    return Response.json({
      success: true,
      integration,
      message: 'Slack integration created successfully',
    });
  } catch (error) {
    console.error('Slack integration creation error:', error);
    return Response.json(
      { error: 'Failed to create Slack integration' },
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

    // TODO: Fetch Slack integrations from database
    const integrations: unknown[] = [];

    return Response.json({
      success: true,
      integrations,
    });
  } catch (error) {
    console.error('Slack integration fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch Slack integrations' },
      { status: 500 }
    );
  }
}
