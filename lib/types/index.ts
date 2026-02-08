/**
 * Centralized Type Exports
 *
 * @module lib/types
 * @description Re-exports all types for clean imports
 */

// Participant types
export {
  // Schemas
  WifiCredentialsSchema,
  CheckInStatusSchema,
  DBParticipantSchema,
  ClientParticipantSchema,
  CheckInTypeSchema,
  CheckInInputSchema,
  // Types
  type WifiCredentials,
  type CheckInStatus,
  type DBParticipant,
  type ClientParticipant,
  type CheckInType,
  type CheckInInput,
  // Utilities
  toClientParticipant,
} from './participant';

// API Response types
export {
  // Schemas
  CheckInResponseSchema,
  ParticipantListResponseSchema,
  ParticipantResponseSchema,
  ConnectionStatusSchema,
  // Types
  type ActionSuccess,
  type ActionError,
  type ActionResult,
  type CheckInResponse,
  type ParticipantListResponse,
  type ParticipantResponse,
  type ConnectionStatus,
  // Utilities
  createSuccessResponse,
  createErrorResponse,
} from './api-response';
