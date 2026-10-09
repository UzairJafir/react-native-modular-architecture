// Amount Validation Helper Function
export const validateAmount = (amount, userBalance) => {
  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }

  if (numericAmount <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }

  if (userBalance !== undefined && numericAmount > userBalance) {
    return { isValid: false, error: 'Insufficient balance' };
  }

  return { isValid: true, error: null };
};

// ==========================================
// UNIT TESTS FOR AMOUNT & BALANCE VALIDATION
// ==========================================
describe('FinFlow App - Transaction & Validation Test Cases', () => {
  const CURRENT_BALANCE = 245500;

  // Test Case 1: Zero Amount Validation
  test('Should return error when amount is 0', () => {
    const result = validateAmount('0', CURRENT_BALANCE);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Amount must be greater than zero');
  });

  // Test Case 2: Negative Amount Validation
  test('Should return error when amount is negative (e.g., -500)', () => {
    const result = validateAmount('-500', CURRENT_BALANCE);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Amount must be greater than zero');
  });

  // Test Case 3: Empty or Non-numeric Input
  test('Should return error when amount input is empty or invalid text', () => {
    const resultEmpty = validateAmount('', CURRENT_BALANCE);
    const resultText = validateAmount('abc', CURRENT_BALANCE);

    expect(resultEmpty.isValid).toBe(false);
    expect(resultText.isValid).toBe(false);
    expect(resultEmpty.error).toBe('Please enter a valid amount');
  });

  // Test Case 4: Insufficient Balance Check
  test('Should return error when amount exceeds current balance', () => {
    const result = validateAmount('300000', CURRENT_BALANCE);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Insufficient balance');
  });

  // Test Case 5: Valid Amount Flow
  test('Should pass when amount is positive and within balance limit', () => {
    const result = validateAmount('1500', CURRENT_BALANCE);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });
});