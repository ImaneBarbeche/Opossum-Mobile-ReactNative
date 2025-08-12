import * as authService from '../services/auth.service';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

global.fetch = jest.fn();

describe('auth.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('decodeJWT should decode a valid token', () => {
    // Token JWT factice avec payload {"test":123}
    const payload = Buffer.from(JSON.stringify({ test: 123 })).toString('base64');
    const token = `header.${payload}.signature`;
    const result = authService["decodeJWT"](token);
    expect(result).toEqual({ test: 123 });
  });

  it('login should store tokens and return AuthResponse on success', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ data: { accessToken: 'tokenA', refreshToken: 'tokenR', expiresIn: 3600 } }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    const res = await authService.login({ email: 'test@test.com', password: '123456' });
    expect(res.access_token).toBe('tokenA');
    expect(res.refresh_token).toBe('tokenR');
    expect(res.expiresIn).toBe(3600);
  });

  it('login should throw error on failure', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: { message: 'Erreur' } }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    await expect(authService.login({ email: 'fail@test.com', password: 'bad' })).rejects.toThrow('Erreur');
  });

  it('logout should remove tokens and return message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify({ message: 'Bye' }) });
    const res = await authService.logout();
    expect(res.message).toBeDefined();
  });

  it('refreshAccessToken should store new tokens and return them', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ success: true, data: { accessToken: 'newA', refreshToken: 'newR', expiresIn: 1800 } }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);
    const res = await authService.refreshAccessToken('refreshToken');
    expect(res.accessToken).toBe('newA');
    expect(res.refreshToken).toBe('newR');
    expect(res.expiresIn).toBe(1800);
  });
});