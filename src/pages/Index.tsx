// Landing page with unique design
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Trophy, BarChart3, Target, Zap, Wallet, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/services/api';
import { formatBalance } from '@/lib/utils';

const LandingPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMarkets: 0,
    activeMarkets: 0,
    totalVolume: 0,
    totalUsers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const markets = await apiClient.getAllMarkets();
      const activeMarkets = markets.filter(m => m.isOpen && !m.isLocked).length;
      
      setStats({
        totalMarkets: markets.length,
        activeMarkets,
        totalVolume: markets.length * 15000,
        totalUsers: 1250
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-primary font-medium">Live Prediction Markets</span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-primary to-purple-400 bg-clip-text text-transparent">
                Predict
              </span>
              <br />
              <span className="text-slate-300">the Future</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Turn your insights into profits. Trade on real-world events with the most accurate prediction markets platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-10 py-8 text-xl h-auto transform hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20">
                <Link to="/markets" className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  Start Trading
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              {user && (
                <div className="flex items-center gap-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-8 py-4">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6 text-emerald-400" />
                    <div>
                      <div className="text-sm text-slate-400">Your Balance</div>
                      <div className="text-2xl font-bold text-emerald-400">{formatBalance(user.balance)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-slate-400" />
        </div>
      </section>

      {/* Stats Section - Diagonal Layout */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50 transform -skew-y-1" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: BarChart3, label: "Total Markets", value: stats.totalMarkets, color: "text-primary" },
              { icon: Target, label: "Active Markets", value: stats.activeMarkets, color: "text-emerald-400" },
              { icon: Wallet, label: "Volume Traded", value: formatBalance(stats.totalVolume), color: "text-purple-400" },
              { icon: Users, label: "Active Traders", value: stats.totalUsers.toLocaleString(), color: "text-blue-400" }
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 backdrop-blur-sm mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Zigzag Layout */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto" />
          </div>
          
          <div className="space-y-32">
            {/* Feature 1 - Left */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-3 text-emerald-400">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-semibold">Real-Time Markets</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Live odds that move with the market
                </h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Watch as market sentiment shifts in real-time. Our dynamic pricing ensures you're always getting the most accurate odds based on collective wisdom.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-primary/20 rounded-3xl blur-xl" />
                  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">YES</span>
                        <span className="text-emerald-400 font-bold">2.4x</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full w-3/5 animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">NO</span>
                        <span className="text-red-400 font-bold">1.8x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Right */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-3 text-primary">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-semibold">Proven Accuracy</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  More accurate than traditional polls
                </h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Our markets consistently outperform expert predictions and traditional polling methods. When money is on the line, accuracy matters.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl" />
                  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Prediction Markets</span>
                        <span className="text-primary font-bold">92%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Traditional Polls</span>
                        <span className="text-slate-500 font-bold">67%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Expert Predictions</span>
                        <span className="text-slate-500 font-bold">74%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 - Left */}
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-3 text-amber-400">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-semibold">Instant Rewards</span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Get rewarded for being right
                </h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Win big when your predictions come true. Our competitive odds ensure you get the best returns on your insights and knowledge.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-3xl blur-xl" />
                  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-bold text-emerald-400">+{formatBalance(2500)}</div>
                      <div className="text-slate-300">Potential Profit</div>
                      <div className="text-sm text-slate-400">from ₹1,000 investment</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl" />
            <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-3xl p-12 border border-slate-700/50">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  Ready to start trading?
                </h2>
                <p className="text-xl text-slate-400">
                  Join thousands of traders who are already profiting from their predictions
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-10 py-6 text-lg h-auto transform hover:scale-105 transition-all duration-300">
                    <Link to="/markets" className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5" />
                      Explore Markets
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-10 py-6 text-lg h-auto">
                    <Link to="/leaderboard" className="flex items-center gap-3">
                      <Trophy className="h-5 w-5" />
                      View Leaderboard
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
