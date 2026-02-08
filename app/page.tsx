/**
 * Home Page - Server Component with Data Fetching
 *
 * @module app/page
 * @description Main dashboard with connection status and participants list
 *
 * Best Practices:
 * - Server Component by default (no 'use client')
 * - Data fetching on the server
 * - Streaming with Suspense for loading states
 */

import { checkDatabaseConnectionAction, getParticipantsAction } from '@/actions';
import type { ClientParticipant } from '@/lib/types';
import { HomePageClient } from './HomePageClient';

// ============================================================================
// Data Fetching Functions
// ============================================================================

async function getInitialData(): Promise<{
  connectionStatus: {
    success: boolean;
    data?: {
      message: string;
      database: string;
      collections: string[];
      participantCount: number;
    };
    error?: string;
  };
  participants: ClientParticipant[];
}> {
  const connectionResult = await checkDatabaseConnectionAction();

  if (!connectionResult.success) {
    return {
      connectionStatus: {
        success: false,
        error: connectionResult.error,
      },
      participants: [],
    };
  }

  const participantsResult = await getParticipantsAction(50);

  return {
    connectionStatus: {
      success: true,
      data: connectionResult.data,
    },
    participants: participantsResult.success ? participantsResult.data.participants : [],
  };
}

// ============================================================================
// Main Page Component
// ============================================================================

export default async function HomePage() {
  const { connectionStatus, participants } = await getInitialData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hackoverflow Check-in System
          </h1>
          <p className="text-gray-600">Database Connection Status</p>
        </header>

        {/* Client Component for Interactive Connection Status */}
        <HomePageClient
          initialConnectionStatus={connectionStatus}
          initialParticipants={participants}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: 'Hackoverflow Check-in System',
  description: 'Participant check-in management for Hackoverflow 4.0',
};