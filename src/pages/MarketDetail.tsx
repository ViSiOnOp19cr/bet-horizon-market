// Market detail page with betting interface
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BettingInterface } from '@/components/betting/BettingInterface';
import { Market, Bet } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Clock, TrendingUp, TrendingDown, Users, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const MarketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [market, setMarket] = useState<Market | null>(null);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchMarketData();
    }
  }, [id]);

  const fetchMarketData = async () => {
    try {
      const [marketData, betsData] = await Promise.all([
        apiClient.getMarketById(Number(id)),
        apiClient.getBetsForMarket(Number(id)),
      ]);
      
      setMarket(marketData);
      setUserBets(betsData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load market details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance / 100);
  };

  const getStatusBadge = (market: Market) => {
    if (market.outcome) {
      return (
        <Badge variant="secondary" className="bg-success/20 text-success">
          Resolved: {market.outcome}
        </Badge>
      );
    }
    if (market.isLocked || new Date(market.end_time) < new Date()) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Market Not Found</h1>
            <p className="text-muted-foreground">The market you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Market Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Header */}
            <Card className="bg-gradient-card border-slate-700/50">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {market.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {getStatusBadge(market)}
                      <Badge 
                        variant="outline" 
                        className={`${
                          market.catagory === 'Sports' 
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                            : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                        }`}
                      >
                        {market.catagory}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {market.description}
                </p>
              </CardHeader>
            </Card>

            {/* Market Stats */}
            <Card className="bg-gradient-card border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Market Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">Ends</span>
                    </div>
                    <p className="font-medium">{formatDate(market.end_time)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">Your Bets</span>
                    </div>
                    <p className="font-medium">{userBets.length} bets placed</p>
                  </div>
                </div>
                
                {/* Current Odds */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                  <div className="bg-yes-bet/10 border border-yes-bet/20 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center text-yes-bet mb-2">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      <span className="font-semibold">YES</span>
                    </div>
                    <div className="text-2xl font-bold text-yes-bet">
                      {market.Oddsyes?.toFixed(2) || '2.00'}x
                    </div>
                  </div>
                  <div className="bg-no-bet/10 border border-no-bet/20 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center text-no-bet mb-2">
                      <TrendingDown className="h-5 w-5 mr-2" />
                      <span className="font-semibold">NO</span>
                    </div>
                    <div className="text-2xl font-bold text-no-bet">
                      {market.Oddsno?.toFixed(2) || '2.00'}x
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User's Bets */}
            {userBets.length > 0 && (
              <Card className="bg-gradient-card border-slate-700/50">
                <CardHeader>
                  <CardTitle>Your Bets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userBets.map((bet) => (
                      <div
                        key={bet.id}
                        className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="outline"
                            className={
                              bet.outcome_chosen === 'YES'
                                ? 'border-yes-bet text-yes-bet'
                                : 'border-no-bet text-no-bet'
                            }
                          >
                            {bet.outcome_chosen}
                          </Badge>
                          <span className="font-medium">
                            {formatBalance(bet.amount)}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            @ {bet.odds.toFixed(2)}x
                          </span>
                        </div>
                        <Badge
                          variant={
                            bet.status === 'WON' ? 'default' :
                            bet.status === 'LOST' ? 'destructive' : 'secondary'
                          }
                          className={
                            bet.status === 'WON' ? 'bg-success text-success-foreground' :
                            bet.status === 'PENDING' ? 'bg-warning/20 text-warning' : ''
                          }
                        >
                          {bet.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Betting Interface */}
          <div className="lg:col-span-1">
            <BettingInterface 
              market={market} 
              onBetPlaced={fetchMarketData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;