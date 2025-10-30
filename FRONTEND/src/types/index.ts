export interface User {
  user_id: number;
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
}

export interface WatchlistItem {
  userstocklistid: number;
  user_id: number;
  stock_id: string;
  added_date: string;
  company_name?: string;
  exchange?: string;
}

export interface StockAnalysis {
  ticker: string;
  historical_date: string;
  historical_price: number;
  recent_date: string;
  recent_price: number;
  price_difference: number;
  percentage_change: number;
}

export interface AuthResponse {
  message?: string;
  error?: string;
  user_id?: number;
  username?: string;
}
