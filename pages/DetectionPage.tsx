import React from 'react';
import { analyzeCropImage } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { User, DetectionResult } from '../types';

interface DetectionPageProps {
  user: User;
  onDetectionComplete: (d: DetectionResult) => void;
}

const DetectionPage: React.FC<DetectionPageProps> = ({ user, onDetectionComplete }) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const runAnalysis = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = preview.split(',')[1];
      const result = await analyzeCropImage(base64Data);
      
      const newDetection = dataService.addDetection({
        user_id: user.id,
        crop_type: result.crop_type,
        disease_name: result.disease_name,
        scientific_name: result.scientific_name,
        confidence_score: result.confidence_score,
        severity_level: result.severity_level,
        image_url: preview,
        possible_solutions: result.possible_solutions,
        grounding_links: result.grounding_links,
      });

      onDetectionComplete(newDetection);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Analyze Your Crop</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Redeem your expertise. Take a clear photo of the leaf area. 
          The AI will cross-reference live databases with your Ticket ID: {user.ticket_code}.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {!preview ? (
          <div 
            onClick={triggerFileInput}
            className="p-12 md:p-20 text-center flex flex-col items-center justify-center cursor-pointer group transition-all"
          >
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Click to upload or use camera</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Supports JPG, PNG and WEBP (Max 10MB)</p>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileChange} 
            />
          </div>
        ) : (
          <div className="relative">
            <div className="aspect-video w-full bg-slate-900 overflow-hidden flex items-center justify-center">
              <img src={preview} alt="Crop preview" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="p-8">
              {isAnalyzing ? (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">AI is analyzing...</p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={runAnalysis} className="flex-grow bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all">
                    Diagnose Disease
                  </button>
                  <button onClick={() => setPreview(null)} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 transition-all">
                    Retake Photo
                  </button>
                </div>
              )}
              {error && (
                <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionPage;