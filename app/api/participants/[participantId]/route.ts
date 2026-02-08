import { NextRequest, NextResponse } from 'next/server';
import { getParticipantById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ participantId: string }> }
) {
  try {
    const { participantId } = await params;

    if (!participantId) {
      return NextResponse.json(
        { success: false, message: 'Participant ID is required' },
        { status: 400 }
      );
    }

    const participant = await getParticipantById(participantId);

    if (!participant) {
      return NextResponse.json(
        { success: false, message: 'Participant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participant
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}