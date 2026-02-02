
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {showLocationPrompt && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded-2xl shadow-2xl p-6 animate-slide-down">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 shrink-0">
                <i className="fa-solid fa-location-crosshairs text-xl"></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Location Required</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Set your farm location in Profile to access Soil Health analysis.
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Set Location
                  </button>
                  <button
                    onClick={() => setShowLocationPrompt(false)}
                    className="text-slate-500 dark:text-slate-400 text-sm font-semibold px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
              {user.plan} Plan
            </span>
            {profile?.latitude && (
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-[10px]"></i>
                GPS Active
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            {profile?.farm_name || 'My Farm'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <i className="fa-solid fa-map-pin text-sm"></i>
            {profile?.location || 'Location not set'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: 'fa-camera', label: 'Field Scan', color: 'emerald', action: () => onNavigate('detect') },
            { icon: 'fa-robot', label: 'AgroAI Chat', color: 'blue', action: () => onNavigate('chat') },
            { icon: 'fa-flask', label: 'Soil Health', color: 'amber', action: handleSoilHealthClick },
            { icon: 'fa-chart-line', label: 'Market Prices', color: 'violet', action: () => onNavigate('market') },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-100 dark:hover:shadow-none"
            >
              <div className={`w-14 h-14 rounded-xl bg-${item.color}-50 dark:bg-${item.color}-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`fa-solid ${item.icon} text-2xl text-${item.color}-600 dark:text-${item.color}-400`}></i>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Total Scans</p>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">{totalDetections}</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Severe Cases</p>
                <h3 className="text-4xl font-bold text-rose-600 dark:text-rose-500">{severeCount}</h3>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wide mb-2">Top Crop</p>
                <h3 className="text-4xl font-bold">{topCrop}</h3>
              </div>
            </div>

            {/* Weather */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Weather Forecast
                </h3>
                {weatherAlert && (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i> {weatherAlert}
                  </span>
                )}
              </div>

              {isWeatherLoading ? (
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-slate-100 dark:bg-slate-800 h-32 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : weather.length > 0 ? (
                <div className="grid grid-cols-5 gap-3">
                  {weather.map((w, i) => (
                    <div key={i} className={`flex flex-col items-center p-4 rounded-xl transition-all ${w.risk_level === 'High' ? 'bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800' : 'bg-slate-50 dark:bg-slate-800'}`}>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{w.day}</span>
                      <i className={`fa-solid ${getWeatherIcon(w.condition)} text-2xl mb-2`}></i>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{w.temp}</span>
                      <div className="mt-3 w-full">
                        <div className={`h-1 w-full rounded-full ${w.risk_level === 'High' ? 'bg-rose-500' : w.risk_level === 'Med' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <i className="fa-solid fa-location-crosshairs text-slate-300 dark:text-slate-600 text-4xl mb-3"></i>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Set your location in <button onClick={() => onNavigate('profile')} className="text-emerald-600 dark:text-emerald-400 font-semibold underline">Profile</button> to see weather</p>
                </div>
              )}
            </div>

            {/* Recent Scans */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Scans</h3>
                <button className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:underline">View All</button>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {recentDetections.length > 0 ? (
                  <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {recentDetections.map((d) => (
                      <div key={d.id} onClick={() => onSelectDetection(d)} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                          <img src={d.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{d.disease_name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{d.crop_type} • {new Date(d.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${d.severity_level === 'Severe' ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`}>
                          {d.severity_level}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <i className="fa-solid fa-camera text-4xl mb-3 opacity-50"></i>
                    <p className="text-sm">No scans yet. Start your first field scan!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Alerts */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <i className="fa-solid fa-bell text-emerald-400"></i> Regional Alerts
              </h3>
              <div className="space-y-4">
                {[
                  { time: '2h ago', text: 'Late Blight detected in 3 farms nearby', urgent: true },
                  { time: '1d ago', text: 'Irrigation advisory for potato crops', urgent: false },
                  { time: '2d ago', text: 'Whitefly infestation reported', urgent: true },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.urgent ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                    <div>
                      <p className="text-sm text-slate-300 leading-relaxed">{alert.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-1">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <i className="fa-solid fa-lightbulb"></i>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Expert Tip</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Crop rotation with legumes after tomato planting reduces soil toxicity and pathogen build-up.
                </p>
              </div>
            </div>

            {/* Community */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Community</h3>
              <div className="flex -space-x-2 mb-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">+12</div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Farmers nearby are discussing <span className="font-semibold text-slate-900 dark:text-white">fertilizer subsidies</span> and harvest techniques.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
