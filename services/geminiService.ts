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

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("CRITICAL: Gemini API Key is missing. Check Vercel Environment Variables.");
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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

    if (data.disease_name && data.disease_name !== 'Healthy' && data.disease_name !== 'Unknown') {
      try {
        const searchResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide 3 reliable online resources or treatment guides for ${data.disease_name} in ${data.crop_type} crops.`,
          config: { tools: [{ googleSearch: {} }] },
        });

        const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        data.grounding_links = chunks
          .filter(c => c.web)
          .map(c => ({
            title: c.web?.title || 'Expert Resource',
            uri: c.web?.uri || '',
          }))
          .filter(link => link.uri)
          .slice(0, 3);
      } catch (e) {
        console.warn("Grounding search failed:", e);
        data.grounding_links = [];
      }
    }

    return data as AIDetectionResponse;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error('Analysis failed. Please check the console for details.');
  }
};

export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const ai = getAI();
  
  try {
    // Clean history to match SDK expectations (role and parts only)
    const cleanedHistory = history.map(h => ({
      role: h.role,
      parts: h.parts
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: cleanedHistory,
      config: {
        systemInstruction: 'You are an Expert Agronomist AI. Provide helpful, accurate advice to farmers regarding crop health and soil management. Use Google Search to find specific regional details if needed.',
        tools: [{ googleSearch: {} }],
      },
    });
    
    const response = await chat.sendMessage({ message });
    const text = response.text || "I am currently processing your request.";
    
    // Extract links from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks
      .filter(c => c.web)
      .map(c => ({ title: c.web?.title, uri: c.web?.uri }))
      .filter(l => l.uri);

    return { text, links };
  } catch (error: any) {
    console.error('Gemini Chat Error Details:', {
      message: error.message,
      status: error.status,
      stack: error.stack
    });
    throw error;
  }
};