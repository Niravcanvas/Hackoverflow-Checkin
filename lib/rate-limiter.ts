/**
 * Rate Limiter Implementation
 *
 * @module lib/rate-limiter
 * @description In-memory rate limiting with sliding window algorithm
 *
 * Production Notes:
 * - For distributed systems, use Redis-based rate limiting
 * - This in-memory implementation works for single-instance deployments
 */

import { z } from 'zod';

// ============================================================================
// Types & Schemas
// ============================================================================

/**
 * Rate limit configuration schema
 */
export const RateLimitConfigSchema = z.object({
  /** Maximum number of requests allowed in the window */
  maxRequests: z.number().min(1),
  /** Window size in milliseconds */
  windowMs: z.number().min(1000),
});

export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>;

/**
 * Rate limit check result
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfterMs: number;
}

/**
 * Rate limit entry for tracking requests
 */
interface RateLimitEntry {
  timestamps: number[];
  blocked: boolean;
  blockedUntil: number;
}

// ============================================================================
// Rate Limiter Class
// ============================================================================

/**
 * In-memory rate limiter with sliding window algorithm
 *
 * @example
 * ```typescript
 * const limiter = new RateLimiter({ maxRequests: 10, windowMs: 60000 });
 * const result = limiter.check('user-123');
 *
 * if (!result.allowed) {
 *   throw new Error(`Rate limited. Retry after ${result.retryAfterMs}ms`);
 * }
 * ```
 */
export class RateLimiter {
  private readonly store: Map<string, RateLimitEntry> = new Map();
  private readonly config: RateLimitConfig;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: RateLimitConfig) {
    // Validate config at runtime
    this.config = RateLimitConfigSchema.parse(config);

    // Cleanup old entries periodically (every 5 minutes)
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request is allowed and consume a request token
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let entry = this.store.get(identifier);

    // Check if currently blocked
    if (entry?.blocked && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        retryAfterMs: entry.blockedUntil - now,
      };
    }

    // Initialize or clean expired timestamps
    if (!entry) {
      entry = { timestamps: [], blocked: false, blockedUntil: 0 };
    } else {
      // Remove timestamps outside the window (sliding window)
      entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
      entry.blocked = false;
    }

    // Check rate limit
    if (entry.timestamps.length >= this.config.maxRequests) {
      // Block the identifier
      entry.blocked = true;
      entry.blockedUntil = now + this.config.windowMs;
      this.store.set(identifier, entry);

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        retryAfterMs: this.config.windowMs,
      };
    }

    // Allow request and record timestamp
    entry.timestamps.push(now);
    this.store.set(identifier, entry);

    const remaining = this.config.maxRequests - entry.timestamps.length;
    const oldestTimestamp = entry.timestamps[0] ?? now;
    const resetTime = oldestTimestamp + this.config.windowMs;

    return {
      allowed: true,
      remaining,
      resetTime,
      retryAfterMs: 0,
    };
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Get current state for an identifier without consuming a request
   */
  peek(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const entry = this.store.get(identifier);

    if (!entry) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
        retryAfterMs: 0,
      };
    }

    // Check if blocked
    if (entry.blocked && entry.blockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockedUntil,
        retryAfterMs: entry.blockedUntil - now,
      };
    }

    // Count valid timestamps
    const validTimestamps = entry.timestamps.filter((ts) => ts > windowStart);
    const remaining = Math.max(0, this.config.maxRequests - validTimestamps.length);
    const allowed = remaining > 0;
    const oldestTimestamp = validTimestamps[0] ?? now;

    return {
      allowed,
      remaining,
      resetTime: oldestTimestamp + this.config.windowMs,
      retryAfterMs: allowed ? 0 : oldestTimestamp + this.config.windowMs - now,
    };
  }

  /**
   * Cleanup expired entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    for (const [identifier, entry] of this.store.entries()) {
      // Remove entries with no valid timestamps and not blocked
      const validTimestamps = entry.timestamps.filter((ts) => ts > windowStart);
      const isExpiredBlock = entry.blocked && entry.blockedUntil <= now;

      if (validTimestamps.length === 0 && (!entry.blocked || isExpiredBlock)) {
        this.store.delete(identifier);
      }
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// ============================================================================
// Pre-configured Rate Limiters
// ============================================================================

/**
 * Global rate limiter for server actions
 * 100 requests per minute per identifier
 */
export const actionRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Strict rate limiter for check-in actions
 * 10 requests per minute per identifier
 */
export const checkInRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * Rate limiter for database-heavy operations
 * 30 requests per minute per identifier
 */
export const dbRateLimiter = new RateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 1 minute
});
