
import React from 'react';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-16 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 dark:opacity-20">
           <i className="fa-solid fa-leaf text-[400px] text-emerald-600 dark:text-emerald-500 rotate-12"></i>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Identify Crop Diseases <br />
            <span className="text-emerald-600 dark:text-emerald-400">Instantly with AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing and start protecting. Access specialized vision AI with your farm ticket and get precise identification in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform hover:-translate-y-1"
            >
              Redeem Farm Ticket
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
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

      {/* Features Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Farmers Choose AgroGuard</h2>
            <p className="text-slate-600 dark:text-slate-400">Secure, ticket-based access for modern agriculture.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-6">
                <i className="fa-solid fa-ticket text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ticket Access</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Simple access codes instead of passwords. Perfect for field operations and seasonal workers.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-6">
                <i className="fa-solid fa-moon text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Eye Comfort</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Optimized dark mode for early morning or late night field work, reducing glare and battery drain.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mb-6">
                <i className="fa-solid fa-kit-medical text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Actionable Advice</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Receive step-by-step treatment plans, including organic and biological alternatives.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
