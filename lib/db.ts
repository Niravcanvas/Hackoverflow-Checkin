import clientPromise from './mongodb';  // Changed this line
import { DBParticipant } from '@/types';

const DB_NAME = process.env.DB_NAME || 'hackoverflow'; 
const COLLECTION_NAME = 'participants';

export async function getParticipantByEmail(email: string): Promise<DBParticipant | null> {
  const client = await clientPromise;  // Changed this line
  const db = client.db(DB_NAME);
  
  return db.collection<DBParticipant>(COLLECTION_NAME)
    .findOne({ email: email.toLowerCase() });
}

export async function getParticipantById(participantId: string): Promise<DBParticipant | null> {
  const client = await clientPromise;  // Changed this line
  const db = client.db(DB_NAME);
  
  return db.collection<DBParticipant>(COLLECTION_NAME)
    .findOne({ participantId });
}

export async function updateCheckIn(
  participantId: string,
  checkInType: 'collegeCheckIn' | 'labCheckIn'
): Promise<boolean> {
  const client = await clientPromise;  // Changed this line
  const db = client.db(DB_NAME);
  
  const result = await db.collection<DBParticipant>(COLLECTION_NAME)
    .updateOne(
      { participantId },
      {
        $set: {
          [`${checkInType}.status`]: true,
          [`${checkInType}.time`]: new Date(),
          updatedAt: new Date()
        }
      }
    );
  
  return result.modifiedCount > 0;
}

export async function getAllParticipants(): Promise<DBParticipant[]> {
  const client = await clientPromise;  // Changed this line
  const db = client.db(DB_NAME);
  
  return db.collection<DBParticipant>(COLLECTION_NAME)
    .find({})
    .toArray();
}