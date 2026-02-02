import React, { useState, useEffect } from 'react';
import { User, DetectionResult, Theme } from './types';
import { dataService } from './services/dataService';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import DiseaseResult from './components/DiseaseResult';

// The 'aistudio' property is already defined on the Window interface globally as 'AIStudio'.
// We remove our manual declaration to resolve the conflicting property definition error
// and use type assertion when accessing it to ensure compatibility with pre-configured methods.

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(dataService.getTheme());
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedDetection, setSelectedDetection] = useState<DetectionResult | null>(null);
  const [ticketInput, setTicketInput] = useState('');
  const [hasKey, setHasKey] = useState<boolean>(true);
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  // Check for API key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      // Use any to bypass potential remaining type conflicts while accessing the global aistudio
      const win = window as any;
      if (typeof win.aistudio !== 'undefined') {
        try {
          const selected = await win.aistudio.hasSelectedApiKey();
          // If not in process.env and not selected via window.aistudio, we need to prompt
          setHasKey(!!process.env.API_KEY || selected);
        } catch (e) {
          console.error("Error checking API key:", e);
          setHasKey(!!process.env.API_KEY);
        }
      } else {
        setHasKey(!!process.env.API_KEY);
      }
      setIsCheckingKey(false);
    };
    checkApiKey();
  }, []);

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
  };

  const handleTicketEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketInput.length >= 4) {
      const newUser = { id: `u_${ticketInput}`, ticket_code: ticketInput.toUpperCase() };
      dataService.setUser(newUser);
      setUser(newUser);
      setCurrentPage('dashboard');
      setTicketInput('');
    }
  };

  const handleConnectKey = async () => {
    const win = window as any;
    if (win.aistudio) {
      try {
        await win.aistudio.openSelectKey();
        // Assume success as per instructions to avoid race conditions
        setHasKey(true);
      } catch (e) {
        console.error("Error opening key selector:", e);
      }
    }
  };

  const renderContent = () => {
    // If no key is available, show the key connection screen first
    if (!hasKey && !isCheckingKey) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-6">
              <i className="fa-solid fa-key text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold dark:text-white mb-2">Connect Farm Database</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              A valid Gemini API key is required to access real-time agronomic intelligence. 
              Please connect your project to continue.
            </p>
            <button 
              onClick={handleConnectKey}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-plug"></i>
              <span>Connect API Key</span>
            </button>
            <p className="mt-4 text-[10px] text-slate-400">
              Note: Requires a paid Google Cloud project. <br/>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">View Billing Docs</a>
            </p>
          </div>
        </div>
      );
    }

    if (currentPage === 'ticket' && !user) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                <i className="fa-solid fa-ticket text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold dark:text-white">Redeem Access Ticket</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Enter your 4+ character farm access code</p>
            </div>
            <form onSubmit={handleTicketEntry} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-center text-2xl font-mono tracking-widest dark:text-white"
                  placeholder="AG-XXXX"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={ticketInput.length < 4}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 disabled:opacity-50 transition-all"
              >
                Enter Farm
              </button>
            </form>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="w-full mt-4 text-slate-400 dark:text-slate-500 text-sm font-semibold hover:text-slate-600 dark:hover:text-slate-300"
            >
              Cancel
            </button>
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
      {isCheckingKey ? (
        <div className="min-h-[80vh] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-500 font-medium">Authenticating System...</p>
        </div>
      ) : renderContent()}
    </Layout>
  );
};

export default App;