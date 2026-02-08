'use client';

/**
 * Home Page Client Component
 *
 * @module app/HomePageClient
 * @description Client-side interactivity for the home page
 */

import { useState, useTransition } from 'react';
import { checkDatabaseConnectionAction, getParticipantsAction } from '@/actions';
import type { ClientParticipant } from '@/lib/types';
import { ParticipantsTable, ConnectionStatusCard } from '@/components';

// ============================================================================
// Types
// ============================================================================

interface ConnectionStatusData {
  message: string;
  database: string;
  collections: string[];
  participantCount: number;
}

interface HomePageClientProps {
  initialConnectionStatus: {
    success: boolean;
    data?: ConnectionStatusData;
    error?: string;
  };
  initialParticipants: ClientParticipant[];
}

// ============================================================================
// Main Component
// ============================================================================

export function HomePageClient({
  initialConnectionStatus,
  initialParticipants,
}: HomePageClientProps) {
  const [status, setStatus] = useState<ConnectionStatusData | null>(
    initialConnectionStatus.data ?? null
  );
  const [error, setError] = useState<string | null>(
    initialConnectionStatus.error ?? null
  );
  const [participants, setParticipants] =
    useState<ClientParticipant[]>(initialParticipants);
  const [isPending, startTransition] = useTransition();
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  const handleRetryConnection = () => {
    startTransition(async () => {
      setError(null);
      const result = await checkDatabaseConnectionAction();

      if (result.success) {
        setStatus(result.data);
        setError(null);
        // Auto-load participants if connection successful
        if (result.data.participantCount > 0) {
          await handleLoadParticipants();
        }
      } else {
        setStatus(null);
        setError(result.error);
      }
    });
  };

  const handleLoadParticipants = async () => {
    setIsLoadingParticipants(true);
    try {
      const result = await getParticipantsAction(50);
      if (result.success) {
        setParticipants(result.data.participants);
      }
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  const showParticipants = status !== null && (status.participantCount ?? 0) > 0;

  return (
    <>
      {/* Connection Status Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <ConnectionStatusCard
          status={status}
          error={error}
          loading={isPending}
          onRetry={handleRetryConnection}
        />
      </div>

      {/* Participants List */}
      {showParticipants && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Participants ({participants.length})
              </h2>
              <button
                onClick={handleLoadParticipants}
                disabled={isLoadingParticipants}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingParticipants ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {isLoadingParticipants ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
                <p className="mt-2 text-gray-600">Loading participants...</p>
              </div>
            ) : (
              <ParticipantsTable participants={participants} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
