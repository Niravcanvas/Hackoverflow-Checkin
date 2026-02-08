/**
 * API Response Types & Schemas
 *
 * @module lib/types/api-response
 * @description Discriminated union types for type-safe API responses
 */

import { z } from 'zod';
import { ClientParticipantSchema } from './participant';

// ============================================================================
// Generic Action Result (Discriminated Union)
// ============================================================================

/**
 * Success result type
 */
export interface ActionSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error result type
 */
export interface ActionError {
  success: false;
  error: string;
  code?: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'RATE_LIMITED' | 'DB_ERROR' | 'UNKNOWN_ERROR';
}

/**
 * Generic action result - discriminated union for type-safe error handling
 */
export type ActionResult<T> = ActionSuccess<T> | ActionError;

// ============================================================================
// Specific Response Schemas
// ============================================================================

/**
 * Check-in response schema
 */
export const CheckInResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    message: z.string(),
    participant: ClientParticipantSchema,
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
    code: z.enum(['VALIDATION_ERROR', 'NOT_FOUND', 'RATE_LIMITED', 'DB_ERROR', 'UNKNOWN_ERROR']).optional(),
  }),
]);

/**
 * Participant list response schema
 */
export const ParticipantListResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    participants: z.array(ClientParticipantSchema),
    count: z.number(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
    code: z.enum(['VALIDATION_ERROR', 'NOT_FOUND', 'RATE_LIMITED', 'DB_ERROR', 'UNKNOWN_ERROR']).optional(),
  }),
]);

/**
 * Single participant response schema
 */
export const ParticipantResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    participant: ClientParticipantSchema,
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
    code: z.enum(['VALIDATION_ERROR', 'NOT_FOUND', 'RATE_LIMITED', 'DB_ERROR', 'UNKNOWN_ERROR']).optional(),
  }),
]);

/**
 * Database connection status response schema
 */
export const ConnectionStatusSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    message: z.string(),
    database: z.string(),
    collections: z.array(z.string()),
    participantCount: z.number(),
  }),
  z.object({
    success: z.literal(false),
    error: z.string(),
    code: z.enum(['DB_ERROR', 'UNKNOWN_ERROR']).optional(),
  }),
]);

// ============================================================================
// TypeScript Types
// ============================================================================

export type CheckInResponse = z.infer<typeof CheckInResponseSchema>;
export type ParticipantListResponse = z.infer<typeof ParticipantListResponseSchema>;
export type ParticipantResponse = z.infer<typeof ParticipantResponseSchema>;
export type ConnectionStatus = z.infer<typeof ConnectionStatusSchema>;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates a success response with type inference
 */
export function createSuccessResponse<T>(data: T, message?: string): ActionSuccess<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Creates an error response with proper error codes
 */
export function createErrorResponse(
  error: string,
  code?: ActionError['code']
): ActionError {
  return {
    success: false,
    error,
    code,
  };
}
