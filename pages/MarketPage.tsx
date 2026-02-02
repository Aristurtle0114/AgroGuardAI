
import React, { useState, useEffect } from 'react';
import { getMarketPrices, MarketPrice } from '../services/geminiService';

const MarketPage: React.FC = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [links, setLinks] = useState<{ title: string; uri: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getMarketPrices();
        setPrices(data.prices);
        setLinks(data.links);
      } catch (error) {
        console.error("Failed to fetch market prices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const getCropIcon = (crop: string) => {
    const name = crop.toLowerCase();
    if (name.includes('rice') || name.includes('palay')) return 'fa-wheat-awn';
    if (name.includes('corn')) return 'fa-seedling';
    if (name.includes('coconut')) return 'fa-circle-dot';
    if (name.includes('banana')) return 'fa-lemon';
    if (name.includes('pineapple')) return 'fa-leaf';
    if (name.includes('mango')) return 'fa-apple-whole';
    if (name.includes('sugar')) return 'fa-barcode';
    return 'fa-box';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Philippine Crop Market</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Latest possible market prices (PHP) for famous regional crops.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {prices.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className={`fa-solid ${getCropIcon(item.crop)} text-xl`}></i>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter flex items-center ${
                    item.trend === 'up' ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 
                    item.trend === 'down' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 
                    'bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    <i className={`fa-solid fa-arrow-${item.trend === 'up' ? 'up' : item.trend === 'down' ? 'down' : 'right'} mr-1`}></i>
                    {item.trend}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{item.crop}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₱{item.price}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">/{item.unit}</span>
                  </div>
                </div>
                {item.source_summary && (
                   <p className="mt-3 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic border-t border-slate-50 dark:border-slate-700 pt-3">
                     {item.source_summary}
                   </p>
                )}
              </div>
            ))}
          </div>

          {links.length > 0 && (
            <div className="mt-12 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                 <i className="fa-solid fa-link mr-2"></i> Reference Sources
               </h3>
               <div className="flex flex-wrap gap-3">
                 {links.map((link, idx) => (
                   <a key={idx} href={link.uri} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-700 hover:bg-emerald-50 transition-colors">
                     {link.title}
                   </a>
                 ))}
               </div>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-[10px] text-slate-400 italic">
          * Prices are estimated based on recent market trends and may vary by region.
        </p>
      </div>
    </div>
  );
};

export default MarketPage;
