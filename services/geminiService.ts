
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

export interface WeatherForecastResponse {
  forecast: WeatherDay[];
  alert?: string;
  links?: { title: string; uri: string }[];
}

export interface MarketPrice {
  crop: string;
  price: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  source_summary: string;
}


const getGenAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    console.error("CRITICAL: VITE_GEMINI_API_KEY is missing!");
    alert("API Key is missing. Please check .env file and restart the server.");
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in .env");
  }
  return new GoogleGenAI({ apiKey: key });
};

/**
 * Analyzes crop images using Gemini-3-flash-preview with multimodal input.
 */
export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
  const ai = getGenAI();

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
      }
    }
  });

  const text = response.text || "{}";
  let parsed = JSON.parse(text);

  return {
    ...parsed,
    crop_type: parsed.crop_type as CropType,
    severity_level: parsed.severity_level as SeverityLevel,
  };
};

/**
 * Fetches real-time weather using Gemini Search and Maps grounding.
 */
export const getWeatherForecast = async (location: string, lat?: number, lng?: number): Promise<WeatherForecastResponse> => {
  const ai = getGenAI();

  const locationString = lat && lng ? `coordinates ${lat}, ${lng}` : location;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: `Get a real-time hyper-local 5-day weather forecast for ${locationString}. 
    Focus on data critical for farming: humidity, precipitation, and extreme temps for these specific coordinates. 
    Evaluate agronomic risk level (Low/Med/High) for each day (e.g., High humidity + moderate temp = High risk for fungal blight).
    Return the data as a JSON block with the following structure:
    {
      "alert": "major regional warning or null",
      "forecast": [
        {"day": "MON", "temp": "28°", "condition": "Sunny", "risk_level": "Low", "risk_reason": "Clear skies"}
      ]
    }`,
    config: {
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
        }
      }
    }
  });

  const text = response.text || "";
  let parsed: any = { forecast: [] };

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error("Weather JSON extraction failed:", err);
  }

  const groundingLinks: { title: string; uri: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        groundingLinks.push({ title: chunk.web.title || "Weather Source", uri: chunk.web.uri });
      }
      if (chunk.maps?.uri) {
        groundingLinks.push({ title: chunk.maps.title || "Location Reference", uri: chunk.maps.uri });
      }
    });
  }

  return {
    ...parsed,
    links: groundingLinks
  };
};

/**
 * Fetches current market prices for major Philippine crops using Google Search grounding.
 */
export const getMarketPrices = async (): Promise<{ prices: MarketPrice[], links: { title: string, uri: string }[] }> => {
  const ai = getGenAI();

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Provide the current market prices (PHP) for famous crops in the Philippines: Palay (Rice), Corn (Yellow), Coconut (Copra), Sugarcane, Banana (Lakatan), Pineapple, and Mango. Include the price, unit (e.g., per kg), and a general trend.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                crop: { type: Type.STRING },
                price: { type: Type.STRING },
                unit: { type: Type.STRING },
                trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] },
                source_summary: { type: Type.STRING }
              },
              required: ["crop", "price", "unit", "trend"]
            }
          }
        },
        required: ["prices"]
      },
      tools: [{ googleSearch: {} }]
    }
  });

  const parsed = JSON.parse(response.text || '{"prices": []}');

  const groundingLinks: { title: string; uri: string }[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        groundingLinks.push({ title: chunk.web.title || "Market Source", uri: chunk.web.uri });
      }
    });
  }

  return {
    prices: parsed.prices,
    links: groundingLinks
  };
};

/**
 * Communicates with the Agronomist Expert AI model with full conversation history.
 */
export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  const ai = getGenAI();
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
