import { AUTH_ENDPOINTS } from '../config/api';
import { handleNetworkError } from '../utils/networkErrorHandler';

// Réinitialisation du mot de passe avec un token
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.resetPassword, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    let result = {};
    let text = '';
    try {
      text = await response.text();
      result = text ? JSON.parse(text) : {};
    } catch (e) {
      result = {};
    }
    if (!response.ok) {
      const errorMsg =
        (result && typeof result === 'object' && 'error' in result && result.error && typeof result.error === 'object' && 'message' in result.error
          ? result.error.message
          : undefined) ||
        (result && typeof result === 'object' && 'message' in result ? result.message : undefined) ||
        text ||
        'Erreur lors de la réinitialisation du mot de passe';
      throw new Error(String(errorMsg));
    }
    if (!(result && typeof result === 'object' && 'success' in result && result.success)) {
      const errorMsg =
        (result && typeof result === 'object' && 'error' in result && result.error && typeof result.error === 'object' && 'message' in result.error
          ? result.error.message
          : undefined) ||
        (result && typeof result === 'object' && 'message' in result ? result.message : undefined) ||
        text ||
        'Erreur lors de la réinitialisation du mot de passe';
      throw new Error(String(errorMsg));
    }
    const message =
      (result && typeof result === 'object' && 'message' in result ? String(result.message) : undefined) ||
      'Mot de passe réinitialisé';
    return { success: true, message };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}

// Demande de réinitialisation du mot de passe
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.forgotPassword, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    let result = {};
    try {
      const text = await response.text();
      result = text ? JSON.parse(text) : {};
    } catch (e) {
      result = {};
    }
    if (!response.ok || !(result && typeof result === 'object' && 'success' in result && result.success)) {
      const errorMsg =
        (result && typeof result === 'object' && 'error' in result && result.error && typeof result.error === 'object' && 'message' in result.error
          ? result.error.message
          : undefined) ||
        (result && typeof result === 'object' && 'message' in result ? result.message : undefined) ||
        'Erreur lors de la demande de réinitialisation';
      throw new Error(String(errorMsg));
    }
    const message =
      (result && typeof result === 'object' && 'message' in result ? String(result.message) : undefined) ||
      'Demande envoyée';
    return { success: true, message };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}
