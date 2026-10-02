// Utility Helper Test Case
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};