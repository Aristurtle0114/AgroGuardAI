
import { GoogleGenAI, Type } from "@google/genai";
import { CropType, SeverityLevel, ChatMessage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const model = 'gemini-3-flash-preview';

  // Analyze the image first
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `Analyze this crop image for potential diseases. Identify the crop type (Tomato, Potato, Corn, Rice, or Unknown) and the specific disease. 
          
          Provide the output in JSON format with the following schema.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          crop_type: { type: Type.STRING, description: "Tomato, Potato, Corn, Rice, or Unknown" },
          disease_name: { type: Type.STRING, description: "Common name of the disease or 'Healthy'" },
          scientific_name: { type: Type.STRING, description: "Scientific name of the pathogen" },
          confidence_score: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
          severity_level: { type: Type.STRING, description: "Mild, Moderate, or Severe" },
          description: { type: Type.STRING, description: "Short summary of detection" },
        },
        required: ["crop_type", "disease_name", "confidence_score", "severity_level", "description"],
      },
    },
  });

  const data = JSON.parse(response.text || '{}');

  // If it's a disease, fetch latest treatment news via Google Search
  if (data.disease_name !== 'Healthy') {
    const searchResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find the latest 2024/2025 treatment protocols and product availability for ${data.disease_name} in ${data.crop_type} crops.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    data.grounding_links = chunks
      .filter(c => c.web)
      .map(c => ({
        title: c.web?.title || 'External Resource',
        uri: c.web?.uri || '',
      }))
      .slice(0, 3);
  }

  return data as AIDetectionResponse;
};

export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are an expert Agronomist AI. Provide practical, sustainable, and scientifically accurate advice to farmers. Use Google Search to find latest pest alerts or treatment prices if relevant.',
      tools: [{ googleSearch: {} }],
    },
  });

  // Since we aren't maintaining stateful server-side chats here, we pass the full history
  // In a real app, you'd use the chat object continuously.
  const response = await chat.sendMessage({ message });
  
  const text = response.text || "I'm sorry, I couldn't process that request.";
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links = grounding.filter(c => c.web).map(c => ({ title: c.web?.title, uri: c.web?.uri }));

  return { text, links };
};
