import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We use the flash model for speed in generating recipes
const MODEL_NAME = "gemini-2.5-flash";

export const generateRecipes = async (profile: UserProfile, count: number = 4): Promise<Recipe[]> => {
  const prompt = `
    Generate ${count} distinct, gut-health focused recipes tailored for a user with the following profile:
    Dietary Restrictions: ${profile.restrictions.join(", ") || "None"}
    Intolerances/Triggers: ${profile.intolerances.join(", ") || "None"}
    Health Goals: ${profile.goals.join(", ") || "General gut health"}
    
    Ensure recipes focus on fiber diversity, prebiotics, and probiotics where appropriate.
    Avoid common triggers listed.
    
    Return the response as a valid JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              prepTime: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.STRING },
                    category: { type: Type.STRING }
                  }
                }
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              gutBenefits: { type: Type.STRING, description: "Specific explanation of why this recipe aids gut health (e.g. resistant starch, polyphenols)." },
              imageKeyword: { type: Type.STRING, description: "A single word describing the main dish for image search (e.g. 'salad', 'soup', 'salmon')." }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Recipe[];
    }
    return [];
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};

export const generateDailyTip = async (profile: UserProfile): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Give me a short, 2-sentence actionable tip about the gut-brain axis or fiber diversity specifically for someone who is ${profile.restrictions.join(", ")}.`,
        });
        return response.text || "Eat a diverse range of plants to support your microbiome!";
    } catch (e) {
        return "Stay hydrated and eat plenty of fiber!";
    }
}

export const explainIngredient = async (ingredient: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `Briefly explain (max 30 words) the gut health benefits of: ${ingredient}.`,
        });
        return response.text || "Good for nutrition.";
    } catch (e) {
        return "Nutritious ingredient.";
    }
}
