// API Client Service for Prediction Market Platform
import {
  User,
  Market,
  Bet,
  Transaction,
  LeaderboardEntry,
  SignupRequest,
  SigninRequest,
  SigninResponse,
  CreateMarketRequest,
  UpdateMarketRequest,
  PlaceBetRequest,
  PlaceBetResponse,
  ResolveMarketRequest,
  ApiError,
} from '@/types/api';
import config from '@/config/env';

class ApiClient {
  private baseURL = config.apiUrl;

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'An error occurred',
        errors: data.errors,
      };
      throw error;
    }
    
    return data;
  }

  // Authentication Methods
  async signup(request: SignupRequest): Promise<void> {
    const response = await fetch(`${this.baseURL}/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    await this.handleResponse(response);
  }

  async signin(request: SigninRequest): Promise<SigninResponse> {
    const response = await fetch(`${this.baseURL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return this.handleResponse<SigninResponse>(response);
  }

  async getMe(): Promise<User> {
    const response = await fetch(`${this.baseURL}/users/me`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ user: User }>(response);
    return data.user;
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseURL}/users/leaderboard`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ leaderboard: LeaderboardEntry[] }>(response);
    return data.leaderboard;
  }

  // Market Methods
  async createMarket(request: CreateMarketRequest): Promise<Market> {
    const response = await fetch(`${this.baseURL}/markets/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(request),
    });

    const data = await this.handleResponse<{ market: Market }>(response);
    return data.market;
  }

  async updateMarket(id: number, request: UpdateMarketRequest): Promise<Market> {
    const response = await fetch(`${this.baseURL}/markets/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(request),
    });

    return this.handleResponse<Market>(response);
  }

  async getAllMarkets(): Promise<Market[]> {
    const response = await fetch(`${this.baseURL}/markets/getallmarkets`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ markets: Market[] }>(response);
    return data.markets;
  }

  async getMarketById(id: number): Promise<Market> {
    const response = await fetch(`${this.baseURL}/markets/getmarket/${id}`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ market: Market }>(response);
    return data.market;
  }

  async getOpenMarkets(): Promise<Market[]> {
    const response = await fetch(`${this.baseURL}/markets/openmarkets`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ markets: Market[] }>(response);
    return data.markets;
  }

  async getMarketsByCategory(category: 'Sports' | 'Esports'): Promise<Market[]> {
    const response = await fetch(`${this.baseURL}/markets/getmarketsbycatagory/${category}`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ markets: Market[] }>(response);
    return data.markets;
  }

  async lockBets(id: number): Promise<Market> {
    const response = await fetch(`${this.baseURL}/markets/lockbets/${id}`, {
      method: 'POST',
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ lockedMarket: Market }>(response);
    return data.lockedMarket;
  }

  async resolveMarket(id: number, request: ResolveMarketRequest): Promise<void> {
    const response = await fetch(`${this.baseURL}/markets/resolvemarket/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(request),
    });

    await this.handleResponse(response);
  }

  async searchMarkets(title: string): Promise<Market[]> {
    const response = await fetch(`${this.baseURL}/markets/search?title=${encodeURIComponent(title)}`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ markets: Market[] }>(response);
    return data.markets;
  }

  // Betting Methods
  async placeBet(request: PlaceBetRequest): Promise<PlaceBetResponse> {
    const response = await fetch(`${this.baseURL}/bets/placebets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(request),
    });

    return this.handleResponse<PlaceBetResponse>(response);
  }

  async getAllBets(): Promise<Bet[]> {
    const response = await fetch(`${this.baseURL}/bets/getallbets`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ bets: Bet[] }>(response);
    return data.bets;
  }

  async getBetsForMarket(marketId: number): Promise<Bet[]> {
    const response = await fetch(`${this.baseURL}/bets/getallbetsmarket/${marketId}`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ bets: Bet[] }>(response);
    return data.bets;
  }

  // Transaction Methods
  async getAllTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${this.baseURL}/transactions/getalltransactions`, {
      headers: this.getAuthHeader(),
    });

    const data = await this.handleResponse<{ transactions: Transaction[] }>(response);
    return data.transactions;
  }
}

export const apiClient = new ApiClient();