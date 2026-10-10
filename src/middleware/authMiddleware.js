/**
 * FinFlow Authentication & Transaction Security Middleware
 * Implements anti-fraud rolling window rate-limiting and account status guard.
 *
 * Rules:
 * - Maximum 5 transaction/auth attempts within a 2-minute rolling window per user account.
 * - If attempts exceed limit, log 'RATE_LIMIT_EXCEEDED' and block execution with a 2-minute cooldown message.
 * - Verify user active session and block status (currentUser.isBlocked / currentUser.status === 'Blocked').
 */
import auditLogger from '../services/auditLogger';

// In-memory store: userEmail -> Array of timestamps (milliseconds)
const attemptHistory = new Map();

export const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS: 5,
  WINDOW_MS: 2 * 60 * 1000, // 2 minutes in milliseconds
};

/**
 * Checks rolling rate limit for a specific user email.
 * @param {string} userEmail
 * @returns {{ allowed: boolean, remainingAttempts: number, cooldownSeconds: number }}
 */
export const checkRateLimit = (userEmail) => {
  const email = (userEmail || 'anonymous@finflow.app').toLowerCase().trim();
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.WINDOW_MS;

  const timestamps = attemptHistory.get(email) || [];
  // Retain only attempts within the active rolling window
  const activeTimestamps = timestamps.filter((time) => time > windowStart);

  if (activeTimestamps.length >= RATE_LIMIT_CONFIG.MAX_ATTEMPTS) {
    const oldestInWindow = activeTimestamps[0];
    const cooldownMs = oldestInWindow + RATE_LIMIT_CONFIG.WINDOW_MS - now;
    const cooldownSeconds = Math.max(1, Math.ceil(cooldownMs / 1000));

    // Record rate limit violation in security audit log
    auditLogger.logEvent(
      'RATE_LIMIT_EXCEEDED',
      {
        attemptCount: activeTimestamps.length,
        cooldownSeconds,
        message: `Rate limit of ${RATE_LIMIT_CONFIG.MAX_ATTEMPTS} attempts in 2 minutes exceeded.`,
      },
      email
    );

    attemptHistory.set(email, activeTimestamps);

    return {
      allowed: false,
      remainingAttempts: 0,
      cooldownSeconds,
    };
  }

  // Register this attempt
  activeTimestamps.push(now);
  attemptHistory.set(email, activeTimestamps);

  return {
    allowed: true,
    remainingAttempts: RATE_LIMIT_CONFIG.MAX_ATTEMPTS - activeTimestamps.length,
    cooldownSeconds: 0,
  };
};

/**
 * Comprehensive authorization middleware.
 * Verifies rate-limiting and user blocked/inactive status.
 *
 * @param {object} user - User object from context or session
 * @param {string} [actionType='TRANSACTION_ATTEMPT']
 * @returns {{ allowed: boolean, message: string }}
 */
export const authorizeAction = (user, actionType = 'TRANSACTION_ATTEMPT') => {
  const email = user?.email || 'anonymous@finflow.app';

  // 1. Account Block Status Check
  const isBlocked =
    user?.isBlocked === true ||
    user?.status === 'Blocked' ||
    user?.status === 'Suspended';

  if (isBlocked) {
    const errorMsg = 'Your account has been restricted by the administrator. Operations are currently disabled.';
    auditLogger.logEvent(
      'BLOCKED_ACCOUNT_ACCESS_DENIED',
      { actionType, message: errorMsg },
      email
    );
    return {
      allowed: false,
      message: errorMsg,
    };
  }

  // 2. Rolling Window Anti-Fraud Rate Limiting Check
  const rateLimitResult = checkRateLimit(email);
  if (!rateLimitResult.allowed) {
    const errorMsg = `Too many attempts! Security cooldown active. Please wait ${rateLimitResult.cooldownSeconds} seconds before trying again.`;
    return {
      allowed: false,
      message: errorMsg,
    };
  }

  return {
    allowed: true,
    message: 'Authorized successfully.',
  };
};

/**
 * Reset rate limit attempts (useful for testing or after successful unlock)
 */
export const resetRateLimit = (userEmail) => {
  if (userEmail) {
    attemptHistory.delete(userEmail.toLowerCase().trim());
  } else {
    attemptHistory.clear();
  }
};

export default {
  checkRateLimit,
  authorizeAction,
  resetRateLimit,
  RATE_LIMIT_CONFIG,
};
