import { describe, it, expect } from 'vitest';
import { carbonService } from '../services/carbon.service';

describe('Carbon Service', () => {
  it('should calculate emissions correctly for transport', () => {
    const result = carbonService.calculateEmission('transport', 10);
    // 10 * 0.2 = 2.0
    expect(result).toBe(2);
  });

  it('should calculate emissions correctly for food', () => {
    const result = carbonService.calculateEmission('food', 2);
    // 2 * 2.5 = 5.0
    expect(result).toBe(5);
  });

  it('should fallback to other category for unknown categories', () => {
    // @ts-expect-error testing invalid category
    const result = carbonService.calculateEmission('unknown', 1);
    // 1 * 1.0 = 1.0
    expect(result).toBe(1);
  });

  it('should return correct daily assessment label', () => {
    expect(carbonService.getDailyAssessment(-5).label).toBe('Net Positive (Eco-Hero!)');
    expect(carbonService.getDailyAssessment(5).label).toBe('Excellent');
    expect(carbonService.getDailyAssessment(15).label).toBe('Good');
    expect(carbonService.getDailyAssessment(35).label).toBe('Average');
    expect(carbonService.getDailyAssessment(100).label).toBe('High');
  });

  it('should handle invalid quantities gracefully', () => {
    expect(carbonService.calculateEmission('transport', NaN)).toBe(0);
    expect(carbonService.calculateEmission('transport', -10)).toBe(0);
    expect(carbonService.calculateEmission('transport', Infinity)).toBe(0);
  });
});
