'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Participant {
  participantId: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  teamName?: string;
  institute?: string;
  labAllotted?: string;
  collegeCheckIn?: {
    status: boolean;
    time?: string;
  };
  labCheckIn?: {
    status: boolean;
    time?: string;
  };
}

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.participantId as string;

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  useEffect(() => {
    fetchParticipant();
  }, [participantId]);

  const fetchParticipant = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/participant/${participantId}`);
      
      if (!res.ok) {
        throw new Error('Participant not found');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setParticipant(data.participant);
      } else {
        setError(data.message || 'Participant not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load participant');
    }
    
    setLoading(false);
  };

  const handleCheckIn = async () => {
    if (!participant) return;

    setCheckingIn(true);
    
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId: participant.participantId,
          checkInType: 'collegeCheckIn'
        })
      });

      const data = await res.json();

      if (data.success) {
        setCheckInSuccess(true);
        setParticipant(prev => prev ? {
          ...prev,
          collegeCheckIn: {
            status: true,
            time: new Date().toISOString()
          }
        } : null);
      } else {
        setError(data.message || 'Check-in failed');
      }
    } catch (err) {
      setError('Failed to check in. Please try again.');
    }
    
    setCheckingIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading participant data...</p>
        </div>
      </div>
    );
  }

  if (error && !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Participant Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (checkInSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Check-in Successful!</h1>
          <p className="text-gray-600 mb-6">Welcome to Hackoverflow 4.0</p>
          
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Name</p>
            <p className="text-lg font-semibold text-gray-800 mb-3">{participant?.name}</p>
            
            <p className="text-sm text-gray-600 mb-1">Team</p>
            <p className="text-lg font-semibold text-gray-800 mb-3">{participant?.teamName || 'N/A'}</p>
            
            <p className="text-sm text-gray-600 mb-1">Lab Allotted</p>
            <p className="text-lg font-semibold text-gray-800">{participant?.labAllotted || 'N/A'}</p>
          </div>
          
          <p className="text-sm text-gray-500">You can close this page now</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Confirm Check-in</h1>
          <p className="text-gray-600">Please verify your information</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Participant ID</p>
            <p className="text-lg font-mono font-semibold text-gray-800">{participant?.participantId}</p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Name</p>
            <p className="text-xl font-bold text-gray-800">{participant?.name}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-gray-800">{participant?.email}</p>
          </div>

          {participant?.phone && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-gray-800">{participant.phone}</p>
            </div>
          )}

          {participant?.teamName && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Team</p>
              <p className="text-gray-800">{participant.teamName}</p>
            </div>
          )}

          {participant?.institute && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Institute</p>
              <p className="text-gray-800">{participant.institute}</p>
            </div>
          )}

          {participant?.labAllotted && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Lab Allotted</p>
              <p className="text-gray-800">{participant.labAllotted}</p>
            </div>
          )}
        </div>

        {participant?.collegeCheckIn?.status ? (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6 text-center">
            <p className="text-yellow-800 font-semibold">Already Checked In</p>
            <p className="text-sm text-yellow-700 mt-1">
              Checked in at: {new Date(participant.collegeCheckIn.time || '').toLocaleString()}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">Are you this person?</p>
              <p className="text-sm text-gray-600">Click below to confirm and check in</p>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
            >
              {checkingIn ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking in...
                </span>
              ) : (
                '✓ Yes, Check Me In'
              )}
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-lg p-3 text-center">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}