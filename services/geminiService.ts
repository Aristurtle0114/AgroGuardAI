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
    console.warn("Gemini API Key is missing. Some features may not work.");
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
            title: c.web?.title || 'Resource',
            uri: c.web?.uri || '',
          }))
          .filter(link => link.uri)
          .slice(0, 3);
      } catch (e) {
        data.grounding_links = [];
      }
    }

    return data as AIDetectionResponse;
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw new Error('Analysis failed. Please try again with a clearer image.');
  }
};

export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const ai = getAI();
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'You are an Expert Agronomist AI. Provide helpful, accurate advice to farmers regarding crop health and soil management.',
        tools: [{ googleSearch: {} }],
      },
    });
    const response = await chat.sendMessage({ message });
    const text = response.text || "I'm having trouble connecting to my knowledge base.";
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = grounding.filter(c => c.web).map(c => ({ title: c.web?.title, uri: c.web?.uri }));
    return { text, links };
  } catch (error) {
    console.error('Expert Chat Error:', error);
    throw new Error('Could not connect to the Expert AI.');
  }
};