import { DiseaseInfo, Treatment } from './types';

export const SUPPORTED_DISEASES: DiseaseInfo[] = [
  {
    id: 'd1',
    crop_type: 'Tomato',
    common_name: 'Early Blight',
    scientific_name: 'Alternaria solani',
    description: 'A common fungal disease that affects tomato leaves, stems, and fruit.',
    symptoms: [
      'Dark brown spots with concentric rings',
      'Yellowing around spots',
      'Leaf drop'
    ],
    causes: 'Alternaria solani fungus.',
    prevention_tips: [
      'Crop rotation',
      'Proper spacing',
      'Watering at soil level'
    ]
  },
  {
    id: 'd2',
    crop_type: 'Tomato',
    common_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    description: 'Devastating disease that spreads quickly in cool, wet weather.',
    symptoms: [
      'Large irregular water-soaked spots',
      'White fungal growth on undersides',
      'Brown blotches on fruit'
    ],
    causes: 'Phytophthora infestans oomycete.',
    prevention_tips: [
      'Use resistant varieties',
      'Destroy infected plants',
      'Improve airflow'
    ]
  }
];

export const MOCK_TREATMENTS: Record<string, Treatment[]> = {
  'd1': [
    {
      id: 't1',
      disease_id: 'd1',
      treatment_name: 'Copper Fungicide',
      treatment_type: 'Chemical',
      instructions: 'Spray every 7-10 days.',
      dosage: '2 tbsp per gallon',
      application_method: 'Foliar spray',
      frequency: 'Every 7 days',
      cost_estimate_min: 15,
      cost_estimate_max: 25,
      currency: 'USD',
      safety_precautions: 'Wear PPE.',
      expected_results: 'Control of fungal spread.'
    }
  ],
  'd2': [
    {
      id: 't2',
      disease_id: 'd2',
      treatment_name: 'Mancozeb',
      treatment_type: 'Chemical',
      instructions: 'Apply at first sign of symptoms.',
      dosage: '1.5 lbs/acre',
      application_method: 'Pressure sprayer',
      frequency: 'Every 5 days',
      cost_estimate_min: 30,
      cost_estimate_max: 50,
      currency: 'USD',
      safety_precautions: 'Full PPE required.',
      expected_results: 'Stopping active infection cycle.'
    }
  ]
};