/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import AdminDashboard from './components/AdminDashboard';
import ClienteDashboard from './components/ClienteDashboard';
import LoginPage from './components/LoginPage';
import LoginPageCliente from './components/LoginPageCliente';
import { login, loginClient, type AuthUser } from './services/api';
import ChatbotWidget from './components/ChatbotWidget';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loginView, setLoginView] = React.useState<'worker' | 'client'>('worker');

  const handleLogin = async (dni: string, pass: string) => {
    try {
      const loggedUser = await login(dni, pass);
      setUser(loggedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleClientLogin = async (dni: string, pass: string) => {
    try {
      const loggedUser = await loginClient(dni, pass);
      setUser(loggedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Client login failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: AuthUser) => {
    setUser(updatedUser);
  };

  const renderContent = () => {
    if (!isAuthenticated || !user) {
      if (loginView === 'client') {
        return (
          <LoginPageCliente 
            onLogin={handleClientLogin} 
            onSwitchToWorker={() => setLoginView('worker')} 
          />
        );
      }
      return (
        <LoginPage 
          onLogin={handleLogin} 
          onSwitchToClient={() => setLoginView('client')} 
        />
      );
    }

    if (user.role === 'CLIENTE') {
      return <ClienteDashboard initialUser={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
    }

    return <AdminDashboard initialUser={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
  };

  return (
    <>
      {renderContent()}
      {isAuthenticated && user && user.role !== 'CLIENTE' && <ChatbotWidget />}
    </>
  );
}

