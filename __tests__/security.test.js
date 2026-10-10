/**
 * FinFlow Enterprise Banking Security & Anti-Fraud Unit Tests
 * Tests AuditLoggerService, InputValidationSchema, Rate-Limiting Middleware, and useSecurity Hook.
 */
import { AuditLoggerService } from '../src/services/auditLogger';
import { validateTransactionSchema } from '../src/schemas/userSchema';
import {
  checkRateLimit,
  authorizeAction,
  resetRateLimit,
  RATE_LIMIT_CONFIG,
} from '../src/middleware/authMiddleware';

describe('Enterprise Security & Anti-Fraud Suite', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  // ==========================================
  // 1. AUDIT LOGGER SERVICE TESTS
  // ==========================================
  describe('AuditLoggerService', () => {
    it('records audit events with timestamp, unique ID, eventType, and userEmail', () => {
      const logger = new AuditLoggerService();
      const entry = logger.logEvent(
        'MPIN_VERIFICATION',
        { status: 'SUCCESS', method: 'KEYPAD' },
        'testuser@finflow.app'
      );

      expect(entry).toHaveProperty('id');
      expect(entry.id).toMatch(/^LOG-/);
      expect(entry).toHaveProperty('timestamp');
      expect(entry.eventType).toBe('MPIN_VERIFICATION');
      expect(entry.userEmail).toBe('testuser@finflow.app');
      expect(entry.details).toEqual({ status: 'SUCCESS', method: 'KEYPAD' });

      const logs = logger.getLogs({ userEmail: 'testuser@finflow.app' });
      expect(logs.length).toBe(1);
      expect(logs[0].id).toBe(entry.id);
    });

    it('filters logs by eventType and userEmail accurately', () => {
      const logger = new AuditLoggerService();
      logger.logEvent('RATE_LIMIT_EXCEEDED', { attempts: 5 }, 'user1@test.com');
      logger.logEvent('TRANSACTION_SUCCESS', { amount: 500 }, 'user1@test.com');
      logger.logEvent('TRANSACTION_SUCCESS', { amount: 1000 }, 'user2@test.com');

      const user1Logs = logger.getLogs({ userEmail: 'user1@test.com' });
      expect(user1Logs.length).toBe(2);

      const rateLimitLogs = logger.getLogs({ eventType: 'RATE_LIMIT_EXCEEDED' });
      expect(rateLimitLogs.length).toBe(1);
      expect(rateLimitLogs[0].userEmail).toBe('user1@test.com');
    });
  });

  // ==========================================
  // 2. TRANSACTION SCHEMA VALIDATION TESTS
  // ==========================================
  describe('validateTransactionSchema', () => {
    it('validates correct transaction payload', () => {
      const result = validateTransactionSchema({
        amount: 2500,
        recipient: 'Jamal Khan',
        userBalance: 10000,
        mpin: '1234',
      });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('fails when recipient is empty or missing', () => {
      const result = validateTransactionSchema({
        amount: 2500,
        recipient: '',
        userBalance: 10000,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/recipient/i);
    });

    it('fails when amount is zero or negative', () => {
      const zeroResult = validateTransactionSchema({
        amount: 0,
        recipient: 'Ali Ahmed',
        userBalance: 10000,
      });
      expect(zeroResult.isValid).toBe(false);
      expect(zeroResult.error).toMatch(/greater than zero/i);

      const negResult = validateTransactionSchema({
        amount: -50,
        recipient: 'Ali Ahmed',
        userBalance: 10000,
      });
      expect(negResult.isValid).toBe(false);
      expect(negResult.error).toMatch(/greater than zero/i);
    });

    it('fails when amount exceeds user balance', () => {
      const result = validateTransactionSchema({
        amount: 50000,
        recipient: 'Ali Ahmed',
        userBalance: 20000,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toMatch(/insufficient funds/i);
    });

    it('validates strict 4-digit MPIN format when provided', () => {
      const invalidShortPin = validateTransactionSchema({
        amount: 1000,
        recipient: 'Ali Ahmed',
        mpin: '12',
      });
      expect(invalidShortPin.isValid).toBe(false);
      expect(invalidShortPin.error).toMatch(/strictly 4 numeric digits/i);

      const invalidAlphaPin = validateTransactionSchema({
        amount: 1000,
        recipient: 'Ali Ahmed',
        mpin: 'abcd',
      });
      expect(invalidAlphaPin.isValid).toBe(false);
      expect(invalidAlphaPin.error).toMatch(/strictly 4 numeric digits/i);
    });
  });

  // ==========================================
  // 3. AUTHENTICATION & RATE LIMITING MIDDLEWARE
  // ==========================================
  describe('authMiddleware Rate Limiting & Account Security', () => {
    const testUser = { email: 'fraudcheck@finflow.app', status: 'Active' };

    it('allows up to 5 attempts within rolling window', () => {
      for (let i = 1; i <= RATE_LIMIT_CONFIG.MAX_ATTEMPTS; i++) {
        const check = checkRateLimit(testUser.email);
        expect(check.allowed).toBe(true);
        expect(check.remainingAttempts).toBe(RATE_LIMIT_CONFIG.MAX_ATTEMPTS - i);
      }
    });

    it('blocks the 6th attempt and enforces cooldown', () => {
      // Consume 5 attempts
      for (let i = 0; i < RATE_LIMIT_CONFIG.MAX_ATTEMPTS; i++) {
        checkRateLimit(testUser.email);
      }

      // 6th attempt must be rejected
      const blockedAttempt = checkRateLimit(testUser.email);
      expect(blockedAttempt.allowed).toBe(false);
      expect(blockedAttempt.remainingAttempts).toBe(0);
      expect(blockedAttempt.cooldownSeconds).toBeGreaterThan(0);

      // authorizeAction also rejects with informative message
      const authResult = authorizeAction(testUser, 'TRANSACTION_ATTEMPT');
      expect(authResult.allowed).toBe(false);
      expect(authResult.message).toMatch(/Too many attempts! Security cooldown active/i);
    });

    it('immediately blocks users with status "Blocked" or isBlocked: true', () => {
      const blockedUser = { email: 'badactor@finflow.app', status: 'Blocked' };
      const authResult = authorizeAction(blockedUser, 'SEND_MONEY');

      expect(authResult.allowed).toBe(false);
      expect(authResult.message).toMatch(/restricted by the administrator/i);
    });
  });
});
