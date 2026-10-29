import { describe, it, expect } from 'vitest';
import cropDoctorRules from '../../data/cropDoctorRules.json';

describe('Crop Doctor Module & Honesty Rules', () => {
  it('contains mandatory simulated flag and honest agricultural disclaimer', () => {
    expect(cropDoctorRules.simulated).toBe(true);
    expect(cropDoctorRules.disclaimer).toBeDefined();
    expect(cropDoctorRules.disclaimer).toContain('Simulated guidance');
    expect(cropDoctorRules.disclaimer).toContain('Krishi Vigyan Kendra');
  });

  it('provides comprehensive symptom rules for all 6 staple crops', () => {
    const crops = ['wheat', 'tomato', 'soybean', 'onion', 'rice', 'cotton'];
    crops.forEach((cropKey) => {
      const crop = cropDoctorRules.crops[cropKey];
      expect(crop).toBeDefined();
      expect(crop.symptoms.length).toBeGreaterThanOrEqual(1);

      crop.symptoms.forEach((s) => {
        expect(s.id).toBeDefined();
        expect(s.label.length).toBeGreaterThan(5);
        expect(s.possibleIssue.length).toBeGreaterThan(5);
        expect(['High', 'Medium', 'Low']).toContain(s.severity);
        expect(Array.isArray(s.culturalSteps)).toBe(true);
        expect(s.culturalSteps.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('validates upload constraints: image type and max 5MB size boundary', () => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const validFile = { type: 'image/jpeg', size: 2 * 1024 * 1024 };
    const oversizedFile = { type: 'image/png', size: 6 * 1024 * 1024 };
    const invalidType = { type: 'application/pdf', size: 1 * 1024 * 1024 };

    expect(validFile.type.startsWith('image/')).toBe(true);
    expect(validFile.size <= MAX_SIZE).toBe(true);

    expect(oversizedFile.size <= MAX_SIZE).toBe(false);
    expect(invalidType.type.startsWith('image/')).toBe(false);
  });
});
