import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WatchlistItem } from '@/types';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface WatchlistTableProps {
  watchlist: WatchlistItem[];
  onRemoveStock: (stockId: string) => void;
}

const WatchlistTable = ({ watchlist, onRemoveStock }: WatchlistTableProps) => {
  if (watchlist.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-2">Your watchlist is empty</p>
        <p className="text-sm text-muted-foreground">Click "Add Stock" to start tracking stocks</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Exchange</TableHead>
            <TableHead>Added Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((item) => (
            <TableRow key={item.userstocklistid}>
              <TableCell className="font-mono font-semibold text-primary">
                {item.stock_id}
              </TableCell>
              <TableCell>{item.company_name || 'N/A'}</TableCell>
              <TableCell>{item.exchange || 'N/A'}</TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(item.added_date), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveStock(item.stock_id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WatchlistTable;
