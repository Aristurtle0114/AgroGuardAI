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
 * Simulated crop analysis for demo mode.
 * Returns a random mock result after a realistic delay.
 */
export const analyzeCropImage = async (base64Image: string): Promise<AIDetectionResponse> => {
  // Simulate network/processing delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  const mockResults: AIDetectionResponse[] = [
    {
      crop_type: 'Tomato',
      disease_name: 'Early Blight',
      scientific_name: 'Alternaria solani',
      confidence_score: 94.2,
      severity_level: 'Moderate',
      description: 'The image shows characteristic "target" spots with concentric rings on the lower leaves, typical of Early Blight fungal infection.',
      possible_solutions: [
        'Apply copper-based fungicides immediately to prevent spread.',
        'Prune the lower infected leaves to improve air circulation.',
        'Avoid overhead watering; switch to drip irrigation to keep foliage dry.',
        'Apply a layer of mulch to prevent soil-borne spores from splashing onto leaves.'
      ],
      grounding_links: [
        { title: 'Cornell AG: Managing Early Blight', uri: 'https://vegetablemdonline.ppath.cornell.edu/' },
        { title: 'Organic Control Protocols', uri: 'https://omri.org/' }
      ]
    },
    {
      crop_type: 'Corn',
      disease_name: 'Common Rust',
      scientific_name: 'Puccinia sorghi',
      confidence_score: 88.5,
      severity_level: 'Mild',
      description: 'Elongated brownish pustules are visible on both upper and lower leaf surfaces. The infection is currently localized.',
      possible_solutions: [
        'Monitor weather conditions; rust thrives in high humidity and cool temperatures.',
        'Utilize resistant hybrids for the next planting season.',
        'Foliar fungicides are rarely economical unless infection occurs before silking.',
        'Ensure proper nitrogen levels to help the plant maintain vigor.'
      ],
      grounding_links: [
        { title: 'Crop Protection Network: Rust Guide', uri: 'https://cropprotectionnetwork.org/' }
      ]
    }
  ];

  // Return a random mock result or the first one
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};

/**
 * Simulated chat interaction for demo mode.
 */
export const chatWithExpert = async (history: ChatMessage[], message: string) => {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const text = "This is a simulated expert response for the demo version. In a live environment, I would analyze your specific soil data, regional weather patterns, and the detection history of your farm ticket to provide precise agronomic advice. For now, please feel free to explore the UI!";
  
  const links = [
    { title: 'Regional Weather Outlook', uri: '#' },
    { title: 'Pest Management Calendar', uri: '#' }
  ];

  return { text, links };
};
