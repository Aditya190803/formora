/**
 * API Route: POST /api/forms/:formId/integrations/email
 * Manage email notifications for forms
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const { recipientEmail, notifyOnSubmit } = await request.json();

    if (!recipientEmail || typeof recipientEmail !== 'string') {
      return Response.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return Response.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // TODO: Save email notification to database
    const notification = {
      id: `email_${Date.now()}`,
      formId,
      recipientEmail,
      notifyOnSubmit: notifyOnSubmit ?? true,
      isActive: true,
    };

    return Response.json({
      success: true,
      notification,
      message: 'Email notification created successfully',
    });
  } catch (error) {
    console.error('Email notification creation error:', error);
    return Response.json(
      { error: 'Failed to create email notification' },
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

    // TODO: Fetch email notifications from database
    const notifications: unknown[] = [];

    return Response.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Email notification fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch email notifications' },
      { status: 500 }
    );
  }
}
