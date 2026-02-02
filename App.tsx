
import React, { useState, useEffect } from 'react';
import { User, DetectionResult, Theme } from './types';
import { dataService } from './services/dataService';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import MarketPage from './pages/MarketPage';
import SubscriptionPage from './pages/SubscriptionPage';
import DiseaseResult from './components/DiseaseResult';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>(dataService.getTheme());
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedDetection, setSelectedDetection] = useState<DetectionResult | null>(null);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);

  // Auth/Registration States (from main branch)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [regFarmName, setRegFarmName] = useState('');
  const [loginId, setLoginId] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
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



  const renderContent = () => {
    if (currentPage === 'subscription' && !user) {
      return (
        <SubscriptionPage
          onComplete={(newUser) => {
            setUser(newUser);
            setCurrentPage('dashboard');
          }}
          onCancel={() => setCurrentPage('landing')}
        />
      );
    }

    if (!user) return <LandingPage onGetStarted={() => setCurrentPage('subscription')} />;

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
            onChatStart={(context) => {
              setChatContext(context);
              setCurrentPage('chat');
            }}
          />
        ) : null;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'chat':
        return <ChatPage user={user} initialContext={chatContext} />;
      case 'market':
        return <MarketPage />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} onSelectDetection={() => { }} />;
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
