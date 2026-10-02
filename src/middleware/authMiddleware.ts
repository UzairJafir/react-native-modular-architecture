export const validateLoginInput = (email: string, pass: string) => {
  if (!email || !pass) {
    return { isValid: false, message: 'Email and Password are required!' };
  }
  if (!email.includes('@')) {
    return { isValid: false, message: 'Invalid Email format!' };
  }
  return { isValid: true, message: 'Input format valid' };
};