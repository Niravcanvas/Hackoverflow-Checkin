import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'hackathon');
    
    // Test connection by getting collection names
    const collections = await db.listCollections().toArray();
    
    // Count participants
    const participantCount = await db.collection('participants').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      participantCount
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}