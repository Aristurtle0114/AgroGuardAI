
import React, { useState, useEffect } from 'react';
import { User, DetectionResult, Theme, UserProfile } from './types';
import { dataService } from './services/dataService';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import MarketPage from './pages/MarketPage';
import DiseaseResult from './components/DiseaseResult';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(dataService.getTheme());
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedDetection, setSelectedDetection] = useState<DetectionResult | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Registration States
  const [regFarmName, setRegFarmName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  useEffect(() => {
    const existingUser = dataService.getUser();
    if (existingUser) {
      setUser(existingUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    dataService.setTheme(nextTheme);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = () => {
    dataService.logout();
    setUser(null);
    setCurrentPage('landing');
    setGeneratedKey(null);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regFarmName.trim().length >= 2) {
      // Generate a unique Digital ID Key
      const uniqueId = `AG-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGeneratedKey(uniqueId);
      
      const newUser = { id: `u_${uniqueId}`, ticket_code: uniqueId };
      const newProfile: UserProfile = {
        id: newUser.id,
        farm_name: regFarmName,
        location: '',
        farm_size_hectares: 0,
        primary_crops: [],
      };
      
      dataService.setUser(newUser);
      dataService.updateProfile(newProfile);
      // We'll show the key for a moment before letting them in
    }
  };

  const finalizeRegistration = () => {
    const existingUser = dataService.getUser();
    if (existingUser) {
      setUser(existingUser);
      setCurrentPage('dashboard');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId.length >= 4) {
      const newUser = { id: `u_${loginId}`, ticket_code: loginId.toUpperCase() };
      dataService.setUser(newUser);
      setUser(newUser);
      setCurrentPage('dashboard');
      setLoginId('');
    }
  };

  const renderContent = () => {
    if (currentPage === 'ticket' && !user) {
      return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12 transition-colors">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden">
            
            {generatedKey ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
                  <i className="fa-solid fa-circle-check text-4xl"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Digital ID Created!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Save this unique key to access your farm dashboard from any device.</p>
                
                <div className="bg-slate-900 p-6 rounded-2xl mb-8 relative group">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-2 text-left">Your Access Key</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono font-bold text-white tracking-widest">{generatedKey}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedKey)}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy Key"
                    >
                      <i className="fa-solid fa-copy text-lg"></i>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={finalizeRegistration}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all"
                >
                  Enter My Farm Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mb-8">
                  <button 
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                  >
                    I have an ID
                  </button>
                  <button 
                    onClick={() => setAuthMode('register')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authMode === 'register' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                  >
                    New Farm
                  </button>
                </div>

                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                      <p className="text-slate-500 text-sm mt-1">Enter your Farm Access Key to log in.</p>
                    </div>
                    <div>
                      <input 
                        type="text" 
                        autoFocus
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-center text-xl font-mono tracking-widest dark:text-white"
                        placeholder="AG-XXXX-XXXX"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loginId.length < 4}
                      className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                      Secure Login
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Digital Registration</h2>
                      <p className="text-slate-500 text-sm mt-1">Join thousands of farmers using AI.</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Farm Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all"
                        placeholder="e.g. Green Hill Plantation"
                        value={regFarmName}
                        onChange={(e) => setRegFarmName(e.target.value)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={regFarmName.trim().length < 2}
                      className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 disabled:opacity-50 transition-all"
                    >
                      Create My Digital Farm ID
                    </button>
                    <p className="text-[10px] text-center text-slate-400 px-4">
                      By registering, you agree to our digital agricultural data standards for anonymous regional risk analysis.
                    </p>
                  </form>
                )}

                <button 
                  onClick={() => setCurrentPage('landing')}
                  className="w-full mt-8 text-slate-400 dark:text-slate-500 text-xs font-semibold hover:text-slate-600 dark:hover:text-slate-300"
                >
                  Return to Home
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    if (!user) return <LandingPage onGetStarted={() => setCurrentPage('ticket')} />;

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            onNavigate={setCurrentPage} 
            onSelectDetection={(d) => { setSelectedDetection(d); setCurrentPage('result'); }}
          />
        );
      case 'detect':
        return (
          <DetectionPage 
            user={user} 
            onDetectionComplete={(d) => { setSelectedDetection(d); setCurrentPage('result'); }}
          />
        );
      case 'result':
        return selectedDetection ? (
          <DiseaseResult 
            detection={selectedDetection} 
            onAnalyzeMore={() => setCurrentPage('detect')} 
          />
        ) : null;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'chat':
        return <ChatPage user={user} />;
      case 'market':
        return <MarketPage />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} onSelectDetection={() => {}} />;
    }
  };

  return (
    <Layout 
      user={user} 
      theme={theme}
      currentPage={currentPage} 
      onLogout={handleLogout} 
      onToggleTheme={toggleTheme}
      onNavigate={(page) => {
        setCurrentPage(page);
        setSelectedDetection(null);
      }}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
