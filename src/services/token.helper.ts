import { AUTH_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Vérifie et retourne un accessToken valide, rafraîchit si expiré.
 * Stocke le nouveau token si besoin.
 * @returns accessToken string ou null si non connecté
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await AsyncStorage.getItem('access_token');
  const refreshTokenValue = await AsyncStorage.getItem('refresh_token');
  // On suppose que la date d'expiration est stockée (timestamp en ms)
  const expiresAtStr = await AsyncStorage.getItem('access_token_expires_at');
  const now = Date.now();

  if (!accessToken || !refreshTokenValue) return null;
  
  if (expiresAtStr) {
    const expiresAt = parseInt(expiresAtStr, 10);
    if (now < expiresAt - 5000) {
      // Token encore valide (5s de marge)
      return accessToken;
    }
  }

  // Sinon, on tente de refresh
  try {
    const result = await refreshToken(refreshTokenValue);
    await AsyncStorage.setItem('access_token', result.accessToken);
    await AsyncStorage.setItem('refresh_token', result.refreshToken);
    // Stocke la nouvelle date d'expiration (en ms)
    const newExpiresAt = (now + result.expiresIn * 1000).toString();
    await AsyncStorage.setItem('access_token_expires_at', newExpiresAt);
    return result.accessToken;
  } catch (e) {
    // Si le refresh échoue, on considère l'utilisateur déconnecté
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('access_token_expires_at');
    return null;
  }
}
// Fonction pour rafraîchir le token d'accès avec un refresh token
export async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const response = await fetch(AUTH_ENDPOINTS.refresh, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const result = await response.json();
  if (!response.ok || !result.success) {
    const errorMsg =
      result?.error?.message ||
      result?.message ||
      "Erreur lors du rafraîchissement du token";
    throw new Error(errorMsg);
  }
  return {
    accessToken: result.data.accessToken,
    refreshToken: result.data.refreshToken,
    expiresIn: result.data.expiresIn,
  };
}