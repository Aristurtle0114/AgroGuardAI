
import React, { useRef } from 'react';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const steps = [
    {
      icon: 'fa-id-card',
      title: '1. Create Digital ID',
      desc: 'Register your farm instantly online. No physical tickets required. Generate your unique Digital Access Key in seconds.',
      color: 'emerald'
    },
    {
      icon: 'fa-location-crosshairs',
      title: '2. Pinpoint Your Land',
      desc: 'Use our GPS mapping tool to define your farm boundaries for hyper-local climate and soil grounding.',
      color: 'blue'
    },
    {
      icon: 'fa-camera',
      title: '3. Scan Field Issues',
      desc: 'Take photos of crops. Our vision AI analyzes textures and patterns for instant diagnosis.',
      color: 'amber'
    },
    {
      icon: 'fa-microchip',
      title: '4. AI-Driven Results',
      desc: 'Receive treatment plans, market prices, and soil analysis grounded in live regional data.',
      color: 'indigo'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-16 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 dark:opacity-20 pointer-events-none">
           <i className="fa-solid fa-leaf text-[400px] text-emerald-600 dark:text-emerald-500 rotate-12"></i>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Digital Farming <br />
            <span className="text-emerald-600 dark:text-emerald-400">Made Simple</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing and start protecting. Create your **Digital Farm ID** instantly and access specialized AI diagnostics for your crops.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform hover:-translate-y-1"
            >
              Start Digital Registration
            </button>
            <button 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              How it Works
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
             {['Tomato', 'Potato', 'Corn', 'Rice'].map((crop) => (
               <div key={crop} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center space-x-2">
                 <i className="fa-solid fa-circle-check text-emerald-500 dark:text-emerald-400"></i>
                 <span className="font-semibold text-slate-700 dark:text-slate-300">{crop}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={howItWorksRef} className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">The Digital Onboarding</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">No paperwork, no waiting. Transition your traditional farm to digital in under 60 seconds.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-700 -translate-x-4 z-0"></div>
                )}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all relative z-10 text-center">
                  <div className={`w-16 h-16 bg-${step.color}-100 dark:bg-${step.color}-900/30 text-${step.color}-600 dark:text-${step.color}-400 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${step.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">A Professional Farm Suite</h2>
            <p className="text-slate-600 dark:text-slate-400">Secure, ID-based access for modern, paperless agriculture.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-6">
                <i className="fa-solid fa-fingerprint text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Digital Identity</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your farm's data is tied to your unique ID, allowing you to access history from any device.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-6">
                <i className="fa-solid fa-bolt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Instant Diagnostics</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No waiting for specialists. Our AI model provides expert analysis immediately on your dashboard.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mb-6">
                <i className="fa-solid fa-chart-line text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Live Markets</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Integrated pricing from famous Philippine markets keeps you profitable and informed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
