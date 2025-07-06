// Betting interface component for placing bets
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Market } from '@/types/api';
import { apiClient } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap, ArrowRight } from 'lucide-react';
import { formatBalance } from '@/lib/utils';

interface BettingInterfaceProps {
  market: Market;
  onBetPlaced?: () => void;
}

export const BettingInterface: React.FC<BettingInterfaceProps> = ({ market, onBetPlaced }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<'YES' | 'NO' | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const calculatePotentialPayout = () => {
    const amount = parseFloat(betAmount);
    if (!amount || !selectedOutcome) return 0;
    
    const odds = selectedOutcome === 'YES' ? market.Oddsyes : market.Oddsno;
    return Math.floor(amount * (odds || 2));
  };

  const handleBetSubmit = async () => {
    if (!selectedOutcome || !betAmount || !user) return;

    const amount = parseFloat(betAmount);
    
    if (amount > user.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this bet",
        variant: "destructive",
      });
      return;
    }

    if (amount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Minimum bet amount is ₹1",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiClient.placeBet({
        amount,
        marketId: market.id,
        outcome_chosen: selectedOutcome,
      });

      console.log('Bet placed successfully:', response);

      toast({
        title: "Bet Placed Successfully!",
        description: `Your ${selectedOutcome} bet of ${formatBalance(amount)} has been placed.`,
      });

      setBetAmount('');
      setSelectedOutcome(null);
      
      await refreshUser();
      
      setTimeout(() => {
        onBetPlaced?.();
      }, 100);
      
    } catch (error: any) {
      console.error('Bet placement failed:', error);
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isMarketActive = market.isOpen && !market.isLocked && new Date(market.end_time) > new Date();

  if (!isMarketActive) {
    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mb-4">
              <Target className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {market.outcome ? 'Market Resolved' : 'Trading Closed'}
            </h3>
            <p className="text-slate-400">
              {market.outcome ? 'This market has been resolved' : 'Betting is currently closed for this market'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const quickAmounts = [100, 500, 1000, 2500];
  const currentOdds = selectedOutcome === 'YES' ? market.Oddsyes : market.Oddsno;
  const potentialPayout = calculatePotentialPayout();

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm">
      {/* Header with gradient */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-primary to-red-500"></div>
      
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center text-xl font-bold text-white">
          <Zap className="h-5 w-5 mr-2 text-primary" />
          Place Your Trade
        </CardTitle>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>Available: {user ? formatBalance(user.balance) : '₹0'}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Target className="h-3 w-3" />
            <span className="text-xs">Live odds</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Outcome Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300">Choose Outcome</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedOutcome('YES')}
              className={`h-20 p-4 border-2 transition-all duration-200 ${
                selectedOutcome === 'YES' 
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                  : 'border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-bold">YES</span>
                </div>
                <div className="text-2xl font-bold">
                  {market.Oddsyes?.toFixed(2) || '2.00'}x
                </div>
                {selectedOutcome === 'YES' && (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                )}
              </div>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setSelectedOutcome('NO')}
              className={`h-20 p-4 border-2 transition-all duration-200 ${
                selectedOutcome === 'NO' 
                  ? 'border-red-500 bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400 shadow-lg shadow-red-500/20' 
                  : 'border-red-500/30 hover:border-red-500/50 hover:bg-red-500/5 text-red-300'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  <span className="font-bold">NO</span>
                </div>
                <div className="text-2xl font-bold">
                  {market.Oddsno?.toFixed(2) || '2.00'}x
                </div>
                {selectedOutcome === 'NO' && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Quick Amount Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-300">Quick Amounts</Label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBetAmount(amount.toString())}
                className="h-9 border-slate-600 text-slate-300 hover:border-primary hover:text-primary hover:bg-primary/10"
                disabled={user ? amount > user.balance : true}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="space-y-3">
          <Label htmlFor="bet-amount" className="text-sm font-medium text-slate-300">
            Custom Amount (₹)
          </Label>
          <div className="relative">
            <Input
              id="bet-amount"
              type="number"
              placeholder="Enter amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min="1"
              max={user?.balance || 0}
              step="1"
              className="h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              ₹
            </div>
          </div>
        </div>

        {/* Bet Summary */}
        {selectedOutcome && betAmount && parseFloat(betAmount) > 0 && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Betting on</span>
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  selectedOutcome === 'YES' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {selectedOutcome === 'YES' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {selectedOutcome}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Stake</div>
                  <div className="font-semibold text-white">{formatBalance(parseFloat(betAmount))}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Odds</div>
                  <div className="font-semibold text-primary">{currentOdds?.toFixed(2)}x</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Potential Win</div>
                  <div className="font-semibold text-emerald-400">{formatBalance(potentialPayout)}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>Profit: {formatBalance(potentialPayout - parseFloat(betAmount))}</span>
                <ArrowRight className="h-3 w-3" />
                <span>ROI: {((potentialPayout / parseFloat(betAmount) - 1) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleBetSubmit}
          disabled={!selectedOutcome || !betAmount || loading || parseFloat(betAmount) <= 0}
          className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Placing Trade...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {selectedOutcome ? `Place ${selectedOutcome} Trade` : 'Select Outcome'}
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};