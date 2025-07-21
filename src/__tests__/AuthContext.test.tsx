import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';

jest.mock('../services/auth.service', () => ({
  login: jest.fn().mockResolvedValue({
    user: { id: '1', email: 'a@a.com', firstName: 'A', lastName: 'B', isActive: true, role: 'USER', createdAt: new Date(), updatedAt: new Date(), isEmailVerified: true, lastLoginAt: new Date(), phone: '', address: '', avatar: '' },
    access_token: 'token',
    refresh_token: 'refresh',
  }),
  logout: jest.fn().mockResolvedValue({ message: 'D\u00e9connexion r\u00e9ussie' }),
  register: jest.fn().mockResolvedValue({
    user: { id: '2', email: 'b@b.com', firstName: 'B', lastName: 'C', isActive: true, role: 'USER', createdAt: new Date(), updatedAt: new Date(), isEmailVerified: true, lastLoginAt: new Date(), phone: '', address: '', avatar: '' },
    access_token: 'token',
    refresh_token: 'refresh',
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue('token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

function TestComponent() {
  const { user, login, logout, register, isAuthenticated, setUser } = useAuth();
  return (
    <>
      <>{user ? user.email : 'no-user'}</>
      <>{isAuthenticated ? 'auth' : 'no-auth'}</>
      <>{typeof login === 'function' ? 'login-ok' : 'login-missing'}</>
      <>{typeof logout === 'function' ? 'logout-ok' : 'logout-missing'}</>
      <>{typeof register === 'function' ? 'register-ok' : 'register-missing'}</>
      <>{typeof setUser === 'function' ? 'setUser-ok' : 'setUser-missing'}</>
    </>
  );
}

describe('AuthContext', () => {
  it('should provide default values and allow login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('no-user')).toBeTruthy();
    expect(screen.getByText('no-auth')).toBeTruthy();
    expect(screen.getByText('login-ok')).toBeTruthy();
    expect(screen.getByText('logout-ok')).toBeTruthy();
    expect(screen.getByText('register-ok')).toBeTruthy();
    expect(screen.getByText('setUser-ok')).toBeTruthy();
    // Simule un login
    await act(async () => {
      const { login } = require('../context/AuthContext').useAuth();
      await login({ email: 'a@a.com', password: 'x' });
    });
  });

  it('should throw if useAuth is used outside provider', () => {
    const Broken = () => {
      useAuth();
      return null;
    };
    expect(() => render(<Broken />)).toThrow();
  });
});
