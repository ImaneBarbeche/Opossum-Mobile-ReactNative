import { AUTH_ENDPOINTS } from '../config/api';
import { handleNetworkError } from '../utils/networkErrorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getValidAccessToken } from './token.helper';
import { AuthResponse, LoginRequest } from '../models/Auth';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      const errorMsg =
        result?.error?.message ||
        result?.message ||
        'Erreur lors de la connexion';
      throw new Error(errorMsg);
    }
    let userData = result.data?.user || result.user;
    if (!userData && result.email) {
      userData = {
        id: result.id,
        email: result.email,
        isEmailVerified: result.isEmailVerified ?? true,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
        status: result.status ?? "ACTIVE", // Ajout du status si manquant
      };
    }
    const tokens = result.data?.tokens || {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };
    await AsyncStorage.setItem('access_token', tokens.accessToken);
    if (tokens.refreshToken !== null && tokens.refreshToken !== undefined) {
      await AsyncStorage.setItem('refresh_token', tokens.refreshToken);
    }
    if (tokens.expiresIn) {
      const expiresAt = (Date.now() + tokens.expiresIn * 1000).toString();
      if (expiresAt !== null && expiresAt !== undefined) {
        await AsyncStorage.setItem('access_token_expires_at', expiresAt);
      }
    }
    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: userData.id,
        email: userData.email,
        isEmailVerified: userData.isEmailVerified ?? true,
        lastLoginAt: new Date(result.timestamp),
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: true,
        status: userData.status ?? "ACTIVE", // <-- Ajouté ici
        role: userData.role?.toLowerCase() || 'user',
        createdAt: new Date(result.timestamp),
        updatedAt: new Date(result.timestamp),
      },
    };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}

export async function logout(): Promise<{ message: string }> {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const accessToken = await getValidAccessToken();
    const response = await fetch(AUTH_ENDPOINTS.logout, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });
    let result = {};
    try {
      const text = await response.text();
      result = text ? JSON.parse(text) : {};
    } catch (e) {
      result = {};
    }
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('access_token_expires_at');
    if (!response.ok) {
      return { message: 'Déconnexion réussie' };
    }
    const message =
      (result && typeof result === 'object' && 'message' in result
        ? String(result.message)
        : undefined) || 'Déconnexion réussie';
    return { message };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}