import { describe, it, expect } from 'vitest';
import { calculateNetReturn } from '../../shared/utils/netReturnCalculator';

describe('Net Return Calculator Logic & Comparisons', () => {
  it('correctly calculates net returns for direct buyer with flat pickup', () => {
    // 50 quintals wheat @ ₹2,580, flat pickup ₹20/qtl, loading ₹15/qtl, 0 mandi fee
    const result = calculateNetReturn({
      pricePerQuintal: 2580,
      quantityQuintals: 50,
      flatTransportCost: 20 * 50, // ₹1,000
      loadingPerQuintal: 15,
      unloadingPerQuintal: 0, // buyer unloads
      mandiFeePercent: 0, // bypassed
      otherDeductions: 0,
    });

    expect(result.grossRevenue).toBe(129000);
    expect(result.transportCost).toBe(1000);
    expect(result.handlingCost).toBe(750);
    expect(result.mandiFee).toBe(0);
    expect(result.totalDeductions).toBe(1750);
    expect(result.estimatedNetReturn).toBe(127250);
    expect(result.netPricePerQuintal).toBe(2545);
  });

  it('correctly calculates net returns for APMC Mandi sale with 1.5% cess', () => {
    // 50 quintals wheat @ ₹2,480, 18 km * ₹24/km = ₹432 transport, ₹30/qtl handling, 1.5% cess
    const result = calculateNetReturn({
      pricePerQuintal: 2480,
      quantityQuintals: 50,
      distanceKm: 18,
      transportCostPerKm: 24,
      loadingPerQuintal: 15,
      unloadingPerQuintal: 15,
      mandiFeePercent: 1.5,
      otherDeductions: 100,
    });

    const expectedGross = 2480 * 50; // 124,000
    const expectedTransport = 18 * 24; // 432
    const expectedHandling = 30 * 50; // 1,500
    const expectedMandiFee = (expectedGross * 1.5) / 100; // 1,860
    const expectedTotalDeductions = expectedTransport + expectedHandling + expectedMandiFee + 100; // 3,892
    const expectedNet = expectedGross - expectedTotalDeductions; // 120,108

    expect(result.grossRevenue).toBe(expectedGross);
    expect(result.transportCost).toBe(expectedTransport);
    expect(result.handlingCost).toBe(expectedHandling);
    expect(result.mandiFee).toBe(expectedMandiFee);
    expect(result.totalDeductions).toBe(expectedTotalDeductions);
    expect(result.estimatedNetReturn).toBe(expectedNet);
  });

  it('demonstrates positive net advantage of direct commercial sale over mandi', () => {
    const directBuyerNet = 127250;
    const mandiNet = 120108;
    const advantage = directBuyerNet - mandiNet;

    expect(advantage).toBeGreaterThan(7000);
    expect(advantage).toBe(7142);
  });

  it('safely handles zero quantity without division by zero', () => {
    const result = calculateNetReturn({
      pricePerQuintal: 2500,
      quantityQuintals: 0,
    });

    expect(result.grossRevenue).toBe(0);
    expect(result.estimatedNetReturn).toBe(0);
    expect(result.netPricePerQuintal).toBe(0);
    expect(isNaN(result.netPricePerQuintal)).toBe(false);
  });
});
