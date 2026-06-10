import { z } from 'zod';

export const activitySchema = z.object({
  description: z.string().min(1, "Description is required"),
  category: z.enum(['transport', 'food', 'energy', 'shopping', 'other']),
  carbonAmount: z.number().min(0, "Carbon amount must be positive"),
  date: z.string().datetime(),
  aiInsight: z.string().optional()
});

export const aiExtractionSchema = z.object({
  activities: z.array(z.object({
    description: z.string(),
    category: z.enum(['transport', 'food', 'energy', 'shopping', 'other']),
    estimatedCarbon: z.number(),
    insight: z.string(),
    reasoning: z.string()
  })),
  generalFeedback: z.string()
});

export type AIExtraction = z.infer<typeof aiExtractionSchema>;
