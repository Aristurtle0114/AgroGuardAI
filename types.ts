
export type CropType = 'Tomato' | 'Potato' | 'Corn' | 'Rice' | 'Unknown';

export type SeverityLevel = 'Mild' | 'Moderate' | 'Severe';

export type Theme = 'light' | 'dark';

export interface DiseaseInfo {
  id: string;
  crop_type: CropType;
  common_name: string;
  scientific_name?: string;
  description: string;
  symptoms: string[];
  causes: string;
  prevention_tips: string[];
}

export interface DetectionResult {
  id: string;
  user_id: string;
  crop_type: CropType;
  disease_name: string;
  scientific_name?: string;
  confidence_score: number;
  severity_level: SeverityLevel;
  image_url: string;
  created_at: string;
  possible_solutions?: string[];
  grounding_links?: { title: string; uri: string }[];
}

export interface User {
  id: string;
  ticket_code: string;
}

export interface UserProfile {
  id: string;
  farm_name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  farm_size_hectares: number;
  primary_crops: CropType[];
  profile_picture_url?: string;
}

export interface Treatment {
  id: string;
  disease_id: string;
  treatment_name: string;
  treatment_type: 'Organic' | 'Chemical' | 'Biological';
  instructions: string;
  dosage: string;
  application_method: string;
  frequency: string;
  cost_estimate_min: number;
  cost_estimate_max: number;
  currency: string;
  safety_precautions: string;
  expected_results: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  links?: { title?: string; uri?: string }[];
}
