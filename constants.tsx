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
      '