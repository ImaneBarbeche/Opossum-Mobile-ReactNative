import { AUTH_ENDPOINTS } from '../config/api'; // pour auth.service.ts
import { handleNetworkError } from '../utils/networkErrorHandler';
// Service pour l'authentification
import { User } from "../models/User";
import { AuthResponse, LoginRequest, RegisterRequest, RegisterResponse } from "../models/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getValidAccessToken } from './token.helper';
import { mockUsers } from "./mockApi";

const USE_MOCK = false; // Passe à false pour utiliser le backend réel

// Fonction pour réinitialiser le mot de passe avec un token
export async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.resetPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      // On lit le message d'erreur du backend si présent
      const errorMsg =
        (result && typeof result === 'object' && 'error' in result && result.error && typeof result.error === 'object' && 'message' in result.error ? result.error.message : undefined) ||
        (result && typeof result === 'object' && 'message' in result ? result.message : undefined) ||
        text ||
        "Erreur lors de la réinitialisation du mot de passe";
      throw new Error(String(errorMsg));
    }
    if (!(result && typeof result === 'object' && 'success' in result && result.success)) {
      const errorMsg =
        (result && typeof result === 'object' && 'error' in result && result.error && typeof result.error === 'object' && 'message' in result.error ? result.error.message : undefined) ||
        (result && typeof result === 'object' && 'message' in result ? result.message : undefined) ||
        text ||
        "Erreur lors de la réinitialisation du mot de passe";
      throw new Error(String(errorMsg));
    }
    const message = (result && typeof result === 'object' && 'message' in result ? String(result.message) : undefined) || "Mot de passe réinitialisé";
    return { success: true, message };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}
// Fonction pour demander la réinitialisation du mot de passe
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.forgotPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        (result && typeof result === 'object' && 'error' in result && result.error && typeof result.error === 'object' && 'message' in result.error ? result.error.message : undefined) ||
        (result && typeof result === 'object' && 'message' in result ? result.message : undefined) ||
        "Erreur lors de la demande de réinitialisation";
      throw new Error(String(errorMsg));
    }
    const message = (result && typeof result === 'object' && 'message' in result ? String(result.message) : undefined) || "Demande envoyée";
    return { success: true, message };
  } catch (error) {
    handleNetworkError(error);
    throw error;
  }
}
// Fonction d'inscription mockée ou réelle
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await fetch(AUTH_ENDPOINTS.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // On récupère la réponse JSON
    const result = await response.json();
    console.log('Réponse backend login:', result);

    // Si la réponse n'est pas OK, on lève une erreur avec le message de l'API
    if (!response.ok) {
      // Gestion des erreurs de validation ou serveur
      const errorMsg =
        result?.error?.message ||
        result?.message ||
        "Erreur lors de l'inscription";
      throw new Error(errorMsg);
    }

    // Retourne uniquement l'utilisateur créé et le message de confirmation
    // Stocke les tokens dans AsyncStorage comme pour le login
    if (result.accessToken) {
      await AsyncStorage.setItem("access_token", result.accessToken);
    }
    if (result.refreshToken) {
      await AsyncStorage.setItem("refresh_token", result.refreshToken);
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
      message: "Inscription réussie",
    };
  } catch (error) {
    console.log('Erreur réseau lors de register:', error);
    handleNetworkError(error);
    throw error;
  }
}
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
  if (USE_MOCK) {
    // En mock, on supprime simplement les tokens du stockage local
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
    return { message: "Déconnexion réussie (mock)" };
  } else {
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
}