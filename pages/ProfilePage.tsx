
import React, { useState, useEffect, useRef } from 'react';
import { User, UserProfile, CropType } from '../types';
import { dataService } from '../services/dataService';

const ProfilePage: React.FC<{ user: User }> = ({ user }) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: user.id,
    farm_name: '',
    location: '',
    latitude: undefined,
    longitude: undefined,
    farm_size_hectares: 0,
    primary_crops: [],
  });
  const [saved, setSaved] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Using any to avoid TS errors when the 'google' namespace is not explicitly defined in the environment.
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const existing = dataService.getProfile(user.id);
    if (existing) setProfile(existing);

    // Dynamically load Google Maps script using the API key from environment variables.
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, [user.id]);

  useEffect(() => {
    if (mapLoaded && mapRef.current && !googleMapRef.current) {
      // Cast window to any to access the dynamically loaded google object.
      const google = (window as any).google;
      const defaultPos = {
        lat: profile.latitude || 37.7749,
        lng: profile.longitude || -122.4194
      };

      const map = new google.maps.Map(mapRef.current, {
        center: defaultPos,
        zoom: profile.latitude ? 15 : 2,
        mapTypeId: 'satellite',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
        ]
      });

      googleMapRef.current = map;

      const marker = new google.maps.Marker({
        position: profile.latitude ? defaultPos : null,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 8,
          fillColor: "#059669",
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        }
      });

      markerRef.current = marker;

      // Type the event as any to bypass missing MapMouseEvent definition.
      map.addListener('click', (e: any) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          setProfile(p => ({ ...p, latitude: lat, longitude: lng }));
        }
      });

      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (pos) {
          setProfile(p => ({ ...p, latitude: pos.lat(), longitude: pos.lng() }));
        }
      });
    }
  }, [mapLoaded]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const pos = { lat, lng };

        googleMapRef.current?.setCenter(pos);
        googleMapRef.current?.setZoom(16);
        markerRef.current?.setPosition(pos);

        setProfile(p => ({ ...p, latitude: lat, longitude: lng }));
      }, (error) => {
        console.error("Geolocation Error:", error);
        alert("Could not retrieve your location. Please select it on the map.");
      });
    }
  };

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl">
            <i className="fa-solid fa-farm"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Farm Pinpoint</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">Define your exact boundaries for hyper-local AI diagnostics.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Ticket</p>
          <p className="font-mono text-emerald-600 font-bold">{user.plan} Membership</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-2 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div
              ref={mapRef}
              className="w-full h-[500px] rounded-[1.4rem] bg-slate-100 dark:bg-slate-900"
            >
              {!mapLoaded && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <i className="fa-solid fa-spinner animate-spin text-2xl"></i>
                  <p className="text-xs font-medium tracking-widest uppercase">Initializing Maps...</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="absolute top-6 right-6 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-emerald-600 hover:text-emerald-700 transition-colors z-10"
              title="Use Current GPS"
            >
              <i className="fa-solid fa-crosshairs text-lg"></i>
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20 text-[10px] font-bold text-slate-600 dark:text-slate-300 z-10 pointer-events-none uppercase tracking-widest">
              <i className="fa-solid fa-hand-pointer mr-2 text-emerald-500"></i> Click to pinpoint farm
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600">
                <i className="fa-solid fa-location-crosshairs"></i>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">Coordinates</p>
                <p className="text-xs font-mono text-emerald-700 dark:text-emerald-400">
                  {profile.latitude ? `${profile.latitude.toFixed(6)}, ${profile.longitude?.toFixed(6)}` : 'No coordinates selected'}
                </p>
              </div>
            </div>
            {profile.latitude && (
              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-800 px-2 py-1 rounded">
                GROUNDED
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Farm Name</label>
                <input
                  type="text"
                  value={profile.farm_name}
                  onChange={(e) => setProfile(p => ({ ...p, farm_name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all text-sm"
                  placeholder="e.g. Riverside Plot B"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Region/City</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white transition-all text-sm"
                  placeholder="e.g. Northern Valley"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Crops</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {(['Tomato', 'Potato', 'Corn', 'Rice'] as CropType[]).map(crop => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => toggleCrop(crop)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${profile.primary_crops.includes(crop)
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-emerald-600 text-white hover:opacity-90'
                    }`}
                >
                  {saved ? (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>Config Saved</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i>
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <i className="fa-solid fa-circle-info text-emerald-400"></i>
              <h3 className="text-sm font-bold">Why pinpoint?</h3>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Precision coordinates allow AgroGuard to monitor soil humidity, satellite precipitation data, and regional pathogen movements within a <span className="text-emerald-400 font-bold">500m radius</span> of your actual crops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
