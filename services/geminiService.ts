import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from "../types";

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  if (!ingredients || ingredients.length === 0) {
    return [];
  }

  // Initialize inside function to ensure environment variables are ready
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    I have the following ingredients in my kitchen: ${ingredients.join(', ')}.
    Please suggest 3 distinct and delicious recipes I can make. 
    You can assume I have basic pantry staples like salt, pepper, oil, water, flour, and sugar.
    
    For each recipe, provide:
    1. A creative title.
    2. A brief, appetizing description.
    3. Estimated cooking time (e.g., "30 mins").
    4. Difficulty level (Easy, Medium, or Hard).
    5. A specific list of ingredients (including quantities if possible).
    6. Step-by-step cooking instructions.
    7. Approximate calories per serving.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class chef focused on sustainable, home-style cooking. Your recipes are clear, accurate, and optimized for minimizing food waste. Return the response as a JSON array.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              cookingTime: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              instructions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              calories: { type: Type.NUMBER },
            },
            required: ['title', 'description', 'cookingTime', 'difficulty', 'ingredients', 'instructions'],
          },
        },
      },
    });

    let text = response.text;
    if (!text) return [];

    // Clean up markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const recipes: Recipe[] = JSON.parse(text);
    return recipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. Please try again.");
  }
};