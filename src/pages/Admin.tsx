// Admin dashboard for managing markets
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Settings, Lock, CheckCircle, XCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      const data = await apiClient.getAllMarkets();
      setMarkets(data);
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
        description: "Bets locked successfully",
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
    try {
      await apiClient.resolveMarket(marketId, { outcome });
      toast({
        title: "Success",
        description: `Market resolved as ${outcome}`,
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

          <Card className="bg-gradient-card border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Market Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {markets.map((market) => (
                  <div key={market.id} className="p-4 bg-slate-800/30 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{market.title}</h3>
                        <p className="text-muted-foreground text-sm">{market.description}</p>
                      </div>
                      <Badge variant={market.outcome ? "default" : market.isLocked ? "secondary" : "outline"}>
                        {market.outcome ? `Resolved: ${market.outcome}` : market.isLocked ? "Locked" : "Active"}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      {!market.isLocked && !market.outcome && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLockBets(market.id)}
                          className="border-warning text-warning hover:bg-warning/10"
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Lock Bets
                        </Button>
                      )}
                      
                      {market.isLocked && !market.outcome && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveMarket(market.id, 'YES')}
                            className="border-yes-bet text-yes-bet hover:bg-yes-bet/10"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve YES
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResolveMarket(market.id, 'NO')}
                            className="border-no-bet text-no-bet hover:bg-no-bet/10"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Resolve NO
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;