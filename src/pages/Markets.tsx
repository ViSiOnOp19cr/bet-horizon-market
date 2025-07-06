// Markets page - main markets browsing interface
import React from 'react';
import { MarketList } from '@/components/markets/MarketList';

const Markets: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Prediction Markets
          </h1>
          <p className="text-muted-foreground">
            Trade on the outcomes of real-world events
          </p>
        </div>
        <MarketList showFilters={true} />
      </div>
    </div>
  );
};

export default Markets;