// Import des modules React et des types nécessaires
import React, { createContext, useContext, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";
import { login, logout } from "../services/auth.service";
import register from "../services/auth.register";
import {
  AuthContextType,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../models/Auth";

/**
 * Type du contexte d'authentification
 * - user : l'utilisateur connecté (ou null si déconnecté)
 * - isAuthenticated : booléen indiquant si l'utilisateur est connecté
 * - loading : booléen pour indiquer si une action d'auth est en cours
 * - login/register/logout : fonctions pour gérer la session
 */

// Création du contexte d'authentification (valeur par défaut : undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider du contexte d'authentification
 * Permet d'encapsuler l'app et de fournir l'état/fonctions auth à tous les composants enfants
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // État local pour l'utilisateur connecté
  const [user, setUser] = useState<User | null>(null);
  // État pour indiquer si une action d'authentification est en cours
  const [loading, setLoading] = useState(false);
  // État pour le token JWT
  const [token, setToken] = useState<string | null>(null);

  // Debug: log user and token changes
  React.useEffect(() => {
  }, [user]);
  React.useEffect(() => {
  }, [token]);

  /**
   * Fonction login
   * Appelle le service login, met à jour l'utilisateur et l'état loading
   */
  const handleLogin = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const response: AuthResponse = await login(data);
      // On récupère le token depuis la réponse du service login
      const accessToken = response.access_token || response.accessToken;
      setToken(accessToken ?? null);
      let userProfile = null;
      if (accessToken) {
        try {
          // Import dynamique pour éviter les cycles
          const { getUserProfile } = await import("../services/user.service");
          const profile = await getUserProfile('me', accessToken);
          if (profile) userProfile = profile;
        } catch (err) {
        }
      }
      if (userProfile) {
        setUser(userProfile);
      } else {
        // fallback : on tente de setUser avec la réponse brute
        setUser(response.user ?? null);
      }
    } catch (e) {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction register
   * Appelle le service register, complète l'objet user pour matcher le type User
   */
  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response: RegisterResponse = await register(data);
      // Utilise strictement la réponse backend
      const userToSet = {
        ...response.user,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: response.user.firstName != null ? response.user.firstName : "",
        lastName: response.user.lastName != null ? response.user.lastName : "",
        avatar: response.user.avatar != null ? String(response.user.avatar) : "",
        phone: response.user.phone != null ? String(response.user.phone) : "",
      };
      setUser(userToSet);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction logout
   * Appelle le service logout et réinitialise l'utilisateur
   */
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      // Nettoie les tokens du stockage sécurisé
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      await AsyncStorage.removeItem("access_token_expires_at");
    } finally {
      setLoading(false);
    }
  };

  // Ajoute une fonction pour forcer l'état d'authentification (utile après inscription ou permission localisation)
  const setIsAuthenticated = (value: boolean) => {
    if (value) {
      // Simule un utilisateur connecté minimal (à adapter selon ton modèle User)
      const userToSet = {
        id: "temp",
        email: "",
        firstName: "",
        lastName: "",
        isActive: true,
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEmailVerified: false,
        lastLoginAt: new Date(),
        phone: "",
        address: "",
        avatar: "",
      };
      setUser(userToSet);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, token, login: handleLogin, register: handleRegister, logout: handleLogout, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personnalisé pour consommer le contexte d'authentification facilement
 * À utiliser dans les composants pour accéder à l'utilisateur et aux fonctions auth
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
