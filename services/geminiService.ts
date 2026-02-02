
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

export interface WeatherDay {
  day: string;
  temp: string;
  condition: string;
  risk_level: 'Low' | 'Med' | 'High';
  risk_reason: string;
}

/**
 * Analyzes crop images using Gemini-3-flash-preview with multimodal input and search grounding.
 */
export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: "Analyze this agricultural image for signs of crop disease. Provide a diagnosis in JSON format including: crop_type (Tomato, Potato, Corn, Rice, or Unknown), disease_name, scientific_name (if applicable), confidence_score (0-100), severity_level (Mild, Moderate, or Severe), a concise expert description, and 4 specific agronomic solutions." },
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
      ]
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
          possible_solutions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["crop_type", "disease_name", "confidence_score", "severity_level", "description", "possible_solutions"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "{}";
  let parsed = JSON.parse(text);

  const groundingLinks: { title: string; uri: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        groundingLinks.push({ title: chunk.web.title || "External Source", uri: chunk.web.uri });
      }
    });
  }

  return {
    ...parsed,
    crop_type: parsed.crop_type as CropType,
    severity_level: parsed.severity_level as SeverityLevel,
    grounding_links: groundingLinks
  };
};

/**
 * Fetches real-time weather using Gemini Search grounding, focused on agricultural risk.
 */
export const getWeatherForecast = async (location: string): Promise<{ forecast: WeatherDay[], alert?: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Get a real-time 5-day weather forecast for ${location}. Focus on data critical for farming: humidity, precipitation, and extreme temps. 
    Evaluate agronomic risk level (Low/Med/High) for each day (e.g., High humidity + moderate temp = High risk for fungal blight).
    Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alert: { type: Type.STRING, description: "Any major regional weather warning" },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "Short day name, e.g., MON" },
                temp: { type: Type.STRING, description: "High temperature in Celsius, e.g., 28°" },
                condition: { type: Type.STRING, description: "Single word weather condition" },
                risk_level: { type: Type.STRING, description: "Low, Med, or High" },
                risk_reason: { type: Type.STRING, description: "Short reason for the risk level" }
              },
              required: ["day", "temp", "condition", "risk_level", "risk_reason"]
            }
          }
        },
        required: ["forecast"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const parsed = JSON.parse(response.text || '{"forecast": []}');
  return parsed;
};

/**
 * Communicates with the Agronomist Expert AI model with full conversation history.
 */
export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chatHistory = history.map(m => ({ role: m.role, parts: m.parts }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...chatHistory, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: "You are a world-class Agronomist Expert. Use Google Search for regional agricultural alerts.",
      tools: [{ googleSearch: {} }]
    }
  });

  const groundingLinks: { title: string; uri: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        groundingLinks.push({ title: chunk.web.title || "Field Resource", uri: chunk.web.uri });
      }
    });
  }

  return { 
    text: response.text || "Connection error.", 
    links: groundingLinks 
  };
};
