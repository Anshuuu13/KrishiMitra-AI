import { describe, it, expect } from 'vitest';
import { formatCurrency, formatQuantity } from './formatCurrency';
import { validatePositiveNumber, validateNonNegativeNumber, validateRequired } from './validators';

describe('Shared Utilities', () => {
  describe('formatCurrency', () => {
    it('formats numbers into Indian currency format with rupee symbol', () => {
      expect(formatCurrency(2450)).toBe('₹2,450');
      expect(formatCurrency(100000)).toBe('₹1,00,000');
    });

    it('handles zero and decimal amounts correctly', () => {
      expect(formatCurrency(0)).toBe('₹0');
      expect(formatCurrency(1250.5)).toBe('₹1,250.5');
    });
  });

  describe('formatQuantity', () => {
    it('formats quantity with unit', () => {
      expect(formatQuantity(1, 'quintal')).toBe('1 quintal');
      expect(formatQuantity(50, 'quintal')).toBe('50 quintals');
    });
  });

  describe('validators', () => {
    it('validates positive numbers correctly', () => {
      expect(validatePositiveNumber(50, 'Quantity')).toBeNull();
      expect(validatePositiveNumber(0, 'Quantity')).toBe('Quantity must be greater than zero');
      expect(validatePositiveNumber(-5, 'Quantity')).toBe('Quantity must be greater than zero');
      expect(validatePositiveNumber('', 'Quantity')).toBe('Quantity is required');
    });

    it('validates non-negative numbers correctly', () => {
      expect(validateNonNegativeNumber(0, 'Cost')).toBeNull();
      expect(validateNonNegativeNumber(100, 'Cost')).toBeNull();
      expect(validateNonNegativeNumber(-10, 'Cost')).toBe('Cost cannot be negative');
    });

    it('validates required fields', () => {
      expect(validateRequired('Wheat', 'Crop')).toBeNull();
      expect(validateRequired('', 'Crop')).toBe('Crop is required');
      expect(validateRequired('   ', 'Crop')).toBe('Crop is required');
    });
  });
});
