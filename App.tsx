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

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(dataService.getTheme());
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedDetection, setSelectedDetection] = useState<DetectionResult | null>(null);
  const [ticketInput, setTicketInput] = useState('');

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

  const renderContent = () => {
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
      {renderContent()}
    </Layout>
  );
};

export default App;
