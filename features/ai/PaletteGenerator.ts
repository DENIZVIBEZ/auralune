
import { GoogleGenAI, Type } from "@google/genai";
import { useAppStore } from '../../app/store';
import { SceneRegistry } from '../scenes/SceneRegistry';

// Initialize the Gemini AI client
// The API key is assumed to be in the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a color palette for the currently active scene based on a user prompt.
 * @param userPrompt - The theme or mood described by the user (e.g., "Synthwave sunset").
 * @returns A promise that resolves to an object mapping scene color parameters to hex color codes.
 * @throws An error if the API call fails or the response is invalid.
 */
export async function generatePalette(userPrompt: string): Promise<Record<string, string>> {
  const { activeSceneId } = useAppStore.getState();
  const sceneDef = SceneRegistry.get(activeSceneId);

  if (!sceneDef) {
    throw new Error("Active scene definition not found.");
  }

  // Find all color parameters for the current scene
  const colorParams = Object.entries(sceneDef.paramsSchema)
    .filter(([, schema]) => schema.type === 'color')
    .map(([key, schema]) => ({ key, label: schema.label }));

  if (colorParams.length === 0) {
    // Gracefully handle scenes with no color parameters
    throw new Error("The current scene has no color parameters to change.");
  }
  
  // Dynamically build the response schema for the Gemini API
  const properties = colorParams.reduce((acc, { key, label }) => {
    acc[key] = {
      type: Type.STRING,
      description: `A creative hex color code for '${label}'.`
    };
    return acc;
  }, {} as Record<string, any>);

  const responseSchema = {
    type: Type.OBJECT,
    properties,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a creative color palette for the theme: "${userPrompt}".`,
      config: {
        systemInstruction: "You are an expert color palette designer for 3D visual art. Respond only with the JSON object containing hex color codes.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI.");
    }

    const palette = JSON.parse(jsonText);
    
    // Validate the palette to ensure colors are in the correct hex format
    for (const key in palette) {
        if (typeof palette[key] !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(palette[key])) {
            console.warn(`AI returned an invalid color for ${key}: ${palette[key]}. Skipping.`);
            delete palette[key];
        }
    }

    return palette;

  } catch (error) {
    console.error("Error generating palette with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI Palette Generation Failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI palette generation.");
  }
}
