
import React from 'react';
import { User, UserProfile, CropType } from '../types.ts';
import { dataService } from '../services/dataService.ts';

const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  const [profile, setProfile] = React.useState<UserProfile>({
    id: user.id,
    farm_name: '',
    location: '',
    farm_size_hectares: 0,
    primary_crops: [],
  });
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const existing = dataService.getProfile(user.id);
    if (existing) setProfile(existing);
  }, [user.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleCrop = (crop: CropType) => {
    setProfile(prev => ({
      ...prev,
      primary_crops: prev.primary_crops.includes(crop)
        ? prev.primary_crops.filter(c => c !== crop)
        : [...prev.primary_crops, crop]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center space-x-4 mb-10">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-3xl">
          <i className="fa-solid fa-user"></i>
        </div>
        <div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Farm Settings</h1>
           <p className="text-slate-500 dark:text-slate-400">ID: {user.ticket_code}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Farm Name</label>
                   <input 
                      type="text" 
                      value={profile.farm_name}
                      onChange={(e) => setProfile(p => ({ ...p, farm_name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all"
                      placeholder="e.g. Green Valley Farm"
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                   <input 
                      type="text" 
                      value={profile.location}
                      onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all"
                      placeholder="e.g. Northern Highlands"
                   />
                </div>
             </div>
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Farm Size (Hectares)</label>
                   <input 
                      type="number" 
                      value={profile.farm_size_hectares}
                      onChange={(e) => setProfile(p => ({ ...p, farm_size_hectares: Number(e.target.value) }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all"
                   />
                </div>
             </div>
          </div>

          <div className="mb-10">
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Primary Crops</label>
             <div className="flex flex-wrap gap-3">
                {(['Tomato', 'Potato', 'Corn', 'Rice'] as CropType[]).map(crop => (
                  <button
                    key={crop}
                    type="button"
                    onClick={() => toggleCrop(crop)}
                    className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${
                      profile.primary_crops.includes(crop)
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {crop}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-8">
             <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all">
               {saved ? 'Saved!' : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
