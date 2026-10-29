import { describe, it, expect } from 'vitest';
import buyersData from '../../data/buyers.json';

describe('Buyer Matching Module & Data Integrity', () => {
  it('contains simulated flag and explicit disclaimer', () => {
    expect(buyersData.simulated).toBe(true);
    expect(buyersData.disclaimer).toBeDefined();
    expect(buyersData.disclaimer.length).toBeGreaterThan(15);
  });

  it('validates each buyer record structure and positive price offers', () => {
    buyersData.buyers.forEach((b) => {
      expect(b.id).toBeDefined();
      expect(b.name.length).toBeGreaterThan(3);
      expect(b.offeredPricePerQuintal).toBeGreaterThan(0);
      expect(b.minQuantityQuintals).toBeGreaterThan(0);
      expect(b.maxQuantityQuintals).toBeGreaterThanOrEqual(b.minQuantityQuintals);
      expect(b.distanceKm).toBeGreaterThan(0);
      expect(b.rating).toBeGreaterThanOrEqual(1.0);
      expect(b.rating).toBeLessThanOrEqual(5.0);
      expect(b.simulated).toBe(true);
      expect(b.contactPerson).toBeDefined();
    });
  });

  it('provides verified buyers for major crops (Wheat, Soybean, Onion, Tomato)', () => {
    const wheatBuyers = buyersData.buyers.filter((b) => b.cropId === 'wheat');
    const soyaBuyers = buyersData.buyers.filter((b) => b.cropId === 'soybean');
    const onionBuyers = buyersData.buyers.filter((b) => b.cropId === 'onion');

    expect(wheatBuyers.length).toBeGreaterThanOrEqual(2);
    expect(soyaBuyers.length).toBeGreaterThanOrEqual(2);
    expect(onionBuyers.length).toBeGreaterThanOrEqual(1);
  });

  it('correctly compares buyer offer vs benchmark mandi price', () => {
    const malwaMill = buyersData.buyers.find((b) => b.id === 'buyer-1');
    const benchmarkMandi = 2480;
    const diff = malwaMill.offeredPricePerQuintal - benchmarkMandi;

    expect(malwaMill.offeredPricePerQuintal).toBe(2580);
    expect(diff).toBe(100); // 100/quintal above mandi
  });
});
