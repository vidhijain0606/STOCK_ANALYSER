import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/config/api';
import { WatchlistItem } from '@/types';
import { TrendingUp, LogOut, Plus } from 'lucide-react';
import WatchlistTable from '@/components/WatchlistTable';
import AddStockDialog from '@/components/AddStockDialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);

  // ✅ Load user info and fetch watchlist
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username');

    if (!storedUserId || !storedUsername) {
      navigate('/');
      return;
    }

    const uid = parseInt(storedUserId);
    setUserId(uid);
    setUsername(storedUsername);

    fetchWatchlist(uid);
  }, [navigate]);

  // ✅ Fetch watchlist from backend
  const fetchWatchlist = async (uid: number) => {
    setIsLoading(true);
    try {
      // Directly call backend endpoint
      const response = await fetch(`http://127.0.0.1:5000/watchlist/${uid}`);
      const data = await response.json();
      console.log('Fetched watchlist data:', data);

      if (response.ok) {
        // Your backend sends { watchlist: [...] }
        const stocks = Array.isArray(data) ? data : data.watchlist;
        setWatchlist(stocks || []);
      } else {
        toast({
          title: 'Error loading watchlist',
          description: data.error || 'Unable to fetch watchlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast({
        title: 'Connection error',
        description: 'Unable to connect to the backend.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  // ✅ Refresh after adding a stock
  const handleStockAdded = () => {
    if (userId) fetchWatchlist(userId);
  };

  // ✅ Remove a stock
  const handleRemoveStock = async (stockId: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/watchlist/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, stock_id: stockId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Stock removed',
          description: `${stockId} has been removed from your watchlist.`,
        });
        fetchWatchlist(userId);
      } else {
        toast({
          title: 'Error removing stock',
          description: data.error || 'Unable to remove stock',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error removing stock:', error);
      toast({
        title: 'Connection error',
        description: 'Unable to connect to the backend.',
        variant: 'destructive',
      });
    }
  };

  // ✅ Render UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Stock Portfolio</h1>
              <p className="text-sm text-muted-foreground">Welcome, {username}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">My Watchlist</h2>
            <p className="text-muted-foreground">Track and manage your favorite stocks</p>
          </div>
          <Button onClick={() => setIsAddStockOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stock
          </Button>
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Stocks</CardTitle>
            <CardDescription>
              {watchlist.length === 0
                ? 'No stocks in your watchlist yet. Add some to get started!'
                : `Tracking ${watchlist.length} stock${watchlist.length !== 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading watchlist...</div>
            ) : (
              <WatchlistTable watchlist={watchlist} onRemoveStock={handleRemoveStock} />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Stock Dialog */}
      <AddStockDialog
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onStockAdded={handleStockAdded}
        userId={userId}
      />
    </div>
  );
};

export default Dashboard;
