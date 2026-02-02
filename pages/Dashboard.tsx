
import React, { useState, useEffect } from 'react';
import { User, DetectionResult, UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { getWeatherForecast, WeatherDay } from '../services/geminiService';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onSelectDetection: (d: DetectionResult) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onSelectDetection }) => {
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [weatherAlert, setWeatherAlert] = useState<string | null>(null);
  const [weatherLinks, setWeatherLinks] = useState<{ title: string; uri: string }[]>([]);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  useEffect(() => {
    const d = dataService.getDetections(user.id);
    const p = dataService.getProfile(user.id);
    setDetections(d);
    setProfile(p);

    if (p?.location || (p?.latitude && p?.longitude)) {
      fetchWeather(p.location || 'Current Location', p.latitude, p.longitude);
    }
  }, [user.id]);

  const fetchWeather = async (location: string, lat?: number, lng?: number) => {
    setIsWeatherLoading(true);
    try {
      const data = await getWeatherForecast(location, lat, lng);
      setWeather(data.forecast || []);
      setWeatherAlert(data.alert || null);
      setWeatherLinks(data.links || []);
    } catch (err) {
      console.error("Weather Fetch Error:", err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleSoilHealthClick = () => {
    if (profile?.latitude && profile?.longitude) {
      onNavigate('chat');
    } else {
      setShowLocationPrompt(true);
      setTimeout(() => setShowLocationPrompt(false), 5000);
    }
  };

  const recentDetections = detections.slice(0, 4);
  const totalDetections = detections.length;
  const severeCount = detections.filter(d => d.severity_level === 'Severe').length;

  const cropCounts = detections.reduce((acc, curr) => {
    acc[curr.crop_type] = (acc[curr.crop_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCrops = Object.entries(cropCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
  const topCrop = sortedCrops.length > 0 ? sortedCrops[0][0] : 'None';

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) return 'fa-sun text-amber-500';
    if (c.includes('rain') || c.includes('shower')) return 'fa-cloud-rain text-blue-500';
    if (c.includes('cloud')) return 'fa-cloud text-slate-400';
    if (c.includes('storm')) return 'fa-cloud-bolt text-indigo-600';
    return 'fa-cloud-sun text-amber-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">

      {showLocationPrompt && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-lg bg-white dark:bg-slate-800 border-2 border-amber-500 rounded-2xl shadow-2xl p-6 animate-bounce-short">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 shrink-0">
              <i className="fa-solid fa-location-crosshairs text-xl"></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Pinpoint Location Required</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                To analyze the <strong>Soil Health</strong> of your land, please use the map to pinpoint your farm location in your profile settings.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => onNavigate('profile')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all"
                >
                  Go to Map
                </button>
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  className="text-slate-500 dark:text-slate-400 text-xs font-bold px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
              Verified Farmer
            </span>
            {profile?.latitude && (
              <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-blue-200 dark:border-blue-800 flex items-center">
                <i className="fa-solid fa-crosshairs mr-1"></i> GPS Active
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {profile?.farm_name || 'My Farm Overview'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center">
            <i className="fa-solid fa-location-dot mr-2"></i>
            {profile?.location || 'Location not set'} • {user.plan} Plan
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
            <p className="text-sm font-bold text-emerald-500 flex items-center justify-end">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span>
              AI Active
            </p>
          </div>
          <button
            onClick={() => onNavigate('detect')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center space-x-2"
          >
            <i className="fa-solid fa-plus-circle"></i>
            <span>New Scan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: 'fa-camera', label: 'Field Scan', color: 'emerald', action: () => onNavigate('detect') },
          { icon: 'fa-robot', label: 'AgroAI', color: 'blue', action: () => onNavigate('chat') },
          { icon: 'fa-vial', label: 'Soil Health', color: 'amber', action: handleSoilHealthClick },
          { icon: 'fa-chart-line', label: 'Market', color: 'indigo', action: () => onNavigate('market') },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${item.icon} text-xl`}></i>
            </div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Lifetime Scans</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{totalDetections}</h3>
              <p className="text-[10px] text-emerald-500 font-bold mt-2">
                <i className="fa-solid fa-arrow-up mr-1"></i> Active season
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm relative">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Severe Alerts</p>
              <h3 className="text-3xl font-black text-rose-600 dark:text-rose-500">{severeCount}</h3>
              <p className="text-[10px] text-slate-400 mt-2">Action required</p>
            </div>
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg shadow-emerald-100 dark:shadow-none text-white relative">
              <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">Top Focus</p>
              <h3 className="text-3xl font-black">{topCrop}</h3>
              <p className="text-[10px] text-emerald-100 mt-2">Most scanned variety</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Field Outlook: {profile?.location || 'Set Location'}
              </h3>
              {weatherAlert && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-full animate-pulse border border-rose-100 dark:border-rose-800">
                  <i className="fa-solid fa-triangle-exclamation mr-1"></i> {weatherAlert}
                </span>
              )}
            </div>

            {isWeatherLoading ? (
              <div className="grid grid-cols-5 gap-2 animate-pulse">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-700 h-24 rounded-2xl"></div>
                ))}
              </div>
            ) : weather.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {weather.map((w, i) => (
                  <div key={i} title={w.risk_reason} className={`flex flex-col items-center p-3 rounded-2xl transition-all hover:scale-105 cursor-help ${w.risk_level === 'High' ? 'bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                    <span className="text-[10px] font-bold text-slate-400 mb-2">{w.day}</span>
                    <i className={`fa-solid ${getWeatherIcon(w.condition)} text-xl mb-2`}></i>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{w.temp}</span>
                    <div className="mt-3 w-full flex flex-col items-center">
                      <div className={`h-1 w-full rounded-full ${w.risk_level === 'High' ? 'bg-rose-500' : w.risk_level === 'Med' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                      <span className="text-[8px] font-bold mt-1 text-slate-400 uppercase">Risk: {w.risk_level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <i className="fa-solid fa-location-crosshairs text-slate-300 text-3xl mb-3"></i>
                <p className="text-sm text-slate-500">Pinpoint your farm in <button onClick={() => onNavigate('profile')} className="text-emerald-600 font-bold underline">Profile Settings</button> to see hyper-local weather.</p>
              </div>
            )}

            {!isWeatherLoading && weatherLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Forecast Sources</p>
                <div className="flex flex-wrap gap-2">
                  {weatherLinks.map((link, idx) => (
                    <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors border border-slate-100 dark:border-slate-800">
                      <i className="fa-solid fa-link text-[8px]"></i>
                      <span className="max-w-[120px] truncate">{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Historical Logs</h3>
              <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              {recentDetections.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {recentDetections.map((d) => (
                    <div key={d.id} onClick={() => onSelectDetection(d)} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors group">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 mr-4 border border-slate-200 dark:border-slate-700 shrink-0">
                        <img src={d.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">{d.disease_name}</p>
                        <p className="text-[10px] text-slate-500">{d.crop_type} • {new Date(d.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right ml-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${d.severity_level === 'Severe' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                          }`}>
                          {d.severity_level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 text-sm">No detection history found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center relative">
              <i className="fa-solid fa-satellite-dish text-emerald-400 mr-3"></i> Nearby Alerts
            </h3>
            <div className="space-y-6 relative">
              {[
                { time: '2h ago', text: 'Late Blight detected in 3 farms 5km East of your location.', urgent: true },
                { time: '1d ago', text: 'Regional irrigation council suggests increasing water for Potatoes.', urgent: false },
                { time: '2d ago', text: 'Whitefly infestation reported in neighboring district.', urgent: true },
              ].map((alert, i) => (
                <div key={i} className="flex space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${alert.urgent ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-500'}`}></div>
                  <div>
                    <p className="text-xs leading-relaxed text-slate-300">{alert.text}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-bold">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-[10px] text-slate-500 italic">Based on anonymous regional data</p>
            </div>
          </div>

          <div className="p-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[1.4rem]">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Agronomist Tip</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "Crop rotation with legumes after Tomato planting significantly reduces soil toxicity and pathogen build-up by breaking the host cycle."
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Community Insights</h3>
            <div className="flex -space-x-2 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">+12</div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">Farmers in your area are currently discussing <span className="font-bold text-slate-700 dark:text-slate-300">fertilizer subsidies</span> and early harvest techniques.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
