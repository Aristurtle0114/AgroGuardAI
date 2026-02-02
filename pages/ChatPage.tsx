import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { chatWithExpert } from '../services/geminiService';

const ChatPage: React.FC<{ user: User }> = ({ user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', parts: [{ text: "Hello! I'm your AgroGuard AI assistant. How can I help your farm today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    const userMsgObj: ChatMessage = { role: 'user', parts: [{ text: userMessage }] };
    const historyBeforeResponse = [...messages, userMsgObj];
    
    setMessages(historyBeforeResponse);
    setIsLoading(true);

    try {
      const response = await chatWithExpert(messages, userMessage);
      
      const aiMsgObj: ChatMessage = { 
        role: 'model', 
        parts: [{ text: response.text }],
        links: response.links
      };
      
      setMessages(prev => [...prev, aiMsgObj]);
    } catch (error: any) {
      console.error("Chat Execution Error:", error);
      
      let errorDisplay = "Expert connection error. Please check your internet and try again.";
      if (error?.message?.includes("API_KEY")) {
        errorDisplay = "System Configuration Error: API Key is invalid or missing.";
      } else if (error?.message) {
        errorDisplay = `AI Error: ${error.message}`;
      }
        
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: errorDisplay }] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Agronomist AI</h2>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Expert Mode • Ticket Active</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none shadow-md' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.parts[0].text}</p>
              
              {m.links && m.links.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Sources & References:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.links.map((link, lIdx) => (
                      <a 
                        key={lIdx} 
                        href={link.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-2 py-1 bg-white/50 dark:bg-slate-900/50 rounded-md text-[10px] font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-100 dark:border-emerald-900/50"
                      >
                        <i className="fa-solid fa-link text-[8px]"></i>
                        <span className="max-w-[150px] truncate">{link.title || 'View Resource'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex space-x-2">
              <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <form onSubmit={handleSend} className="flex space-x-3">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about treatment, weather, or crop health..."
            className="flex-grow px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm dark:text-white transition-all"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="bg-emerald-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;