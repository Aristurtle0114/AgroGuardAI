import React from 'react';
import { User, DetectionResult, UserProfile } from '../types';
import { dataService } from '../services/dataService';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onSelectDetection: (d: DetectionResult) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onSelectDetection }) => {
  const [detections, setDetections] = React.useState<DetectionResult[]>([]);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    setDetections(dataService.getDetections(user.id));
    setProfile(dataService.getProfile(user.id));
  }, [user.id]);

  const recentDetections = detections.slice(0, 5);
  const totalDetections = detections.length;
  const severeCount = detections.filter(d => d.severity_level === 'Severe').length;
  
  const mostCommonCrop = detections.reduce((acc, curr) => {
    acc[curr.crop_type] = (acc[curr.crop_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCrop = Object.entries(mostCommonCrop).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Ticket: {user.ticket_code}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {profile?.farm_name ? `${profile.farm_name} • Monitoring active` : 'Active farm monitoring session'}
          </p>
        </div>
        <button 
          onClick={() => onNavigate('detect')}
          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 dark:shadow-none transition-all"
        >
          <i className="fa-solid fa-camera"></i>
          <span>New Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Scans</span>
            <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <i className="fa-solid fa-microscope"></i>
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalDetections}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Severe Alerts</span>
            <div className="w-8 h-8 bg-rose-50 dark:bg-rose-900/30 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{severeCount}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Top Crop</span>
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              <i className="fa-solid fa-seedling"></i>
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{topCrop}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Recovery</span>
            <div className="w-8 h-8 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">84%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent History</h2>
            <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentDetections.length > 0 ? (
              recentDetections.map((d) => (
                <div 
                  key={d.id} 
                  onClick={() => onSelectDetection(d)}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer flex items-center"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <img src={d.image_url} alt={d.disease_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{d.disease_name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        d.severity_level === 'Severe' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50' :
                        d.severity_level === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/50' :
                        'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/50'
                      }`}>
                        {d.severity_level}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-3">
                      <span>{d.crop_type}</span>
                      <span>&bull;</span>
                      <span>{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-slate-300 dark:text-slate-600 ml-4"></i>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center">
                 <i className="fa-solid fa-magnifying-glass text-slate-300 dark:text-slate-600 text-4xl mb-4"></i>
                 <p className="text-slate-500 dark:text-slate-400 font-medium">No detections yet. Start your first scan!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Expert Insight</h2>
            <div className="bg-emerald-900 dark:bg-emerald-950 text-emerald-50 p-6 rounded-2xl relative overflow-hidden shadow-lg border border-emerald-800">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <i className="fa-solid fa-lightbulb text-6xl"></i>
               </div>
               <h4 className="font-bold mb-3 text-emerald-300">Weather Alert</h4>
               <p className="text-sm leading-relaxed mb-6">
                 High humidity forecast for the next 48 hours. Protect your Tomato crops against Early Blight now.
               </p>
               <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors w-full">
                 View Treatment Protocol
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;