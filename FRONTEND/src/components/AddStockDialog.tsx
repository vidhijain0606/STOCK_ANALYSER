import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';
import { Search } from 'lucide-react';

interface AddStockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStockAdded: () => void;
  userId: number | null;
}

const AddStockDialog = ({ isOpen, onClose, onStockAdded, userId }: AddStockDialogProps) => {
  const { toast } = useToast();
  const [ticker, setTicker] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !ticker.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.addToWatchlist, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          stock_id: ticker.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Stock added',
          description: `${ticker.toUpperCase()} has been added to your watchlist.`,
        });
        setTicker('');
        onClose();
        onStockAdded();
      } else {
        toast({
          title: 'Error adding stock',
          description: data.error || 'Unable to add stock to watchlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Connection error',
        description: 'Unable to connect to the backend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock to Watchlist</DialogTitle>
          <DialogDescription>
            Enter a stock ticker symbol to add it to your watchlist
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Stock Ticker</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="ticker"
                  placeholder="e.g., AAPL, GOOGL, TSLA"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the ticker symbol as it appears on the stock exchange
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !ticker.trim()}>
              {isLoading ? 'Adding...' : 'Add Stock'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockDialog;
