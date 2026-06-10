import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractActivitiesAction } from '../services/gemini.service';

// Mock process.env keys
process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'mock-gemini-key';
process.env.NEXT_PUBLIC_OPENROUTE_API_KEY = 'mock-openrouter-key';

const { mockGenerateContent } = vi.hoisted(() => {
  return {
    mockGenerateContent: vi.fn()
  };
});

// Mock the GoogleGenAI SDK
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
    }
  };
});

describe('Gemini AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should successfully parse activities via Gemini SDK when available', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        activities: [
          {
            description: "Drove 10km in gas car",
            category: "transport",
            estimatedCarbon: 2.0,
            insight: "Try carpooling next time.",
            reasoning: "Gas cars average 0.2kg CO2e per km."
          }
        ],
        generalFeedback: "Keep up the good tracking!"
      })
    });

    const result = await extractActivitiesAction("Drove 10km in gas car");
    expect(result.activities).toHaveLength(1);
    expect(result.activities[0].estimatedCarbon).toBe(2);
    expect(result.generalFeedback).toBe("Keep up the good tracking!");
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('should fallback to gemini-2.5-pro when primary gemini-2.5-flash fails', async () => {
    // 1st call fails, 2nd call succeeds
    mockGenerateContent
      .mockRejectedValueOnce(new Error("Gemini 2.5 Flash quota exceeded"))
      .mockResolvedValueOnce({
        text: JSON.stringify({
          activities: [
            {
              description: "Ate beef burger",
              category: "food",
              estimatedCarbon: 2.5,
              insight: "Substitute beef for poultry.",
              reasoning: "Beef has high emissions."
            }
          ],
          generalFeedback: "Solid food choices today."
        })
      });

    const result = await extractActivitiesAction("Ate beef burger");
    expect(result.activities).toHaveLength(1);
    expect(result.activities[0].estimatedCarbon).toBe(2.5);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('should return cached response on subsequent identical prompts without calling SDK', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({
        activities: [
          {
            description: "Ate salad",
            category: "food",
            estimatedCarbon: 0.5,
            insight: "Great healthy low-carbon choice.",
            reasoning: "Veggies have low emissions."
          }
        ],
        generalFeedback: "Excellent!"
      })
    });

    // First call triggers API
    const result1 = await extractActivitiesAction("Ate salad");
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);

    // Second call serves from cache
    const result2 = await extractActivitiesAction("Ate salad");
    expect(result2).toEqual(result1);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1); // Still 1 call
  });
});
