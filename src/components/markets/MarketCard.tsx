// Individual market card component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Market } from '@/types/api';
import { Clock, TrendingUp, TrendingDown, Lock, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketCardProps {
  market: Market;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Ended';
    if (diffDays === 0) return 'Ends today';
    if (diffDays === 1) return 'Ends tomorrow';
    return `${diffDays} days left`;
  };

  const isExpired = new Date(market.end_time) < new Date();
  
  const getStatusInfo = () => {
    if (market.outcome) {
      return {
        badge: <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Resolved: {market.outcome}</Badge>,
        bgGradient: "from-emerald-500/5 to-emerald-600/5"
      };
    }
    if (market.isLocked || isExpired) {
      return {
        badge: <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Lock className="h-3 w-3 mr-1" />Locked</Badge>,
        bgGradient: "from-amber-500/5 to-amber-600/5"
      };
    }
    if (market.isOpen) {
      return {
        badge: <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Live</Badge>,
        bgGradient: "from-blue-500/5 to-purple-600/5"
      };
    }
    return {
      badge: <Badge variant="secondary">Closed</Badge>,
      bgGradient: "from-slate-500/5 to-slate-600/5"
    };
  };

  const statusInfo = getStatusInfo();
  const yesOdds = market.Oddsyes || 2.0;
  const noOdds = market.Oddsno || 2.0;
  
  // Calculate implied probabilities for visual representation
  const yesProb = (1 / yesOdds) * 100;
  const noProb = (1 / noOdds) * 100;
  const totalProb = yesProb + noProb;
  const normalizedYesProb = (yesProb / totalProb) * 100;
  const normalizedNoProb = (noProb / totalProb) * 100;

  return (
    <Card className={`group overflow-hidden border-0 bg-gradient-to-br ${statusInfo.bgGradient} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10`}>
      {/* Status bar */}
      <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-xs ${
              market.catagory === 'Sports' 
                ? 'border-blue-400/50 text-blue-400 bg-blue-500/10' 
                : 'border-purple-400/50 text-purple-400 bg-purple-500/10'
            }`}>
              {market.catagory}
            </Badge>
            {statusInfo.badge}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(market.end_time)}
          </div>
        </div>
        
        <CardTitle className="text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {market.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {market.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Probability Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Market Prediction</span>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>Odds</span>
            </div>
          </div>
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${normalizedYesProb}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
              style={{ width: `${normalizedNoProb}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{normalizedYesProb.toFixed(0)}% YES</span>
            <span>{normalizedNoProb.toFixed(0)}% NO</span>
          </div>
        </div>

        {/* Odds Display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="group/yes relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-4 transition-all duration-200 hover:border-emerald-500/40 hover:from-emerald-500/15 hover:to-emerald-600/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-emerald-400">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span className="font-bold text-sm">YES</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {yesOdds.toFixed(2)}x
            </div>
            <div className="text-xs text-emerald-400/70 mt-1">
              ₹{(100 * yesOdds).toFixed(0)} for ₹100
            </div>
          </div>
          
          <div className="group/no relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/5 p-4 transition-all duration-200 hover:border-red-500/40 hover:from-red-500/15 hover:to-red-600/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-red-400">
                <TrendingDown className="h-4 w-4 mr-2" />
                <span className="font-bold text-sm">NO</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {noOdds.toFixed(2)}x
            </div>
            <div className="text-xs text-red-400/70 mt-1">
              ₹{(100 * noOdds).toFixed(0)} for ₹100
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          asChild 
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold transition-all duration-200 transform hover:translate-y-[-1px] disabled:hover:translate-y-0"
          disabled={market.isLocked || isExpired || !market.isOpen}
        >
          <Link to={`/market/${market.id}`} className="flex items-center justify-center gap-2">
            {market.outcome ? (
              <>
                <BarChart3 className="h-4 w-4" />
                View Results
              </>
            ) : market.isLocked || isExpired ? (
              <>
                <Lock className="h-4 w-4" />
                View Market
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Trade Now
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};