// Schema Validation Test Case
export const validateUserData = (data: any) => {
  if (!data || typeof data.id !== 'number' || typeof data.name !== 'string') {
    return { isValid: false, error: 'Invalid User Schema' };
  }
  return { isValid: true, error: null };
};