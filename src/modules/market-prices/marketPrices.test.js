import { describe, it, expect } from 'vitest';
import marketPricesData from '../../data/marketPrices.json';
import cropsData from '../../data/crops.json';

describe('Market Prices Module Data & Integrity', () => {
  it('contains simulated flag and explicit disclaimer', () => {
    expect(marketPricesData.simulated).toBe(true);
    expect(marketPricesData.disclaimer).toBeDefined();
    expect(marketPricesData.disclaimer.length).toBeGreaterThan(10);
  });

  it('validates price ranges: minPrice <= modalPrice <= maxPrice', () => {
    marketPricesData.prices.forEach((item) => {
      expect(item.modalPrice).toBeGreaterThan(0);
      expect(item.minPrice).toBeLessThanOrEqual(item.modalPrice);
      expect(item.maxPrice).toBeGreaterThanOrEqual(item.modalPrice);
      expect(item.distanceKm).toBeGreaterThan(0);
      expect(item.mandiFeePercent).toBeGreaterThanOrEqual(0);
      expect(item.simulated).toBe(true);
    });
  });

  it('provides APMC mandi quotes for key staple crops', () => {
    const cropIdsWithPrices = new Set(marketPricesData.prices.map((p) => p.cropId));
    expect(cropIdsWithPrices.has('wheat')).toBe(true);
    expect(cropIdsWithPrices.has('soybean')).toBe(true);
    expect(cropIdsWithPrices.has('onion')).toBe(true);
    expect(cropIdsWithPrices.has('tomato')).toBe(true);
  });

  it('has valid locations in regional directory', () => {
    expect(marketPricesData.locations.length).toBeGreaterThanOrEqual(5);
    const indore = marketPricesData.locations.find((l) => l.id === 'indore');
    expect(indore).toBeDefined();
    expect(indore.state).toBe('Madhya Pradesh');
  });
});
