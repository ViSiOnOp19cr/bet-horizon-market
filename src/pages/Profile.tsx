// User profile page
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Bet, Transaction } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { User, TrendingUp, TrendingDown, DollarSign, Clock, Trophy } from 'lucide-react';
import { formatBalance } from '@/lib/utils';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [betsData, transactionsData] = await Promise.all([
        apiClient.getAllBets(),
        apiClient.getAllTransactions(),
      ]);
      
      // Sort bets by creation date - newest first
      const sortedBets = betsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Sort transactions by creation date - newest first
      const sortedTransactions = transactionsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setBets(sortedBets);
      setTransactions(sortedTransactions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStats = () => {
    const totalBets = bets.length;
    const wonBets = bets.filter(bet => bet.status === 'WON').length;
    const lostBets = bets.filter(bet => bet.status === 'LOST').length;
    const pendingBets = bets.filter(bet => bet.status === 'PENDING').length;
    const winRate = totalBets > 0 ? ((wonBets / (wonBets + lostBets)) * 100) : 0;
    
    const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalWinnings = transactions
      .filter(tx => tx.type === 'BET_WON')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      winRate,
      totalWagered,
      totalWinnings,
    };
  };

  const stats = getStats();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="bg-gradient-card border-slate-700/50">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {user.email}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="border-primary text-primary">
                      {user.isAdmin ? 'Admin' : 'Trader'}
                    </Badge>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      Member since {formatDate(new Date().toISOString())}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-2xl font-bold text-success">
                      {formatBalance(user.balance)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bets</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalBets}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <Trophy className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-slate-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Winnings</p>
                    <p className="text-2xl font-bold text-success">
                      {formatBalance(stats.totalWinnings)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="bets" className="space-y-6">
            <TabsList className="bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="bets">My Bets</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="bets">
              <Card className="bg-gradient-card border-slate-700/50">
                <CardHeader>
                  <CardTitle>Betting History</CardTitle>
                </CardHeader>
                <CardContent>
                  {bets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No bets placed yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bets.map((bet) => (
                        <div
                          key={bet.id}
                          className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant="outline"
                              className={
                                bet.outcome_chosen === 'YES'
                                  ? 'border-yes-bet text-yes-bet'
                                  : 'border-no-bet text-no-bet'
                              }
                            >
                              {bet.outcome_chosen === 'YES' ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {bet.outcome_chosen}
                            </Badge>
                            <div>
                              <p className="font-medium">{formatBalance(bet.amount)}</p>
                              <p className="text-sm text-muted-foreground">
                                @ {bet.odds.toFixed(2)}x odds
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
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
                            <span className="text-sm text-muted-foreground">
                              {formatDate(bet.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="bg-gradient-card border-slate-700/50">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'BET_WON' ? 'bg-success/20' :
                              transaction.type === 'BET_PLACED' ? 'bg-primary/20' :
                              transaction.type === 'DEPOSIT' ? 'bg-success/20' :
                              'bg-destructive/20'
                            }`}>
                              {transaction.type === 'BET_WON' && <Trophy className="h-4 w-4 text-success" />}
                              {transaction.type === 'BET_PLACED' && <TrendingUp className="h-4 w-4 text-primary" />}
                              {transaction.type === 'DEPOSIT' && <DollarSign className="h-4 w-4 text-success" />}
                              {transaction.type === 'WITHDRAW' && <DollarSign className="h-4 w-4 text-destructive" />}
                            </div>
                            <div>
                              <p className="font-medium capitalize">
                                {transaction.type.replace('_', ' ').toLowerCase()}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className={`font-semibold ${
                            transaction.type === 'BET_WON' || transaction.type === 'DEPOSIT' 
                              ? 'text-success' 
                              : 'text-foreground'
                          }`}>
                            {transaction.type === 'BET_WON' || transaction.type === 'DEPOSIT' ? '+' : '-'}
                            {formatBalance(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;