'use server';

/**
 * Database Connection Status Actions
 *
 * @module actions/database
 * @description Server actions for database health checks
 */

import { headers } from 'next/headers';
import { getDatabase, getDatabaseName } from '@/lib/db';
import { ActionResult, createErrorResponse } from '@/lib/types';
import { dbRateLimiter } from '@/lib/rate-limiter';

// ============================================================================
// Types
// ============================================================================

interface ConnectionStatusData {
  message: string;
  database: string;
  collections: string[];
  participantCount: number;
}

// ============================================================================
// Rate Limiting Helper
// ============================================================================

async function getRateLimitIdentifier(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  return forwardedFor?.split(',')[0]?.trim() ?? realIp ?? 'anonymous';
}

// ============================================================================
// Server Actions
// ============================================================================

/**
 * Check database connection status
 */
export async function checkDatabaseConnectionAction(): Promise<
  ActionResult<ConnectionStatusData>
> {
  // Rate limiting
  const identifier = await getRateLimitIdentifier();
  const rateLimitResult = dbRateLimiter.check(identifier);

  if (!rateLimitResult.allowed) {
    return createErrorResponse(
      `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitResult.retryAfterMs / 1000)} seconds.`,
      'RATE_LIMITED'
    );
  }

  try {
    const db = await getDatabase();

    // Test connection by getting collection names
    const collectionsInfo = await db.listCollections().toArray();
    const collections = collectionsInfo.map((c) => c.name);

    // Count participants
    const participantCount = await db.collection('participants').countDocuments();

    return {
      success: true,
      data: {
        message: 'Database connected successfully',
        database: getDatabaseName(),
        collections,
        participantCount,
      },
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Database connection failed',
      'DB_ERROR'
    );
  }
}

/**
 * Get quick database health status
 */
export async function getDatabaseHealthAction(): Promise<
  ActionResult<{ healthy: boolean; latencyMs: number }>
> {
  // Rate limiting
  const identifier = await getRateLimitIdentifier();
  const rateLimitResult = dbRateLimiter.check(identifier);

  if (!rateLimitResult.allowed) {
    return createErrorResponse(
      `Rate limit exceeded. Please try again in ${Math.ceil(rateLimitResult.retryAfterMs / 1000)} seconds.`,
      'RATE_LIMITED'
    );
  }

  try {
    const startTime = Date.now();
    const db = await getDatabase();

    // Simple ping-like operation
    await db.command({ ping: 1 });

    const latencyMs = Date.now() - startTime;

    return {
      success: true,
      data: {
        healthy: true,
        latencyMs,
      },
    };
  } catch (error) {
    console.error('Database health check error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Database health check failed',
      'DB_ERROR'
    );
  }
}
