
import React from 'react';

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-full mb-8">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">AI-Powered Crop Disease Detection</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Protect Your Crops with
              <span className="block mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Instant AI Diagnosis
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
              Stop guessing. Start protecting. Get precise disease identification in seconds with our advanced AI vision technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button
                onClick={onGetStarted}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started Free
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl font-semibold text-lg transition-all">
                Watch Demo
              </button>
            </div>

            {/* Supported Crops */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Supports Major Crops</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Tomato', 'Potato', 'Corn', 'Rice'].map((crop) => (
                  <div key={crop} className="bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors flex items-center justify-center gap-2 group">
                    <i className="fa-solid fa-check-circle text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform"></i>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{crop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Farmers Trust AgroGuard
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Advanced technology designed specifically for modern agriculture
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Feature 1 */}
            <div className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:shadow-xl hover:shadow-emerald-100 dark:hover:shadow-none">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200 dark:shadow-none">
                <i className="fa-solid fa-bolt text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Instant Analysis</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get accurate disease identification in seconds. No waiting, no guesswork—just instant, actionable insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-none">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200 dark:shadow-none">
                <i className="fa-solid fa-brain text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI-Powered Intelligence</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Powered by Google's Gemini AI, trained on thousands of crop disease images for maximum accuracy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all hover:shadow-xl hover:shadow-amber-100 dark:hover:shadow-none">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-amber-200 dark:shadow-none">
                <i className="fa-solid fa-clipboard-check text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Actionable Solutions</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive step-by-step treatment plans with organic and chemical options tailored to your situation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-8">Trusted by Farmers Worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <i className="fa-solid fa-star text-amber-500 text-xl"></i>
                  <i className="fa-solid fa-star text-amber-500 text-xl"></i>
                  <i className="fa-solid fa-star text-amber-500 text-xl"></i>
                  <i className="fa-solid fa-star text-amber-500 text-xl"></i>
                  <i className="fa-solid fa-star text-amber-500 text-xl"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
