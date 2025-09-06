import { GoogleGenAI, Type } from "@google/genai";
import { useAppStore } from '../../app/store';
import type { CameraKeyframe } from '../../types/ai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a camera animation path based on a user prompt.
 * @param userPrompt - The description of the desired camera movement.
 * @returns A promise that resolves to an array of CameraKeyframe objects.
 */
export async function generateCameraPath(userPrompt: string): Promise<CameraKeyframe[]> {
  const { duration } = useAppStore.getState();

  if (duration <= 0) {
    throw new Error("Please load an audio file first to set a video duration.");
  }

  // Define the JSON schema for the expected response from the AI
  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.NUMBER, description: "Time in seconds for this keyframe." },
        position: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER },
          description: "Camera [x, y, z] position.",
        },
        lookAt: {
          type: Type.ARRAY,
          items: { type: Type.NUMBER },
          description: "Target [x, y, z] for the camera to look at.",
        },
        fov: { type: Type.NUMBER, description: "Vertical field of view in degrees." },
      },
      required: ["time", "position", "lookAt", "fov"],
    },
  };
  
  const fullPrompt = `You are a professional virtual cinematographer. Create a camera animation path for a ${duration.toFixed(1)}-second video based on this instruction: "${userPrompt}". 
The animation must start at time 0 and end at or before ${duration.toFixed(1)} seconds. The scene is centered around (0,0,0) and objects of interest are within a 10-unit radius sphere. 
Generate at least 3 keyframes. The first keyframe must be at time=0. The final keyframe time should be less than or equal to the total duration. Respond ONLY with the JSON object.`;


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: "You are a virtual cinematographer that only responds with JSON.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI.");
    }
    
    const path = JSON.parse(jsonText) as CameraKeyframe[];
    
    // Basic validation of the returned path
    if (!Array.isArray(path) || path.length < 2) {
        throw new Error("AI returned an invalid or insufficient path.");
    }
    // Further validation could be added here to check keyframe structure

    return path;

  } catch (error) {
    console.error("Error generating camera path with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI Path Generation Failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during AI path generation.");
  }
}
