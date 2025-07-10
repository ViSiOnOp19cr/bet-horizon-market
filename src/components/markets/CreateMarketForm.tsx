import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CreateMarketRequest } from '@/types/api';
import { apiClient } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('23:59');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time into ISO string
      let endDateTime = formData.end_time;
      if (selectedDate && selectedTime) {
        const [hours, minutes] = selectedTime.split(':');
        const dateTime = new Date(selectedDate);
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        endDateTime = dateTime.toISOString();
      }

      await apiClient.createMarket({
        ...formData,
        end_time: endDateTime,
      });
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
      setSelectedDate(undefined);
      setSelectedTime('23:59');
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

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(date);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      handleInputChange('end_time', dateTime.toISOString());
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      handleInputChange('end_time', dateTime.toISOString());
    }
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
            <Label>End Date & Time</Label>
            <div className="flex gap-2">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left font-normal bg-slate-800/50 border-slate-600 hover:bg-slate-700/50"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Time Input */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-32 bg-slate-800/50 border-slate-600"
                />
              </div>
            </div>
            {selectedDate && selectedTime && (
              <p className="text-sm text-slate-400">
                Market will end: {format(selectedDate, 'PPP')} at {selectedTime}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !selectedDate}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {loading ? 'Creating...' : 'Create Market'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};