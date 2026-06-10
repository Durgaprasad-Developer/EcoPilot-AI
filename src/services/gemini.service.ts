'use server';

import { GoogleGenAI } from '@google/genai';
import { aiExtractionSchema, type AIExtraction } from '../validators/schema';

// Initialize the Gemini client using the environment variable
// Server action means this runs on the server, so we can use process.env securely
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `
You are an expert AI sustainability assistant.
The user will provide a natural language description of their daily activities.
Your task is to extract the activities and categorize them into: 'transport', 'food', 'energy', 'shopping', or 'other'.
For each activity, estimate the carbon footprint in kg CO2e, and provide a short, personalized insight on how to reduce it, along with reasoning for the estimation.
Provide general feedback for the entire set of activities.

You MUST respond in strictly valid JSON matching this schema exactly, and nothing else (no markdown wrapping).
Schema:
{
  "activities": [
    {
      "description": "Short description of what the user did",
      "category": "transport|food|energy|shopping|other",
      "estimatedCarbon": <number in kg CO2e>,
      "insight": "1 sentence practical tip",
      "reasoning": "1 sentence explaining the carbon estimate"
    }
  ],
  "generalFeedback": "1-2 sentences of encouraging overall feedback"
}
`;

export async function extractActivitiesAction(userInput: string): Promise<AIExtraction> {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nUser Input: " + userInput }] }
      ],
      config: {
          temperature: 0.2, // low temperature for deterministic parsing
          responseMimeType: "application/json"
      }
    });
    
    const responseText = response.text || '';
    
    let jsonData;
    try {
      jsonData = JSON.parse(responseText);
    } catch {
      const cleanText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
      jsonData = JSON.parse(cleanText);
    }

    return aiExtractionSchema.parse(jsonData);
    
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to process activities. Please try again.");
  }
}
