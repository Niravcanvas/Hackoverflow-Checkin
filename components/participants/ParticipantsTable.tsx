/**
 * Participants Table Component
 *
 * @module components/participants/ParticipantsTable
 * @description Displays participants in a table format with check-in status
 */

import type { ClientParticipant } from '@/lib/types';

// ============================================================================
// Types
// ============================================================================

interface ParticipantsTableProps {
  participants: ClientParticipant[];
}

// ============================================================================
// Sub-components
// ============================================================================

function CheckInBadge({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✓ Checked in
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      Not checked in
    </span>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ParticipantsTable({ participants }: ParticipantsTableProps) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No participants found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Team
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Institute
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              College Check-in
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Lab Check-in
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {participants.map((participant) => (
            <tr key={participant.participantId} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                {participant.participantId}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {participant.name}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {participant.email}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {participant.teamName ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {participant.institute ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm">
                <CheckInBadge checked={participant.collegeCheckIn?.status ?? false} />
              </td>
              <td className="px-4 py-3 text-sm">
                <CheckInBadge checked={participant.labCheckIn?.status ?? false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
