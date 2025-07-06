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
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
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
    const amount = parseFloat(betAmount); // Amount is already in rupees
    if (!amount || !selectedOutcome) return 0;
    
    const odds = selectedOutcome === 'YES' ? market.Oddsyes : market.Oddsno;
    return Math.floor(amount * (odds || 2));
  };

  const handleBetSubmit = async () => {
    if (!selectedOutcome || !betAmount || !user) return;

    const amount = parseFloat(betAmount); // Amount is in rupees
    
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
      
      // Refresh user balance first
      await refreshUser();
      
      // Then refresh market data with a small delay to ensure backend has updated
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
      <Card className="bg-gradient-card border-slate-700/50">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {market.outcome ? 'This market has been resolved' : 'Betting is currently closed for this market'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-primary" />
          Place Your Bet
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Available Balance: {user ? formatBalance(user.balance) : '₹0'}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Outcome Selection */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={selectedOutcome === 'YES' ? 'default' : 'outline'}
            onClick={() => setSelectedOutcome('YES')}
            className={`h-auto p-4 flex flex-col space-y-2 ${
              selectedOutcome === 'YES' 
                ? 'bg-yes-bet hover:bg-yes-bet/90' 
                : 'border-yes-bet/50 hover:border-yes-bet hover:bg-yes-bet/10'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">YES</span>
            </div>
            <span className="text-lg font-bold">
              {market.Oddsyes?.toFixed(2) || '2.00'}x
            </span>
          </Button>
          
          <Button
            variant={selectedOutcome === 'NO' ? 'default' : 'outline'}
            onClick={() => setSelectedOutcome('NO')}
            className={`h-auto p-4 flex flex-col space-y-2 ${
              selectedOutcome === 'NO' 
                ? 'bg-no-bet hover:bg-no-bet/90' 
                : 'border-no-bet/50 hover:border-no-bet hover:bg-no-bet/10'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span className="font-semibold">NO</span>
            </div>
            <span className="text-lg font-bold">
              {market.Oddsno?.toFixed(2) || '2.00'}x
            </span>
          </Button>
        </div>

        {/* Bet Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="bet-amount">Bet Amount (₹)</Label>
          <Input
            id="bet-amount"
            type="number"
            placeholder="Enter amount"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min="1"
            max={user?.balance || 0}
            step="1"
            className="bg-slate-800/50 border-slate-600"
          />
        </div>

        {/* Potential Payout */}
        {selectedOutcome && betAmount && (
          <div className="bg-slate-800/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bet Amount:</span>
              <span>{formatBalance(parseFloat(betAmount))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Odds:</span>
              <span>{selectedOutcome === 'YES' ? market.Oddsyes?.toFixed(2) : market.Oddsno?.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-slate-600 pt-2">
              <span>Potential Payout:</span>
              <span className="text-success">{formatBalance(calculatePotentialPayout())}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleBetSubmit}
          disabled={!selectedOutcome || !betAmount || loading || parseFloat(betAmount) <= 0}
          className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          {loading ? 'Placing Bet...' : `Place ${selectedOutcome || ''} Bet`}
        </Button>
      </CardContent>
    </Card>
  );
};