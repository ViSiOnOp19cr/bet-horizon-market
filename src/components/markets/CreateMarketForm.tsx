import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateMarketRequest } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface CreateMarketFormProps {
  onMarketCreated: () => void;
}

export const CreateMarketForm: React.FC<CreateMarketFormProps> = ({ onMarketCreated }) => {
  const [formData, setFormData] = useState<CreateMarketRequest>({
    title: '',
    description: '',
    end_time: '',
    catagory: 'Sports',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.createMarket(formData);
      toast({
        title: "Success",
        description: "Market created successfully",
      });
      setFormData({
        title: '',
        description: '',
        end_time: '',
        catagory: 'Sports',
      });
      onMarketCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateMarketRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="bg-gradient-card border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2 text-primary" />
          Create New Market
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Market Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Will Bitcoin reach $100k by end of 2024?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of the market conditions and resolution criteria..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.catagory}
              onValueChange={(value: 'Sports' | 'Esports') => handleInputChange('catagory', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Esports">Esports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">End Date & Time</Label>
            <Input
              id="end_time"
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => handleInputChange('end_time', e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {loading ? 'Creating...' : 'Create Market'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};