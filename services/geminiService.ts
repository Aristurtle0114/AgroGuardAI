import { GoogleGenAI, Type } from "@google/genai";
import { CropType, SeverityLevel, ChatMessage } from '../types';

export interface AIDetectionResponse {
  crop_type: CropType;
  disease_name: string;
  confidence_score: number;
  severity_level: SeverityLevel;
  scientific_name?: string;
  description: string;
  grounding_links?: { title: string; uri: string }[];
}

/**
 * Creates a fresh instance of the AI client.
 * Must be called inside functions to ensure it uses the key selected by the user.
 */
const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured. Please select an API key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
  const ai = createClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Analyze this crop image for potential diseases. Identify the crop type and specific disease. Provide output in JSON format.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop_type: { type: Type.STRING },
            disease_name: { type: Type.STRING },
            scientific_name: { type: Type.STRING },
            confidence_score: { type: Type.NUMBER },
            severity_level: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["crop_type", "disease_name", "confidence_score", "severity_level", "description"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');

    // Only search if it's not a healthy crop
    if (data.disease_name && data.disease_name.toLowerCase() !== 'healthy') {
      try {
        const searchResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide 3 treatment resources for ${data.disease_name} in ${data.crop_type}.`,
          config: { tools: [{ googleSearch: {} }] },
        });

        const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        data.grounding_links = chunks
          .filter(c => c.web)
          .map(c => ({
            title: c.web?.title || 'Expert Guide',
            uri: c.web?.uri || '',
          }))
          .filter(link => link.uri)
          .slice(0, 3);
      } catch (e) {
        console.warn("Search grounding failed:", e);
      }
    }

    return data as AIDetectionResponse;
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("The selected API project is invalid or lacks access. Please re-select your key.");
    }
    throw error;
  }
};

export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const ai = createClient();
  
  try {
    const cleanedHistory = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: cleanedHistory,
      config: {
        systemInstruction: 'You are an Expert Agronomist AI named AgroGuard Advisor. Provide precise, scientific advice on crop health. Use your search tools to find regional treatment data.',
        tools: [{ googleSearch: {} }],
      },
    });
    
    const response = await chat.sendMessage({ message });
    const text = response.text || "I am processing your agronomic query.";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks
      .filter(c => c.web)
      .map(c => ({ title: c.web?.title, uri: c.web?.uri }))
      .filter(l => l.uri);

    return { text, links };
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("RESELECT_KEY");
    }
    throw error;
  }
};