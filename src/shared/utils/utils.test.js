import { describe, it, expect } from 'vitest';
import { formatCurrency, formatQuantity } from './formatCurrency';
import { validatePositiveNumber, validateNonNegativeNumber, validateRequired } from './validators';
import { calculateNetReturn } from './netReturnCalculator';

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

  describe('calculateNetReturn', () => {
    it('calculates gross, deductions, and net returns accurately for mandi sales', () => {
      const result = calculateNetReturn({
        pricePerQuintal: 2500,
        quantityQuintals: 50,
        distanceKm: 20,
        transportCostPerKm: 25,
        loadingPerQuintal: 15,
        unloadingPerQuintal: 15,
        mandiFeePercent: 1.5,
        otherDeductions: 0,
      });

      expect(result.grossRevenue).toBe(125000);
      expect(result.transportCost).toBe(500);
      expect(result.handlingCost).toBe(1500);
      expect(result.mandiFee).toBe(1875);
      expect(result.totalDeductions).toBe(3875);
      expect(result.estimatedNetReturn).toBe(121125);
      expect(result.netPricePerQuintal).toBe(2422.5);
    });

    it('supports direct buyers with zero mandi fees and custom flat transport cost', () => {
      const result = calculateNetReturn({
        pricePerQuintal: 2580,
        quantityQuintals: 40,
        flatTransportCost: 1000,
        loadingPerQuintal: 15,
        unloadingPerQuintal: 15,
        mandiFeePercent: 0,
        otherDeductions: 200,
      });

      expect(result.grossRevenue).toBe(103200);
      expect(result.transportCost).toBe(1000);
      expect(result.handlingCost).toBe(1200);
      expect(result.mandiFee).toBe(0);
      expect(result.otherDeductions).toBe(200);
      expect(result.totalDeductions).toBe(2400);
      expect(result.estimatedNetReturn).toBe(100800);
      expect(result.netPricePerQuintal).toBe(2520);
    });

    it('gracefully handles zero or missing quantity without NaN or negative errors', () => {
      const result = calculateNetReturn({
        pricePerQuintal: 2500,
        quantityQuintals: 0,
      });

      expect(result.grossRevenue).toBe(0);
      expect(result.estimatedNetReturn).toBe(0);
      expect(result.netPricePerQuintal).toBe(0);
    });
  });
});
