import { NextRequest, NextResponse } from 'next/server';
import { getParticipantByEmail, updateCheckIn } from '@/lib/db';
import { CheckInResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, checkInType } = await request.json();
    
    if (!email || !checkInType) {
      return NextResponse.json<CheckInResponse>(
        { success: false, message: 'Email and check-in type are required' },
        { status: 400 }
      );
    }

    if (checkInType !== 'collegeCheckIn' && checkInType !== 'labCheckIn') {
      return NextResponse.json<CheckInResponse>(
        { success: false, message: 'Invalid check-in type' },
        { status: 400 }
      );
    }
    
    const participant = await getParticipantByEmail(email);
    
    if (!participant) {
      return NextResponse.json<CheckInResponse>(
        { success: false, message: 'Participant not found' },
        { status: 404 }
      );
    }
    
    const updated = await updateCheckIn(participant.participantId, checkInType);
    
    if (!updated) {
      return NextResponse.json<CheckInResponse>(
        { success: false, message: 'Failed to update check-in' },
        { status: 500 }
      );
    }
    
    return NextResponse.json<CheckInResponse>({
      success: true,
      message: 'Check-in successful',
      participant
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json<CheckInResponse>(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}