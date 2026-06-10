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
  let responseText = '';

  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing.");
    }

    // Attempt 1: Gemini Direct via SDK
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
    
    responseText = response.text || '';
    
  } catch (error) {
    console.warn("Gemini Direct Error, falling back to OpenRouter:", error);
    
    // Attempt 2: Fallback to OpenRouter (using Gemini via OpenRouter or Llama)
    if (!process.env.NEXT_PUBLIC_OPENROUTE_API_KEY) {
      throw new Error("OpenRouter API Key is missing. Both primary and fallback failed.");
    }

    try {
      const fallbackResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku", // High-reliability diverse model via OpenRouter
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: "User Input: " + userInput }
          ]
        })
      });

      if (!fallbackResponse.ok) {
        throw new Error(`OpenRouter API failed with status: ${fallbackResponse.status}`);
      }

      const data = await fallbackResponse.json();
      responseText = data.choices?.[0]?.message?.content || '';
      
    } catch (fallbackError) {
      console.error("OpenRouter Fallback Error:", fallbackError);
      throw new Error("Failed to process activities via both Gemini and OpenRouter. Please try again.");
    }
  }

  // Parse and validate the response
  let jsonData;
  try {
    jsonData = JSON.parse(responseText);
  } catch {
    const cleanText = responseText.replace(/^```json\n/, '').replace(/\n```$/, '');
    jsonData = JSON.parse(cleanText);
  }

  return aiExtractionSchema.parse(jsonData);
}
