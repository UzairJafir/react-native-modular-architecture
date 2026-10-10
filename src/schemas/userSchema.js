/**
 * FinFlow Banking Input Validation Schema
 * Enforces rigorous financial data integrity & input sanitization.
 */

/**
 * Validates transaction payload prior to authorization.
 * Checks for numerical amounts (> 0), non-empty recipient, balance limit (optional),
 * and strict 4-digit MPIN format if provided.
 *
 * @param {object} payload
 * @param {number|string} payload.amount - Transaction amount
 * @param {string} payload.recipient - Recipient name, mobile number, or account ID
 * @param {string} [payload.mpin] - 4-digit numeric MPIN (if provided at this stage)
 * @param {number} [payload.userBalance] - Current active balance of the user
 * @returns {{ isValid: boolean, error: string | null }}
 */
export const validateTransactionSchema = (payload = {}) => {
  const { amount, recipient, mpin, userBalance } = payload;

  // 1. Recipient Validation
  if (recipient === undefined || recipient === null || String(recipient).trim() === '') {
    return {
      isValid: false,
      error: 'Recipient account, name, or mobile number is required.',
    };
  }

  // 2. Numerical Amount Validation
  if (amount === undefined || amount === null || String(amount).trim() === '') {
    return {
      isValid: false,
      error: 'Transaction amount is required.',
    };
  }

  const sanitizedAmountStr = String(amount).replace(/,/g, '').trim();
  const numericAmount = parseFloat(sanitizedAmountStr);

  if (isNaN(numericAmount)) {
    return {
      isValid: false,
      error: 'Transaction amount must be a valid number.',
    };
  }

  if (numericAmount <= 0) {
    return {
      isValid: false,
      error: 'Transaction amount must be greater than zero.',
    };
  }

  // 3. User Balance Limit Validation
  if (userBalance !== undefined && userBalance !== null) {
    const numericBalance = parseFloat(userBalance);
    if (!isNaN(numericBalance) && numericAmount > numericBalance) {
      return {
        isValid: false,
        error: `Insufficient funds. Your current balance is Rs. ${numericBalance.toLocaleString()}.`,
      };
    }
  }

  // 4. Strict 4-digit MPIN Format Check (if MPIN is supplied in the payload)
  if (mpin !== undefined && mpin !== null && String(mpin).trim() !== '') {
    const cleanPin = String(mpin).trim();
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(cleanPin)) {
      return {
        isValid: false,
        error: 'MPIN must be strictly 4 numeric digits.',
      };
    }
  }

  return {
    isValid: true,
    error: null,
  };
};

export default {
  validateTransactionSchema,
};
