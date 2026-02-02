import { GoogleGenAI, Type } from "@google/genai";
import { CropType, SeverityLevel, ChatMessage } from '../types';

// The API key is obtained from process.env.API_KEY which is shimmed in index.html
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface AIDetectionResponse {
  crop_type: CropType;
  disease_name: string;
  confidence_score: number;
  severity_level: SeverityLevel;
  scientific_name?: string;
  description: string;
  grounding_links?: { title: string; uri: string }[];
}

export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
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
          text: `Analyze this crop image for potential diseases. Identify the crop type and specific disease. Provide output in JSON.`,
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

  if (data.disease_name !== 'Healthy' && data.disease_name !== 'Unknown') {
    try {
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Latest treatment protocols for ${data.disease_name} in ${data.crop_type} crops.`,
        config: { tools: [{ googleSearch: {} }] },
      });

      const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      data.grounding_links = chunks
        .filter(c => c.web)
        .map(c => ({
          title: c.web?.title || 'External Resource',
          uri: c.web?.uri || '',
        }))
        .slice(0, 3);
    } catch (e) {
      data.grounding_links = [];
    }
  }

  return data as AIDetectionResponse;
};

export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Expert Agronomist AI assistance.',
      tools: [{ googleSearch: {} }],
    },
  });
  const response = await chat.sendMessage({ message });
  const text = response.text || "I'm sorry, I couldn't process that.";
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links = grounding.filter(c => c.web).map(c => ({ title: c.web?.title, uri: c.web?.uri }));
  return { text, links };
};