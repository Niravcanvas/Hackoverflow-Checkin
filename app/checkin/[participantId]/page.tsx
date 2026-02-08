'use client';

/**
 * Check-in Page - Redesigned with Hackoverflow 4.0 Theme
 *
 * @module app/checkin/[participantId]/page
 * @description Participant check-in confirmation page
 */

import '../../hackoverflow-animations.css';
import { useEffect, useState, useTransition, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getParticipantByIdAction, collegeCheckInAction } from '@/actions';
import type { ClientParticipant } from '@/lib/types';
import Image from 'next/image';

// ============================================================================
// Types
// ============================================================================

type PageState = 'loading' | 'error' | 'ready' | 'success';

// ============================================================================
// Loading Component
// ============================================================================

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
      {/* Background Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#FCB216] to-[#E85D24] rounded-full blur-[120px] opacity-[0.1] animate-pulse-glow" />
      
      <div className="text-center relative z-10">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-t-[#FCB216] border-r-[#E85D24] border-b-[#D91B57] border-l-[#63205F] rounded-full animate-spin" />
        </div>
        <p className="text-[rgba(255,255,255,0.8)] text-xl font-semibold tracking-wide">
          Loading participant data...
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Error Component
// ============================================================================

function ErrorState({
  error,
  onGoHome,
}: {
  error: string;
  onGoHome: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orb */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#D91B57] to-[#63205F] rounded-full blur-[120px] opacity-[0.08]" />
      
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px] rounded-3xl border border-[rgba(255,255,255,0.1)] p-8 max-w-md w-full text-center relative z-10">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#D91B57] to-[#63205F] p-1">
          <div className="w-full h-full bg-[#0F0F0F] rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#D91B57]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4 tracking-wide">
          Participant Not Found
        </h1>
        <p className="text-[rgba(255,255,255,0.6)] mb-8 text-lg">{error}</p>
        
        <button
          onClick={onGoHome}
          className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-[#FCB216] via-[#E85D24] to-[#D91B57] text-white font-semibold text-lg transition-all duration-300 hover:shadow-[0_20px_40px_rgba(231,88,41,0.4)] hover:-translate-y-1"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Success Component
// ============================================================================

function SuccessState({ participant }: { participant: ClientParticipant }) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FCB216] to-[#E85D24] rounded-full blur-[120px] opacity-[0.1] animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#D91B57] to-[#63205F] rounded-full blur-[120px] opacity-[0.08] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      
      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px] rounded-3xl border border-[rgba(255,255,255,0.1)] p-8 md:p-12 max-w-2xl w-full text-center relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <Image
              src="/images/Logo.png"
              alt="Hackoverflow 4.0"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#FCB216] via-[#E85D24] to-[#D91B57] p-1">
            <div className="w-full h-full bg-[#0F0F0F] rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-[#FCB216]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#FCB216] via-[#E85D24] to-[#D91B57] bg-clip-text text-transparent tracking-wide">
          Check-in Successful!
        </h1>
        
        <div className="inline-block px-6 py-2 rounded-full bg-[rgba(231,88,41,0.15)] border border-[rgba(231,88,41,0.4)] mb-8">
          <span className="text-[#FCB216] text-sm font-semibold tracking-wider uppercase">
            Welcome to Hackoverflow 4.0
          </span>
        </div>

        {/* Participant Details */}
        <div className="bg-[rgba(255,255,255,0.05)] rounded-2xl p-6 md:p-8 mb-8 text-left space-y-6">
          <div className="border-b border-[rgba(255,255,255,0.1)] pb-4">
            <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Name</p>
            <p className="text-2xl font-bold text-white">{participant.name}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Team</p>
              <p className="text-lg font-semibold text-white">{participant.teamName ?? 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Lab Allotted</p>
              <p className="text-lg font-semibold text-white">{participant.labAllotted ?? 'N/A'}</p>
            </div>
          </div>
        </div>

        <p className="text-[rgba(255,255,255,0.4)] text-sm">
          You can close this page now
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CheckInPage() {
  const params = useParams();
  const router = useRouter();
  const participantId = params.participantId as string;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [participant, setParticipant] = useState<ClientParticipant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchParticipant = useCallback(async () => {
    setPageState('loading');
    setError(null);

    const result = await getParticipantByIdAction(participantId);

    if (result.success) {
      setParticipant(result.data);
      setPageState('ready');
    } else {
      setError(result.error);
      setPageState('error');
    }
  }, [participantId]);

  useEffect(() => {
    fetchParticipant();
  }, [fetchParticipant]);

  const handleCheckIn = () => {
    if (!participant) return;

    startTransition(async () => {
      const result = await collegeCheckInAction(participant.participantId);

      if (result.success) {
        setParticipant(result.data.participant);
        setPageState('success');
      } else {
        setError(result.error);
      }
    });
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Render based on state
  if (pageState === 'loading') {
    return <LoadingState />;
  }

  if (pageState === 'error' || !participant) {
    return <ErrorState error={error ?? 'Unknown error'} onGoHome={handleGoHome} />;
  }

  if (pageState === 'success') {
    return <SuccessState participant={participant} />;
  }

  // Ready state - show confirmation form
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FCB216] to-[#E85D24] rounded-full blur-[120px] opacity-[0.08] animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#D91B57] to-[#63205F] rounded-full blur-[120px] opacity-[0.08] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      
      {/* Decorative Dots */}
      <div className="absolute top-20 left-20 w-1 h-1 bg-[#FCB216] rounded-full opacity-40 animate-float" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-[#E85D24] rounded-full opacity-50 animate-float" style={{ animationDelay: '1s' }} />

      <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[10px] rounded-3xl border border-[rgba(255,255,255,0.1)] p-8 md:p-12 max-w-2xl w-full relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24">
            <Image
              src="/images/Logo.png"
              alt="Hackoverflow 4.0"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#FCB216] via-[#E85D24] to-[#D91B57] bg-clip-text text-transparent tracking-wide">
            Confirm Check-in
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] text-lg">Please verify your information</p>
        </div>

        {/* Participant Details */}
        <div className="bg-[rgba(255,255,255,0.05)] rounded-2xl p-6 md:p-8 mb-8 space-y-6">
          <div className="border-b border-[rgba(255,255,255,0.1)] pb-4">
            <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Participant ID</p>
            <p className="text-xl font-mono font-bold text-[#FCB216]">{participant.participantId}</p>
          </div>

          <div>
            <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Name</p>
            <p className="text-2xl font-bold text-white">{participant.name}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Email</p>
              <p className="text-white break-all">{participant.email}</p>
            </div>

            {participant.phone && (
              <div>
                <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Phone</p>
                <p className="text-white">{participant.phone}</p>
              </div>
            )}
          </div>

          {participant.teamName && (
            <div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Team</p>
              <p className="text-lg font-semibold text-white">{participant.teamName}</p>
            </div>
          )}

          {participant.institute && (
            <div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Institute</p>
              <p className="text-white">{participant.institute}</p>
            </div>
          )}

          {participant.labAllotted && (
            <div>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mb-2 uppercase tracking-wider">Lab Allotted</p>
              <p className="text-lg font-semibold text-white">{participant.labAllotted}</p>
            </div>
          )}
        </div>

        {participant.collegeCheckIn?.status ? (
          <div className="bg-[rgba(252,178,22,0.1)] border-2 border-[rgba(252,178,22,0.3)] rounded-2xl p-6 mb-8 text-center">
            <p className="text-[#FCB216] font-bold text-xl mb-2">Already Checked In</p>
            <p className="text-[rgba(255,255,255,0.6)]">
              Checked in at:{' '}
              {participant.collegeCheckIn.time
                ? new Date(participant.collegeCheckIn.time).toLocaleString()
                : 'Unknown'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-2xl font-bold text-white mb-2">
                Are you this person?
              </p>
              <p className="text-[rgba(255,255,255,0.6)]">
                Click below to confirm and check in
              </p>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#FCB216] via-[#E85D24] to-[#D91B57] text-white font-bold py-5 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl hover:shadow-[0_20px_40px_rgba(231,88,41,0.4)] hover:-translate-y-1"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
          <div className="mt-6 bg-[rgba(217,27,87,0.1)] border-2 border-[rgba(217,27,87,0.3)] rounded-2xl p-4 text-center">
            <p className="text-[#D91B57] font-semibold">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}