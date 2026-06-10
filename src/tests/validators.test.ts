import { describe, it, expect } from 'vitest';
import { activitySchema } from '../validators/schema';

describe('Validators', () => {
  it('should validate correct activity data', () => {
    const validData = {
      description: "Drove to work",
      category: "transport",
      carbonAmount: 2.5,
      date: new Date().toISOString()
    };
    expect(() => activitySchema.parse(validData)).not.toThrow();
  });

  it('should fail on invalid carbon amount', () => {
    const invalidData = {
      description: "Drove to work",
      category: "transport",
      carbonAmount: -5, // invalid
      date: new Date().toISOString()
    };
    expect(() => activitySchema.parse(invalidData)).toThrow();
  });
});
