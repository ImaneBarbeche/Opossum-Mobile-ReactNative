import * as authPassword from '../services/auth.password';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('auth.password service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset password successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, message: 'Mot de passe réinitialisé' }),
    });
    const res = await authPassword.resetPassword('token', 'newPassword');
    expect(res.success).toBe(true);
    expect(res.message).toBe('Mot de passe réinitialisé');
  });

  it('should handle reset password error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ error: { message: 'Token invalide' } }),
    });
    await expect(authPassword.resetPassword('badtoken', 'newPassword')).rejects.toThrow('Token invalide');
  });

  it('should request forgot password successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ success: true, message: 'Demande envoyée' }),
    });
    const res = await authPassword.forgotPassword('test@example.com');
    expect(res.success).toBe(true);
    expect(res.message).toBe('Demande envoyée');
  });

  it('should handle forgot password error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ error: { message: 'Email inconnu' } }),
    });
    await expect(authPassword.forgotPassword('unknown@example.com')).rejects.toThrow('Email inconnu');
  });
});