/**
 * FinFlow Custom Security Hook: useSecurity
 * Wraps validation schemas, authentication middleware, and audit logging.
 * Exposes verifyAndAuthorize(transactionPayload) for seamless screen integration.
 */
import { useTransactions } from '../context/TransactionContext';
import { validateTransactionSchema } from '../schemas/userSchema';
import { authorizeAction } from '../middleware/authMiddleware';
import auditLogger from '../services/auditLogger';

export function useSecurity() {
  const transactionContext = useTransactions() || {};
  const { currentUser, balance, isUserBlocked } = transactionContext;

  /**
   * Performs full enterprise security checks:
   * 1. Schema integrity & input validation (amount, recipient, limits)
   * 2. Authentication & rate-limiting middleware (blocked user, rolling 2-min window)
   * 3. Comprehensive audit logging of results
   *
   * @param {object} transactionPayload
   * @param {number|string} transactionPayload.amount
   * @param {string} transactionPayload.recipient
   * @param {string} [transactionPayload.mpin]
   * @param {string} [transactionPayload.actionType='TRANSACTION_VERIFICATION']
   * @returns {{ allowed: boolean, message: string }}
   */
  const verifyAndAuthorize = (transactionPayload = {}) => {
    const userEmail = currentUser?.email || 'anonymous@finflow.app';
    const actionType = transactionPayload.actionType || 'TRANSACTION_VERIFICATION';

    // 1. Account status synthesis (combining currentUser and isUserBlocked function)
    const blockedByContext =
      typeof isUserBlocked === 'function' ? isUserBlocked(userEmail) : false;

    const userForAuth = {
      ...currentUser,
      email: userEmail,
      isBlocked: currentUser?.isBlocked || blockedByContext,
    };

    // 2. Execute Middleware: Block & Rate-limiting checks
    const authResult = authorizeAction(userForAuth, actionType);
    if (!authResult.allowed) {
      auditLogger.logEvent(
        'SECURITY_AUTHORIZATION_FAILED',
        {
          reason: 'AUTH_OR_RATE_LIMIT_FAILURE',
          message: authResult.message,
          recipient: transactionPayload.recipient,
          amount: transactionPayload.amount,
        },
        userEmail
      );
      return {
        allowed: false,
        message: authResult.message,
      };
    }

    // 3. Execute Schema Validation: Amount > 0, recipient, balance limit
    const payloadWithBalance = {
      ...transactionPayload,
      userBalance:
        transactionPayload.userBalance !== undefined
          ? transactionPayload.userBalance
          : balance,
    };

    const schemaResult = validateTransactionSchema(payloadWithBalance);
    if (!schemaResult.isValid) {
      auditLogger.logEvent(
        'SECURITY_VALIDATION_FAILED',
        {
          reason: 'INPUT_VALIDATION_ERROR',
          error: schemaResult.error,
          payload: {
            amount: transactionPayload.amount,
            recipient: transactionPayload.recipient,
          },
        },
        userEmail
      );
      return {
        allowed: false,
        message: schemaResult.error,
      };
    }

    // 4. Log Successful Verification Gate Event
    auditLogger.logEvent(
      'SECURITY_AUTHORIZATION_PASSED',
      {
        actionType,
        recipient: transactionPayload.recipient,
        amount: transactionPayload.amount,
        message: 'Security validation and rate limit checks passed successfully.',
      },
      userEmail
    );

    return {
      allowed: true,
      message: 'Security checks passed.',
    };
  };

  /**
   * Helper to log when MPIN authorization succeeds or fails
   */
  const logMpinEvent = (status, details = {}) => {
    const userEmail = currentUser?.email || 'anonymous@finflow.app';
    auditLogger.logEvent(
      status === 'SUCCESS' ? 'MPIN_VERIFICATION' : 'MPIN_VERIFICATION_FAILED',
      details,
      userEmail
    );
  };

  /**
   * Helper to log successful transaction completion
   */
  const logTransactionSuccess = (details = {}) => {
    const userEmail = currentUser?.email || 'anonymous@finflow.app';
    auditLogger.logEvent('TRANSACTION_SUCCESS', details, userEmail);
  };

  return {
    verifyAndAuthorize,
    logMpinEvent,
    logTransactionSuccess,
    auditLogger,
  };
}

export default useSecurity;
