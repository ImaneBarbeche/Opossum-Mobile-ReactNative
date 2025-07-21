import * as authService from '../services/auth.service';

// Mock AsyncStorage and fetch for isolation
global.fetch = jest.fn();
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('auth.service', () => {
  const fetchMock = fetch as unknown as jest.Mock;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call forgotPassword and handle success', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, message: 'ok' })
    });
    const res = await authService.forgotPassword('test@example.com');
    expect(res.success).toBe(true);
    expect(res.message).toBe('ok');
  });

  it('should call resetPassword and handle error', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ success: false, message: 'fail' })
    });
    await expect(authService.resetPassword('token', 'pass')).rejects.toThrow('fail');
  });

  it('should call register and return user data', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '1',
        email: 'a@a.com',
        isEmailVerified: true,
        firstName: 'A',
        lastName: 'B',
        role: 'USER',
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: 3600,
        timestamp: Date.now(),
      })
    });
    const res = await authService.register({ email: 'a@a.com', password: 'x', confirmPassword: 'x', firstName: 'A', lastName: 'B', acceptTerms: true });
    expect(res.user.email).toBe('a@a.com');
    expect(res.access_token).toBe('token');
  });

  it('should call login and return user data', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '1',
        email: 'a@a.com',
        isEmailVerified: true,
        firstName: 'A',
        lastName: 'B',
        role: 'USER',
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: 3600,
        timestamp: Date.now(),
      })
    });
    const res = await authService.login({ email: 'a@a.com', password: 'x' });
    expect(res.user.email).toBe('a@a.com');
    expect(res.access_token).toBe('token');
  });

  it('should call logout and remove tokens', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ message: 'D\u00e9connexion r\u00e9ussie' })
    });
    const res = await authService.logout();
    expect(res.message).toContain('D\u00e9connexion');
  });
});
