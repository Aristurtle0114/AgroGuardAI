
import { DiseaseInfo, Treatment } from './types.ts';

export const SUPPORTED_DISEASES: DiseaseInfo[] = [
  {
    id: 'd1',
    crop_type: 'Tomato',
    common_name: 'Early Blight',
    scientific_name: 'Alternaria solani',
    description: 'Early blight is a common fungal disease that affects tomato leaves, stems, and fruit. It appears first on older, lower leaves as small brown spots with concentric rings.',
    symptoms: [
      'Dark brown spots with concentric rings on lower leaves',
      'Yellowing around spots',
      'Premature leaf drop',
      'Stem lesions near soil line'
    ],
    causes: 'Caused by fungus Alternaria solani. Thrives in warm, humid conditions.',
    prevention_tips: [
      'Practice crop rotation',
      'Remove infected plant debris',
      'Water at soil level',
      'Ensure proper spacing'
    ]
  },
  {
    id: 'd2',
    crop_type: 'Tomato',
    common_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    description: 'A devastating disease that can quickly kill plants in cool, wet weather. It affects leaves, stems, and fruit with large, water-soaked spots.',
    symptoms: [
      'Large, irregular water-soaked spots on leaves',
      'White fungal growth on leaf undersides in wet conditions',
      'Firm, dark brown blotches on green fruit'
    ],
    causes: 'Oomycete pathogen Phytophthora infestans. Spreads through airborne spores.',
    prevention_tips: [
      'Use resistant varieties',
      'Destroy volunteer tomato/potato plants',
      'Ensure good airflow'
    ]
  },
  {
    id: 'd3',
    crop_type: 'Corn',
    common_name: 'Common Rust',
    scientific_name: 'Puccinia sorghi',
    description: 'Common rust appears as cinnamon-brown pustules on both upper and lower leaf surfaces.',
    symptoms: [
      'Elongated brown pustules on leaves',
      'Leaf yellowing and early senescence',
      'Stunted plant growth in severe cases'
    ],
    causes: 'Fungal pathogen Puccinia sorghi. Favored by high humidity and moderate temperatures.',
    prevention_tips: [
      'Plant resistant hybrids',
      'Early planting',
      'Proper fertilization'
    ]
  }
];

export const MOCK_TREATMENTS: Record<string, Treatment[]> = {
  'd1': [
    {
      id: 't1',
      disease_id: 'd1',
      treatment_name: 'Copper Fungicide Spray',
      treatment_type: 'Chemical',
      instructions: 'Apply to all leaf surfaces. Repeat every 7-10 days.',
      dosage: '2 tbsp per gallon',
      application_method: 'Foliar spray',
      frequency: 'Every 7 days',
      cost_estimate_min: 15,
      cost_estimate_max: 25,
      currency: 'USD',
      safety_precautions: 'Wear gloves and mask. Avoid skin contact.',
      expected_results: 'Prevention of spread and protection of new growth.'
    },
    {
      id: 't2',
      disease_id: 'd1',
      treatment_name: 'Neem Oil',
      treatment_type: 'Organic',
      instructions: 'Natural fungicide. Apply in early morning.',
      dosage: '1 oz per gallon',
      application_method: 'Foliar spray',
      frequency: 'Every 14 days',
      cost_estimate_min: 10,
      cost_estimate_max: 20,
      currency: 'USD',
      safety_precautions: 'Do not apply in direct midday sun.',
      expected_results: 'Gentle fungal suppression and insect deterrence.'
    }
  ],
  'd2': [
    {
       id: 't3',
       disease_id: 'd2',
       treatment_name: 'Mancozeb Fungicide',
       treatment_type: 'Chemical',
       instructions: 'Apply at first sign of late blight symptoms.',
       dosage: '1.5 lbs per acre equivalent',
       application_method: 'Pressure sprayer',
       frequency: 'Every 5 days during wet weather',
       cost_estimate_min: 30,
       cost_estimate_max: 50,
       currency: 'USD',
       safety_precautions: 'Full PPE required.',
       expected_results: 'Stopping active infection cycle.'
    }
  ]
};
