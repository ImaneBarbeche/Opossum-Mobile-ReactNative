import { AUTH_ENDPOINTS } from '../config/api'; // pour auth.service.ts
import { handleNetworkError } from '../utils/networkErrorHandler';
// Service pour l'authentification
import { User } from "../models/User";
import { AuthResponse, LoginRequest } from "../models/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getValidAccessToken } from './token.helper';


// Fonction login mockée ou réelle
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    // Appel au backend réel
    const response = await fetch(AUTH_ENDPOINTS.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('Réponse backend login:', result);

    if (!response.ok) {
      const errorMsg =
        result?.error?.message ||
        result?.message ||
        "Erreur lors de la connexion";
      throw new Error(errorMsg);
    }

    // Adaptation : si le backend ne retourne pas la structure attendue, adapte ici
    // Correction : si le backend retourne directement les infos user à la racine
    let userData = result.data?.user || result.user;
    if (!userData && result.email) {
      userData = {
        id: result.id,
        email: result.email,
        isEmailVerified: result.isEmailVerified ?? true,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
      };
    }
    const tokens = result.data?.tokens || {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
    };

    await AsyncStorage.setItem("access_token", tokens.accessToken);
    await AsyncStorage.setItem("refresh_token", tokens.refreshToken);
    // Stocke la date d'expiration réelle si fournie
    if (tokens.expiresIn) {
      const expiresAt = (Date.now() + tokens.expiresIn * 1000).toString();
      await AsyncStorage.setItem('access_token_expires_at', expiresAt);
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
        role: userData.role?.toLowerCase() || "user",
        createdAt: new Date(result.timestamp),
        updatedAt: new Date(result.timestamp),
      },
    };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}
// Fonction de déconnexion mockée ou réelle
export async function logout(): Promise<{ message: string }> {
  try {
    // En backend réel, on récupère le refreshToken et accessToken
    const refreshToken = await AsyncStorage.getItem("refresh_token");
    const accessToken = await getValidAccessToken();

    const response = await fetch(AUTH_ENDPOINTS.logout, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    let result = {};
    try {
      const text = await response.text();
      result = text ? JSON.parse(text) : {};
    } catch (e) {
      // Si le backend ne retourne pas de JSON, on ignore l'erreur de parsing
      result = {};
    }

    // On supprime les tokens du stockage local, même si le backend échoue
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("access_token_expires_at");

    // Si la suppression du compte a eu lieu, le backend peut retourner une erreur sur logout (token révoqué ou user supprimé)
    // On ignore l'erreur et on considère la déconnexion comme réussie
    if (!response.ok) {
      return { message: "Déconnexion réussie" };
    }
    // Si le backend ne retourne pas de message, on considère la déconnexion comme réussie
    const message = (result && typeof result === 'object' && 'message' in result ? String(result.message) : undefined) || "Déconnexion réussie";
    return { message };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.refresh, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      const errorMsg = result?.error?.message || result?.message || 'Erreur lors du rafraîchissement du token';
      throw new Error(errorMsg);
    }
    // Stocke les nouveaux tokens si besoin
    if (result.data?.accessToken) {
      await AsyncStorage.setItem('access_token', result.data.accessToken);
    }
    if (result.data?.refreshToken) {
      await AsyncStorage.setItem('refresh_token', result.data.refreshToken);
    }
    if (result.data?.expiresIn) {
      const expiresAt = (Date.now() + result.data.expiresIn * 1000).toString();
      await AsyncStorage.setItem('access_token_expires_at', expiresAt);
    }
    return {
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
      expiresIn: result.data.expiresIn,
    };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}
