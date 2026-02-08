'use client';

/**
 * Home Page Client Component
 *
 * @module app/HomePageClient
 * @description Client-side component for connection status (hidden from main UI)
 */

import { useState } from 'react';

interface ConnectionStatus {
  success: boolean;
  data?: {
    message: string;
    database: string;
    collections: string[];
    participantCount: number;
  };
  error?: string;
}

interface HomePageClientProps {
  initialConnectionStatus: ConnectionStatus;
}

export function HomePageClient({ initialConnectionStatus }: HomePageClientProps) {
  const [isDebugMode] = useState(false); // Set to true to see connection status

  // Hidden debug panel - only visible if needed
  if (!isDebugMode) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] rounded-xl border border-[rgba(255,255,255,0.1)] p-4 max-w-xs z-50">
      <div className="text-xs">
        <p className="text-[rgba(255,255,255,0.5)] mb-2">Debug: Connection Status</p>
        {initialConnectionStatus.success ? (
          <div className="text-[#FCB216]">
            <p>✓ Connected</p>
            <p className="text-[rgba(255,255,255,0.5)] mt-1">
              Participants: {initialConnectionStatus.data?.participantCount ?? 0}
            </p>
          </div>
        ) : (
          <div className="text-[#D91B57]">
            <p>✗ Connection Error</p>
            <p className="text-[rgba(255,255,255,0.5)] mt-1">
              {initialConnectionStatus.error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}