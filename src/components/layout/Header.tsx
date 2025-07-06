// Main header component with navigation and user info
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance / 100); // Convert cents to dollars
  };

  return (
    <header className="bg-card border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PredictionMarket
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/markets" 
            className="text-foreground hover:text-primary transition-smooth"
          >
            Markets
          </Link>
          <Link 
            to="/leaderboard" 
            className="text-foreground hover:text-primary transition-smooth"
          >
            Leaderboard
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-warning hover:text-warning/80 transition-smooth font-medium"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="font-semibold text-success">
                  {formatBalance(user.balance)}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600"
                asChild
              >
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-slate-600 hover:border-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};