import { NextResponse } from 'next/server';
import { getAllParticipants } from '@/lib/db';

export async function GET() {
  try {
    const participants = await getAllParticipants();
    
    return NextResponse.json({
      success: true,
      count: participants.length,
      participants: participants.slice(0, 50) // Limit to first 50 for display
    });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch participants',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}