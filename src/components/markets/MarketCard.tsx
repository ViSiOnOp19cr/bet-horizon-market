// Individual market card component
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Market } from '@/types/api';
import { Clock, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MarketCardProps {
  market: Market;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isExpired = new Date(market.end_time) < new Date();
  const getStatusBadge = () => {
    if (market.outcome) {
      return (
        <Badge variant="secondary" className="bg-success/20 text-success">
          Resolved: {market.outcome}
        </Badge>
      );
    }
    if (market.isLocked || isExpired) {
      return (
        <Badge variant="secondary" className="bg-warning/20 text-warning">
          <Lock className="h-3 w-3 mr-1" />
          Locked
        </Badge>
      );
    }
    if (market.isOpen) {
      return (
        <Badge variant="secondary" className="bg-success/20 text-success">
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-slate-500/20 text-slate-400">
        Closed
      </Badge>
    );
  };

  const getCategoryColor = (category: string) => {
    return category === 'Sports' 
      ? 'bg-blue-500/20 text-blue-400' 
      : 'bg-purple-500/20 text-purple-400';
  };

  return (
    <Card className="market-card hover:shadow-elevated transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
              {market.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {market.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          {getStatusBadge()}
          <Badge 
            variant="outline" 
            className={`${getCategoryColor(market.catagory)} border-current`}
          >
            {market.catagory}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Odds Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yes-bet/10 border border-yes-bet/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center text-yes-bet mb-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="font-semibold">YES</span>
              </div>
              <div className="text-lg font-bold text-yes-bet">
                {market.Oddsyes?.toFixed(2) || '2.00'}x
              </div>
            </div>
            <div className="bg-no-bet/10 border border-no-bet/20 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center text-no-bet mb-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="font-semibold">NO</span>
              </div>
              <div className="text-lg font-bold text-no-bet">
                {market.Oddsno?.toFixed(2) || '2.00'}x
              </div>
            </div>
          </div>

          {/* Market Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Ends: {formatDate(market.end_time)}
            </div>
          </div>

          {/* Action Button */}
          <Button 
            asChild 
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
            disabled={market.isLocked || isExpired || !market.isOpen}
          >
            <Link to={`/market/${market.id}`}>
              {market.outcome ? 'View Results' : 
               market.isLocked || isExpired ? 'View Market' : 'Place Bet'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};