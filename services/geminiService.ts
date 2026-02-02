import { GoogleGenAI, Type } from "@google/genai";
import { CropType, SeverityLevel, ChatMessage } from '../types';

export interface AIDetectionResponse {
  crop_type: CropType;
  disease_name: string;
  confidence_score: number;
  severity_level: SeverityLevel;
  scientific_name?: string;
  description: string;
  possible_solutions: string[];
  grounding_links?: { title: string; uri: string }[];
}

/**
 * Creates a fresh instance of the AI client using the project's API_KEY environment variable.
 */
const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is not configured. Please use the selection dialog to connect your project.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
  const ai = createClient();
  
  try {
    // Stage 1: Visual Analysis with gemini-3-pro for complex diagnostic reasoning
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
            text: `As an expert agronomist, analyze this crop leaf/plant image. 
            1. Identify the crop type.
            2. Identify any visible diseases or nutritional deficiencies.
            3. Assess severity (Mild, Moderate, Severe).
            4. Provide a scientific name and a detailed description of the symptoms.
            5. List 3-5 immediate actionable steps for treatment.
            
            Return the analysis in a structured JSON format.`,
          },
        ],
      },
      config: {
        thinkingConfig: { thinkingBudget: 16384 },
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
            possible_solutions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ["crop_type", "disease_name", "confidence_score", "severity_level", "description", "possible_solutions"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI failed to provide a readable analysis.");
    
    const data = JSON.parse(resultText);

    // Stage 2: Grounding with Google Search for recent treatment protocols
    if (data.disease_name && data.disease_name.toLowerCase() !== 'healthy') {
      try {
        const searchResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Current best practices and treatment resources for ${data.disease_name} in ${data.crop_type} crops for 2024-2025.`,
          config: { 
            tools: [{ googleSearch: {} }] 
          },
        });

        const chunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        data.grounding_links = chunks
          .filter(c => c.web)
          .map(c => ({
            title: c.web?.title || 'Agricultural Resource',
            uri: c.web?.uri || '',
          }))
          .filter(link => link.uri)
          .slice(0, 3);
      } catch (e) {
        console.warn("Grounding tool failed, proceeding with visual analysis only.", e);
      }
    }

    return data as AIDetectionResponse;
  } catch (error: any) {
    console.error('AgroGuard AI Service Error:', error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("RESELECT_KEY");
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
        systemInstruction: 'You are AgroGuard Advisor, a world-class agronomist. Provide detailed, scientifically-backed advice on crop management, pest control, and soil health. Always look for the most recent agricultural research using your search tools.',
        tools: [{ googleSearch: {} }],
      },
    });
    
    const response = await chat.sendMessage({ message });
    const text = response.text || "I'm analyzing your farm query...";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = groundingChunks
      .filter(c => c.web)
      .map(c => ({ title: c.web?.title, uri: c.web?.uri }))
      .filter(l => l.uri);

    return { text, links };
  } catch (error: any) {
    console.error('AgroGuard Chat Error:', error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("RESELECT_KEY");
    }
    throw error;
  }
};