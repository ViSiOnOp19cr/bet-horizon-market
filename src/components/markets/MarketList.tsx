// Market list component with filtering and search
import React, { useState, useEffect } from 'react';
import { MarketCard } from './MarketCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Market } from '@/types/api';
import { apiClient } from '@/services/api';
import { Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MarketListProps {
  title?: string;
  showFilters?: boolean;
}

type FilterType = 'all' | 'active' | 'Sports' | 'Esports';

export const MarketList: React.FC<MarketListProps> = ({ 
  title = "All Markets", 
  showFilters = true 
}) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  useEffect(() => {
    filterMarkets();
  }, [markets, searchTerm, activeFilter]);

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

  const filterMarkets = () => {
    let filtered = markets;

    // Apply category/status filter
    if (activeFilter === 'active') {
      filtered = filtered.filter(market => 
        market.isOpen && !market.isLocked && new Date(market.end_time) > new Date()
      );
    } else if (activeFilter === 'Sports' || activeFilter === 'Esports') {
      filtered = filtered.filter(market => market.catagory === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(market =>
        market.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMarkets(filtered);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      filterMarkets();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await apiClient.searchMarkets(searchTerm);
      setMarkets(searchResults);
    } catch (error: any) {
      toast({
        title: "Search Error",
        description: "Failed to search markets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: 'all', label: 'All Markets', count: markets.length },
    { 
      key: 'active', 
      label: 'Active', 
      count: markets.filter(m => m.isOpen && !m.isLocked && new Date(m.end_time) > new Date()).length 
    },
    { 
      key: 'Sports', 
      label: 'Sports', 
      count: markets.filter(m => m.catagory === 'Sports').length 
    },
    { 
      key: 'Esports', 
      label: 'Esports', 
      count: markets.filter(m => m.catagory === 'Esports').length 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-slate-800/50 border-slate-600"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                size="sm"
                variant="outline"
                className="border-slate-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              className={`cursor-pointer transition-smooth ${
                activeFilter === filter.key 
                  ? 'bg-primary text-primary-foreground' 
                  : 'border-slate-600 hover:border-primary'
              }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              <Filter className="h-3 w-3 mr-1" />
              {filter.label} ({filter.count || 0})
            </Badge>
          ))}
        </div>
      )}

      {filteredMarkets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No markets found</p>
          <p className="text-muted-foreground text-sm mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
};