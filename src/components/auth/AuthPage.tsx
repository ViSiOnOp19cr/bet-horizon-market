// Main authentication page component
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 bg-gradient-glow opacity-20" />
      <div className="relative z-10 w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitchToSignup={toggleMode} />
        ) : (
          <SignupForm onSwitchToLogin={toggleMode} />
        )}
      </div>
    </div>
  );
};