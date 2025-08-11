export const sanitizeCNP = (value: string): string => {
  if (!value) return '';
  // Keep only digits and limit to 13
  const digits = value.replace(/\D/g, '');
  return digits.slice(0, 13);
};

export const validateCNP = (value: string): { isValid: boolean; reason?: string } => {
  const cnp = sanitizeCNP(value);
  if (cnp.length !== 13) return { isValid: false, reason: 'length' };
  // Optionally, implement checksum here if needed in future.
  return { isValid: true };
};
