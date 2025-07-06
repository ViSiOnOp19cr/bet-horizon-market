// Main header component with navigation and user info
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatBalance } from '@/lib/utils';

export const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-card border-b border-slate-700/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            PaisaPredict
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/markets" className="text-slate-300 hover:text-white transition-colors">
            Markets
          </Link>
          <Link to="/leaderboard" className="text-slate-300 hover:text-white transition-colors">
            Leaderboard
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-slate-400">Balance</p>
                <p className="font-semibold text-emerald-400">{formatBalance(user.balance)}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/profile" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};