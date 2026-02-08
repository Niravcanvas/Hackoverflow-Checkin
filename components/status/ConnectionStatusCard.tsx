/**
 * Connection Status Card Component
 *
 * @module components/status/ConnectionStatusCard
 * @description Displays database connection status
 */

// ============================================================================
// Types
// ============================================================================

interface ConnectionStatusData {
  message: string;
  database: string;
  collections: string[];
  participantCount: number;
}

interface ConnectionStatusCardProps {
  status: ConnectionStatusData | null;
  error: string | null;
  loading: boolean;
  onRetry: () => void;
}

// ============================================================================
// Icons
// ============================================================================

function SuccessIcon() {
  return (
    <svg
      className="w-8 h-8 text-green-500 mr-3"
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
  );
}

function ErrorIcon() {
  return (
    <svg
      className="w-8 h-8 text-red-500 mr-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800" />
      <span className="ml-3 text-gray-600">Checking connection...</span>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ConnectionStatusCard({
  status,
  error,
  loading,
  onRetry,
}: ConnectionStatusCardProps) {
  const isSuccess = status !== null && error === null;

  const cardClasses = loading
    ? 'bg-white'
    : isSuccess
      ? 'bg-green-50 border-2 border-green-500'
      : 'bg-red-50 border-2 border-red-500';

  return (
    <div className={`rounded-lg shadow-lg p-6 ${cardClasses}`}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center mb-4">
            {isSuccess ? <SuccessIcon /> : <ErrorIcon />}
            <h2 className="text-2xl font-semibold text-gray-800">
              {isSuccess ? 'Connected Successfully' : 'Connection Failed'}
            </h2>
          </div>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Message:</strong> {status?.message ?? error}
            </p>
            {status?.database && (
              <p>
                <strong>Database:</strong> {status.database}
              </p>
            )}
            {status?.collections && status.collections.length > 0 && (
              <p>
                <strong>Collections:</strong> {status.collections.join(', ')}
              </p>
            )}
            {status?.participantCount !== undefined && (
              <p>
                <strong>Total Participants:</strong> {status.participantCount}
              </p>
            )}
            {error && (
              <p className="text-red-600">
                <strong>Error:</strong> {error}
              </p>
            )}
          </div>

          <button
            onClick={onRetry}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </>
      )}
    </div>
  );
}
