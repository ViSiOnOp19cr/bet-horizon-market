// TypeScript interfaces for the prediction market platform

export interface User {
  id: number;
  email: string;
  balance: number;
  isAdmin: boolean;
}

export interface Market {
  id: number;
  title: string;
  description: string;
  isOpen: boolean;
  end_time: string;
  isLocked: boolean;
  catagory: 'Sports' | 'Esports';
  outcome?: 'YES' | 'NO' | null;
  Oddsyes?: number;
  Oddsno?: number;
  createdAt: string;
  creatorId: number;
}

export interface Bet {
  id: number;
  type: string;
  userId: number;
  marketId: number;
  status: 'PENDING' | 'WON' | 'LOST';
  amount: number;
  outcome_chosen: 'YES' | 'NO';
  odds: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BET_PLACED' | 'BET_WON';
  amount: number;
  userId: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: number;
  email: string;
  totalWinnings: number;
}

// Request/Response interfaces
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SigninResponse {
  message: string;
  token: string;
}

export interface CreateMarketRequest {
  title: string;
  description: string;
  end_time: string;
  catagory: 'Sports' | 'Esports';
}

export interface UpdateMarketRequest {
  title?: string;
  description?: string;
  end_time?: string;
  catagory?: 'Sports' | 'Esports';
}

export interface PlaceBetRequest {
  amount: number;
  marketId: number;
  outcome_chosen: 'YES' | 'NO';
}

export interface PlaceBetResponse {
  message: string;
  bet: {
    amount: number;
    outcome_chosen: 'YES' | 'NO';
    odds: number;
  };
  updatedMarketOdds: {
    oddsYes: number;
    oddsNo: number;
  };
}

export interface ResolveMarketRequest {
  outcome: 'YES' | 'NO';
}

// API Response wrappers
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    path: string[];
    message: string;
  }>;
}