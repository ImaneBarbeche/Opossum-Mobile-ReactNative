import * as authRegister from '../services/auth.register';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock global fetch and AsyncStorage
const mockFetch = jest.fn();
global.fetch = mockFetch;
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe('auth.register service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'user1',
        email: 'test@example.com',
        isEmailVerified: true,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        phone: '0600000000',
        accessToken: 'token123',
        refreshToken: 'refresh123',
        expiresIn: 3600,
        timestamp: '2025-07-31T12:00:00Z',
      }),
    });
    const res = await authRegister.register({
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
      firstName: 'John',
      lastName: 'Doe',
      phone: '0600000000',
      acceptTerms: true,
    });
    expect(res.user.id).toBe('user1');
    expect(res.access_token).toBe('token123');
    expect(mockSetItem).toHaveBeenCalledWith('access_token', 'token123');
    expect(mockSetItem).toHaveBeenCalledWith('refresh_token', 'refresh123');
    expect(res.message).toBe('Inscription réussie');
  });

  it('should handle registration error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Email déjà utilisé' } }),
    });
    await expect(authRegister.register({
      email: 'used@example.com',
      password: 'password',
      confirmPassword: 'password',
      firstName: 'Jane',
      lastName: 'Doe',
      acceptTerms: true,
    })).rejects.toThrow('Email déjà utilisé');
  });
});