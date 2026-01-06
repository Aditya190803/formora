import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (in production, use database)
const userNotifications: Record<string, { emailNotifications: boolean; weeklyDigest: boolean }> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    // Return saved preferences or defaults
    const preferences = userNotifications[userId] || {
      emailNotifications: true,
      weeklyDigest: true,
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Failed to fetch notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  try {
    const body = await request.json();

    // Validate the notification preferences
    if (
      typeof body.emailNotifications !== 'boolean' ||
      typeof body.weeklyDigest !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'Invalid notification preferences' },
        { status: 400 }
      );
    }

    // Save preferences
    userNotifications[userId] = {
      emailNotifications: body.emailNotifications,
      weeklyDigest: body.weeklyDigest,
    };

    // TODO: In production, save to database
    // TODO: Implement actual email notification service
    // TODO: Implement weekly digest scheduled task

    return NextResponse.json({
      success: true,
      preferences: userNotifications[userId],
    });
  } catch (error) {
    console.error('Failed to update notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
