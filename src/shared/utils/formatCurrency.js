/**
 * Format a number into Indian Rupee format (e.g. ₹ 2,500)
 * @param {number|string} amount 
 * @param {boolean} includeSymbol 
 * @returns {string}
 */
export function formatCurrency(amount, includeSymbol = true) {
  const numericAmount = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(numericAmount);

  return includeSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format quintals or kg cleanly
 * @param {number|string} qty 
 * @param {string} unit 
 * @returns {string}
 */
export function formatQuantity(qty, unit = 'quintal') {
  const numeric = Number(qty) || 0;
  return `${numeric.toLocaleString('en-IN')} ${unit}${numeric > 1 ? 's' : ''}`;
}
