import * as authSession from '../services/auth.session';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../services/token.helper', () => ({
  getValidAccessToken: jest.fn().mockResolvedValue('accessToken123'),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from '../services/token.helper';

const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;


describe('auth.session service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          user: {
            id: 'user1',
            email: 'test@example.com',
            isEmailVerified: true,
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            status: 'ACTIVE',
          },
          tokens: {
            accessToken: 'token123',
            refreshToken: 'refresh123',
            expiresIn: 3600,
          },
        },
        timestamp: '2025-07-31T12:00:00Z',
      }),
    });
    const res = await authSession.login({ email: 'test@example.com', password: 'password' });
    expect(res.user.id).toBe('user1');
    expect(res.access_token).toBe('token123');
    expect(mockSetItem).toHaveBeenCalledWith('access_token', 'token123');
    expect(mockSetItem).toHaveBeenCalledWith('refresh_token', 'refresh123');
    expect(res.user.status).toBe('ACTIVE');
  });

  it('should handle login error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Email ou mot de passe incorrect' } }),
    });
    await expect(authSession.login({ email: 'bad@example.com', password: 'wrong' })).rejects.toThrow('Email ou mot de passe incorrect');
  });

  it('should logout successfully', async () => {
    mockGetItem.mockResolvedValueOnce('refresh123');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ message: 'Déconnexion réussie' }),
    });
    const res = await authSession.logout();
    expect(mockRemoveItem).toHaveBeenCalledWith('access_token');
    expect(mockRemoveItem).toHaveBeenCalledWith('refresh_token');
    expect(mockRemoveItem).toHaveBeenCalledWith('access_token_expires_at');
    expect(res.message).toBe('Déconnexion réussie');
  });
});