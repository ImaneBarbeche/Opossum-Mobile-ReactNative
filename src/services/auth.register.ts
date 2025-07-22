import { AUTH_ENDPOINTS } from '../config/api';
import { handleNetworkError } from '../utils/networkErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterRequest, RegisterResponse } from '../models/Auth';

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    // On s'assure d'envoyer uniquement les champs attendus par l'API backend
    const body: any = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    if (data.phone) body.phone = data.phone;
    if (data.avatar) body.avatar = data.avatar;
    // confirmPassword et acceptTerms ne sont pas envoyés si non attendus par l'API
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
      if (result.accessToken !== null && result.accessToken !== undefined) {
        await AsyncStorage.setItem('access_token', result.accessToken);
      }
    }
    if (result.refreshToken) {
      if (result.refreshToken !== null && result.refreshToken !== undefined) {
        await AsyncStorage.setItem('refresh_token', result.refreshToken);
      }
    }
    if (result.expiresIn) {
      const expiresAt = (Date.now() + result.expiresIn * 1000).toString();
      if (expiresAt !== null && expiresAt !== undefined) {
        await AsyncStorage.setItem('access_token_expires_at', expiresAt);
      }
    }
    return {
      user: {
        id: result.id,
        email: result.email,
        isEmailVerified: result.isEmailVerified,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
        phone: result.phone ?? "",
        avatar: result.avatar ?? "",
      },
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
      expiresIn: result.expiresIn,
      timestamp: result.timestamp,
      message: 'Inscription réussie',
    };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}

export default register;
