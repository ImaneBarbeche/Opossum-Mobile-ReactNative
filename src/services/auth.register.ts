import { AUTH_ENDPOINTS } from '../config/api';
import { handleNetworkError } from '../utils/networkErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest, RegisterResponse } from '../models/Auth';

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    // On s'assure d'envoyer tous les champs attendus par l'API
    const body = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      avatar: data.avatar,
      confirmPassword: data.confirmPassword,
      acceptTerms: data.acceptTerms,
    };
    const response = await fetch(AUTH_ENDPOINTS.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) {
      const errorMsg =
        result?.error?.message ||
        result?.message ||
        'Erreur lors de l\'inscription';
      throw new Error(errorMsg);
    }
    if (result.accessToken) {
      await AsyncStorage.setItem('access_token', result.accessToken);
    }
    if (result.refreshToken) {
      await AsyncStorage.setItem('refresh_token', result.refreshToken);
    }
    if (result.expiresIn) {
      const expiresAt = (Date.now() + result.expiresIn * 1000).toString();
      await AsyncStorage.setItem('access_token_expires_at', expiresAt);
    }
    return {
      user: {
        id: result.id,
        email: result.email,
        isEmailVerified: result.isEmailVerified,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
      },
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      expiresIn: result.expiresIn,
      timestamp: result.timestamp,
      message: 'Inscription réussie',
    };
  } catch (error) {
    console.log('Erreur réseau lors de register:', error);
    handleNetworkError(error);
    throw error;
  }
}
