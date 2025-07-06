// Dashboard homepage
import React from 'react';
import { MarketList } from '@/components/markets/MarketList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Trophy } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            PredictionMarket
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Trade on the outcomes of real-world events. Make predictions, place bets, and win big.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <Link to="/markets">
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse Markets
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-600">
              <Link to="/leaderboard">
                <Trophy className="mr-2 h-4 w-4" />
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Active Markets Section */}
        <MarketList title="Active Markets" showFilters={false} />
      </div>
    </div>
  );
};

export default Index;
