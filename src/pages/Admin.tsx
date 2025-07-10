// Admin dashboard for managing markets
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Settings, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { CreateMarketForm } from '@/components/markets/CreateMarketForm';

const Admin: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingMarket, setResolvingMarket] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const data = await apiClient.getAllMarkets();
      // Sort markets by creation date - newest first
      const sortedMarkets = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMarkets(sortedMarkets);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load markets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLockBets = async (marketId: number) => {
    try {
      await apiClient.lockBets(marketId);
      toast({
        title: "Success",
        description: "Bets locked successfully. You can now resolve this market.",
      });
      fetchMarkets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResolveMarket = async (marketId: number, outcome: 'YES' | 'NO') => {
    setResolvingMarket(marketId);
    try {
      await apiClient.resolveMarket(marketId, { outcome });
      toast({
        title: "Market Resolved Successfully!",
        description: `Market has been closed with outcome: ${outcome}. All bets have been settled and winners paid out.`,
      });
      fetchMarkets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResolvingMarket(null);
    }
  };

  const getMarketStatus = (market: Market) => {
    if (market.outcome) {
      return {
        badge: <Badge className="bg-success/20 text-success border-success/30">Resolved: {market.outcome}</Badge>,
        description: "Market has been closed and all bets settled"
      };
    }
    if (market.isLocked) {
      return {
        badge: <Badge className="bg-warning/20 text-warning border-warning/30">Locked - Ready to Resolve</Badge>,
        description: "Bets are locked. Choose the winning outcome to close this market."
      };
    }
    if (market.isOpen) {
      return {
        badge: <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>,
        description: "Market is active and accepting bets"
      };
    }
    return {
      badge: <Badge variant="secondary">Closed</Badge>,
      description: "Market is closed"
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage markets and resolve outcomes</p>
          </div>

          <CreateMarketForm onMarketCreated={fetchMarkets} />

          <Card className="bg-gradient-card border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Market Management ({markets.length} total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {markets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No markets found. Create your first market above.
                </div>
              ) : (
                <div className="space-y-6">
                  {markets.map((market) => {
                    const status = getMarketStatus(market);
                    return (
                      <div key={market.id} className="p-6 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-lg text-foreground">{market.title}</h3>
                              {status.badge}
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{market.description}</p>
                            <p className="text-xs text-muted-foreground">{status.description}</p>
                            
                            {/* Market Details */}
                            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Category: {market.catagory}</span>
                              <span>•</span>
                              <span>Ends: {new Date(market.end_time).toLocaleDateString()}</span>
                              {market.Oddsyes && market.Oddsno && (
                                <>
                                  <span>•</span>
                                  <span>Odds - YES: {market.Oddsyes.toFixed(2)}x, NO: {market.Oddsno.toFixed(2)}x</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 flex-wrap">
                          {/* Step 1: Lock Bets */}
                          {!market.isLocked && !market.outcome && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLockBets(market.id)}
                              className="border-warning text-warning hover:bg-warning/10"
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Step 1: Lock Bets
                            </Button>
                          )}
                          
                          {/* Step 2: Resolve Market */}
                          {market.isLocked && !market.outcome && (
                            <>
                              <div className="flex items-center gap-2 text-sm text-warning">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">Step 2: Choose winning outcome to close market</span>
                              </div>
                              <div className="flex gap-2 w-full mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResolveMarket(market.id, 'YES')}
                                  disabled={resolvingMarket === market.id}
                                  className="border-yes-bet text-yes-bet hover:bg-yes-bet/10 flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {resolvingMarket === market.id ? 'Resolving...' : 'Close Market - YES Wins'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResolveMarket(market.id, 'NO')}
                                  disabled={resolvingMarket === market.id}
                                  className="border-no-bet text-no-bet hover:bg-no-bet/10 flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  {resolvingMarket === market.id ? 'Resolving...' : 'Close Market - NO Wins'}
                                </Button>
                              </div>
                            </>
                          )}

                          {/* Market Resolved */}
                          {market.outcome && (
                            <div className="flex items-center gap-2 text-sm text-success">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">Market closed - {market.outcome} won</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;