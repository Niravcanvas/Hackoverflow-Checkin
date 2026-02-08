/**
 * Loading Spinner Component
 *
 * @module components/ui/LoadingSpinner
 * @description Reusable loading spinner with customizable size and message
 */

// ============================================================================
// Types
// ============================================================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

// ============================================================================
// Size Mappings
// ============================================================================

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-b-2',
  lg: 'h-16 w-16 border-b-4',
} as const;

// ============================================================================
// Main Component
// ============================================================================

export function LoadingSpinner({
  size = 'md',
  message,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-gray-800 ${sizeClasses[size]}`}
      />
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
}
