import { describe, it, expect } from 'vitest';
import fposData from '../../data/fpos.json';

describe('FPO Support Module Data & Logic', () => {
  it('contains simulated flag and honest mock disclaimer', () => {
    expect(fposData.simulated).toBe(true);
    expect(fposData.disclaimer).toBeDefined();
    expect(fposData.disclaimer).toContain('Simulated sample FPOs');
  });

  it('validates each FPO record structure', () => {
    fposData.fpos.forEach((fpo) => {
      expect(fpo.id).toBeDefined();
      expect(fpo.name.length).toBeGreaterThan(5);
      expect(fpo.registrationNo).toContain('Demo');
      expect(fpo.memberCount).toBeGreaterThan(100);
      expect(fpo.focusCrops.length).toBeGreaterThanOrEqual(1);
      expect(fpo.keyBenefits.length).toBeGreaterThanOrEqual(2);
      expect(fpo.collectiveSellingBonus).toBeDefined();
      expect(fpo.simulated).toBe(true);
    });
  });

  it('correctly filters FPOs by handled crop', () => {
    const wheatFpos = fposData.fpos.filter((f) => f.focusCrops.includes('wheat'));
    const onionFpos = fposData.fpos.filter((f) => f.focusCrops.includes('onion'));

    expect(wheatFpos.length).toBeGreaterThanOrEqual(2);
    expect(onionFpos.length).toBeGreaterThanOrEqual(1);
  });
});
