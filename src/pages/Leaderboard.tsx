// Leaderboard page showing top winners
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaderboardEntry } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Medal, Award, TrendingUp, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBalance } from '@/lib/utils';

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
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-slate-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-slate-500" />;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">1st Place</Badge>;
      case 2:
        return <Badge className="bg-gradient-to-r from-slate-300 to-slate-500 text-black">2nd Place</Badge>;
      case 3:
        return <Badge className="bg-gradient-to-r from-amber-500 to-amber-700 text-white">3rd Place</Badge>;
      default:
        return <Badge variant="secondary">#{position}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Top performers on PaisaPredict
            </p>
          </div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top performers on PaisaPredict
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Leaders Yet</h3>
            <p className="text-muted-foreground">
              Be the first to make winning predictions and claim the top spot!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => {
              const position = index + 1;
              const isTopThree = position <= 3;
              
              return (
                <Card 
                  key={entry.userId} 
                  className={`transition-smooth hover:scale-105 ${
                    isTopThree 
                      ? 'bg-gradient-card border-primary/30 shadow-lg shadow-primary/10' 
                      : 'bg-gradient-card border-slate-700/50'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getRankIcon(position)}
                          <div className="text-2xl font-bold text-foreground">
                            #{position}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-lg text-foreground">
                              {entry.email}
                            </h3>
                            {getRankBadge(position)}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            User ID: {entry.userId}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-success mb-1">
                          {formatBalance(entry.totalWinnings)}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Total Winnings
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;