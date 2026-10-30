import { describe, it, expect } from 'vitest';
import logisticsData from '../../data/logistics.json';

describe('Logistics & Transport Module Logic', () => {
  it('contains simulated flag and explicit transport disclaimer', () => {
    expect(logisticsData.simulated).toBe(true);
    expect(logisticsData.disclaimer).toBeDefined();
    expect(logisticsData.handlingRates.loadingPerQuintal).toBe(15);
    expect(logisticsData.handlingRates.unloadingPerQuintal).toBe(15);
  });

  it('validates 4 progressive commercial vehicle tiers', () => {
    expect(logisticsData.vehicles.length).toBe(4);

    const capacities = logisticsData.vehicles.map((v) => v.capacityQuintals);
    // [10, 25, 45, 100]
    expect(capacities).toEqual([10, 25, 45, 100]);

    logisticsData.vehicles.forEach((v) => {
      expect(v.baseFare).toBeGreaterThan(0);
      expect(v.perKmRate).toBeGreaterThan(0);
      expect(v.simulated).toBe(true);
    });
  });

  it('correctly calculates total freight for a 50 quintal load over 25 km', () => {
    // 50 quintals uses Eicher Heavy (veh-4) with base ₹2,400, rate ₹52/km
    const vehicle = logisticsData.vehicles.find((v) => v.id === 'veh-4');
    const distance = 25;
    const qty = 50;

    const baseFare = vehicle.baseFare; // 2400
    const distanceCost = distance * vehicle.perKmRate; // 25 * 52 = 1300
    const loading = 15 * qty; // 750
    const unloading = 15 * qty; // 750
    const total = baseFare + distanceCost + loading + unloading; // 5200

    expect(total).toBe(5200);
    expect(total / qty).toBe(104); // ₹104 per quintal
  });

  it('correctly matches vehicle tier to batch harvest volumes', () => {
    function pickVehicleTier(qty) {
      if (qty <= 10) return 'veh-1';
      if (qty <= 25) return 'veh-2';
      if (qty <= 45) return 'veh-3';
      return 'veh-4';
    }

    expect(pickVehicleTier(8)).toBe('veh-1'); // Auto Tipper
    expect(pickVehicleTier(20)).toBe('veh-2'); // Bolero Pickup
    expect(pickVehicleTier(40)).toBe('veh-3'); // Tata 407
    expect(pickVehicleTier(80)).toBe('veh-4'); // Heavy Truck
  });
});
