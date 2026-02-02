import React from 'react';
import { DetectionResult, SeverityLevel } from '../types';
import { SUPPORTED_DISEASES } from '../constants';

interface DiseaseResultProps {
  detection: DetectionResult;
  onAnalyzeMore: () => void;
}

const SeverityBadge: React.FC<{ level: SeverityLevel }> = ({ level }) => {
  const colors = {
    Mild: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    Severe: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[level]}`}>
      {level}
    </span>
  );
};

const DiseaseResult: React.FC<DiseaseResultProps> = ({ detection, onAnalyzeMore }) => {
  const diseaseInfo = SUPPORTED_DISEASES.find(
    d => d.common_name === detection.disease_name && d.crop_type === detection.crop_type
  );
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-6 md:p-8 bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wider uppercase mb-1">
                Detection: {detection.crop_type}
              </p>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{detection.disease_name}</h1>
              {detection.scientific_name && (
                <p className="text-slate-500 dark:text-slate-400 italic mt-1 font-medium">{detection.scientific_name}</p>
              )}
            </div>
            <div className="flex items-center">
              <SeverityBadge level={detection.severity_level} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <i className="fa-solid fa-image text-emerald-600 dark:text-emerald-400 mr-2"></i> Field Evidence
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-inner">
              <img src={detection.image_url} alt="Uploaded crop" className="w-full h-full object-cover" />
            </div>
            
            {detection.grounding_links && detection.grounding_links.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                  <i className="fa-brands fa-google text-emerald-600 dark:text-emerald-400 mr-2 text-xs"></i>
                  Live Grounding Sources
                </h4>
                <div className="space-y-2">
                  {detection.grounding_links.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                      <span className="truncate mr-2">{link.title}</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <i className="fa-solid fa-list-check text-emerald-600 dark:text-emerald-400 mr-2"></i> Key Symptoms
              </h3>
              <ul className="space-y-3">
                {(diseaseInfo?.symptoms || ['Discoloration', 'Spots', 'Wilting', 'Visible growth']).map((s, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                    <i className="fa-solid fa-circle-check text-emerald-500 dark:text-emerald-400 mt-1 mr-3"></i>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {detection.possible_solutions && detection.possible_solutions.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <i className="fa-solid fa-kit-medical text-rose-500 dark:text-rose-400 mr-2"></i> Possible Solutions
                </h3>
                <div className="space-y-4">
                  {detection.possible_solutions.map((solution, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold mr-3 shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-900 dark:bg-slate-950 flex justify-between items-center">
          <p className="text-slate-400 text-[10px] italic max-w-xs">
            Recommendations are AI-generated based on image analysis. Consult with local agricultural extensions before large-scale chemical application.
          </p>
          <button onClick={onAnalyzeMore} className="text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg font-semibold transition-colors">
            New Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiseaseResult;