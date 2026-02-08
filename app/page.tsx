'use client';

import { useEffect, useState } from 'react';

interface ConnectionStatus {
  success: boolean;
  message: string;
  database?: string;
  collections?: string[];
  participantCount?: number;
  error?: string;
}

interface Participant {
  participantId: string;
  name: string;
  email: string;
  role?: string;
  teamName?: string;
  institute?: string;
  collegeCheckIn?: {
    status: boolean;
    time?: string;
  };
  labCheckIn?: {
    status: boolean;
    time?: string;
  };
}

export default function Home() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-db');
      const data = await res.json();
      setStatus(data);
      
      if (data.success && data.participantCount > 0) {
        await loadParticipants();
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to connect to server',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  const loadParticipants = async () => {
    setLoadingParticipants(true);
    try {
      const res = await fetch('/api/participants');
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants || []);
      }
    } catch (error) {
      console.error('Failed to load participants:', error);
    }
    setLoadingParticipants(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hackoverflow Check-in System
          </h1>
          <p className="text-gray-600">Database Connection Status</p>
        </div>

        {/* Connection Status Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className={`rounded-lg shadow-lg p-6 ${
            loading ? 'bg-white' : 
            status?.success ? 'bg-green-50 border-2 border-green-500' : 
            'bg-red-50 border-2 border-red-500'
          }`}>
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                <span className="ml-3 text-gray-600">Checking connection...</span>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  {status?.success ? (
                    <svg className="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {status?.success ? 'Connected Successfully' : 'Connection Failed'}
                  </h2>
                </div>

                <div className="space-y-2 text-gray-700">
                  <p><strong>Message:</strong> {status?.message}</p>
                  {status?.database && (
                    <p><strong>Database:</strong> {status.database}</p>
                  )}
                  {status?.collections && (
                    <p><strong>Collections:</strong> {status.collections.join(', ')}</p>
                  )}
                  {status?.participantCount !== undefined && (
                    <p><strong>Total Participants:</strong> {status.participantCount}</p>
                  )}
                  {status?.error && (
                    <p className="text-red-600"><strong>Error:</strong> {status.error}</p>
                  )}
                </div>

                <button
                  onClick={checkConnection}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Retry Connection
                </button>
              </>
            )}
          </div>
        </div>

        {/* Participants List */}
        {status?.success && typeof status.participantCount === 'number' && status.participantCount > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Participants ({participants.length})
                </h2>
                {!loadingParticipants && participants.length === 0 && (
                  <button
                    onClick={loadParticipants}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Load Participants
                  </button>
                )}
              </div>

              {loadingParticipants ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading participants...</p>
                </div>
              ) : participants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institute</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">College Check-in</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab Check-in</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {participants.map((participant) => (
                        <tr key={participant.participantId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{participant.participantId}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{participant.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{participant.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{participant.teamName || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{participant.institute || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            {participant.collegeCheckIn?.status ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Checked in
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not checked in
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {participant.labCheckIn?.status ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ✓ Checked in
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not checked in
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}