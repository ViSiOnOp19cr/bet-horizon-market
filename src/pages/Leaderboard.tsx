// Leaderboard page showing top winners
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await apiClient.getLeaderboard();
      setLeaderboard(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance / 100);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (index: number) => {
    const rank = index + 1;
    if (rank === 1) {
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">1st</Badge>;
    }
    if (rank === 2) {
      return <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">2nd</Badge>;
    }
    if (rank === 3) {
      return <Badge className="bg-amber-600/20 text-amber-600 border-amber-600/30">3rd</Badge>;
    }
    return <Badge variant="outline" className="border-slate-600">#{rank}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-1/3" />
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top performers on PredictionMarket
            </p>
          </div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* 2nd Place */}
              <Card className="bg-gradient-card border-slate-700/50 md:order-1">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <Badge className="bg-gray-400/20 text-gray-400 border-gray-400/30">
                      2nd Place
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg truncate">
                    {leaderboard[1].email.split('@')[0]}
                  </h3>
                  <p className="text-2xl font-bold text-success mt-2">
                    {formatBalance(leaderboard[1].totalWinnings)}
                  </p>
                </CardContent>
              </Card>

              {/* 1st Place */}
              <Card className="bg-gradient-card border-yellow-500/30 md:order-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />
                <CardContent className="pt-6 text-center relative z-10">
                  <div className="mb-4">
                    <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
                    <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                      Champion
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-xl truncate">
                    {leaderboard[0].email.split('@')[0]}
                  </h3>
                  <p className="text-3xl font-bold text-success mt-2">
                    {formatBalance(leaderboard[0].totalWinnings)}
                  </p>
                </CardContent>
              </Card>

              {/* 3rd Place */}
              <Card className="bg-gradient-card border-slate-700/50 md:order-3">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4">
                    <Medal className="h-12 w-12 text-amber-600 mx-auto mb-2" />
                    <Badge className="bg-amber-600/20 text-amber-600 border-amber-600/30">
                      3rd Place
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg truncate">
                    {leaderboard[2].email.split('@')[0]}
                  </h3>
                  <p className="text-2xl font-bold text-success mt-2">
                    {formatBalance(leaderboard[2].totalWinnings)}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Full Leaderboard */}
          <Card className="bg-gradient-card border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                All Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No winners yet</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Be the first to win big on prediction markets!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-lg transition-smooth ${
                        index < 3 
                          ? 'bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600/50' 
                          : 'bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700/50">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {entry.email.split('@')[0]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {entry.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-success">
                            {formatBalance(entry.totalWinnings)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Winnings
                          </p>
                        </div>
                        {getRankBadge(index)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;