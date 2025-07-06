// Markets page - focused only on markets
import React from 'react';
import { MarketList } from '@/components/markets/MarketList';

const Markets: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Prediction Markets
          </h1>
          <p className="text-lg text-slate-400">
            Discover and trade on prediction markets for real-world events
          </p>
        </div>
        
        <MarketList showFilters={true} />
      </div>
    </div>
  );
};

export default Markets;