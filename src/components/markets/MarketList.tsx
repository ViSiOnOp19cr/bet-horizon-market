// Market list component with filtering and search
import React, { useState, useEffect } from 'react';
import { MarketCard } from './MarketCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Market } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react';

interface MarketListProps {
  title?: string;
  showFilters?: boolean;
}

export const MarketList: React.FC<MarketListProps> = ({ title, showFilters = true }) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllMarkets();
      setMarkets(data);
    } catch (error) {
      console.error('Failed to fetch markets:', error);
      toast({
        title: "Error",
        description: "Failed to load markets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || market.catagory === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && market.isOpen && !market.isLocked && !market.outcome) ||
                         (statusFilter === 'locked' && (market.isLocked || new Date(market.end_time) < new Date())) ||
                         (statusFilter === 'resolved' && market.outcome);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusStats = () => {
    const active = markets.filter(m => m.isOpen && !m.isLocked && !m.outcome).length;
    const locked = markets.filter(m => m.isLocked || new Date(m.end_time) < new Date()).length;
    const resolved = markets.filter(m => m.outcome).length;
    
    return { active, locked, resolved };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          </div>
        )}
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading markets...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        </div>
      )}

      {showFilters && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{stats.active}</span>
              <span className="text-sm text-emerald-400/70">Active</span>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full border border-amber-500/20">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{stats.locked}</span>
              <span className="text-sm text-amber-400/70">Locked</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{stats.resolved}</span>
              <span className="text-sm text-blue-400/70">Resolved</span>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search markets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-slate-800/50 border-slate-600 text-white focus:border-primary focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-slate-800/50 border-slate-600 text-white focus:border-primary focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Results Summary */}
              {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-400">Filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  {categoryFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                      Category: {categoryFilter}
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                      Status: {statusFilter}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setStatusFilter('all');
                    }}
                    className="text-slate-400 hover:text-white h-auto py-1 px-2"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Markets Grid */}
      {filteredMarkets.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700/50 rounded-full mb-4">
            <Filter className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Markets Found</h3>
          <p className="text-slate-400 mb-4">
            {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? "Try adjusting your filters to see more markets"
              : "No markets are available at the moment"}
          </p>
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
};