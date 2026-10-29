/**
 * Input validators for agricultural calculations and forms
 */

export function validatePositiveNumber(value, fieldName = 'Value') {
  if (value === '' || value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }
  if (num <= 0) {
    return `${fieldName} must be greater than zero`;
  }
  return null;
}

export function validateNonNegativeNumber(value, fieldName = 'Cost') {
  if (value === '' || value === null || value === undefined) {
    return null; // optional defaults to 0
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a number`;
  }
  if (num < 0) {
    return `${fieldName} cannot be negative`;
  }
  return null;
}

export function validateRequired(value, fieldName = 'Field') {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
}
