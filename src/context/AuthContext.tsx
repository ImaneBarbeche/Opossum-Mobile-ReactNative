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

  React.useEffect(() => {}, [user]);
  React.useEffect(() => {}, [token]);

  /**
   * Fonction login
   * Appelle le service login, met à jour l'utilisateur et l'état loading
   * Bloque l'accès si l'utilisateur n'est pas ACTIF
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
          const profile = await getUserProfile("me", accessToken);
          if (profile) userProfile = profile;
        } catch (err) {}
      }
      // Vérifie le statut utilisateur (ACTIVE uniquement)
      const effectiveUser = userProfile ?? response.user ?? null;
      if (effectiveUser) {
        if (effectiveUser.status && effectiveUser.status !== "ACTIVE") {
          // Si BLOCKED ou DELETED : refuse la connexion
          setUser(null);
          setToken(null);
          throw new Error(
            effectiveUser.status === "BLOCKED"
              ? "Votre compte est bloqué."
              : "Ce compte a été supprimé."
          );
        } else {
          setUser({
            ...effectiveUser,
            status: "ACTIVE",
          });
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
      setToken(null);
      // Optionnel: gérer le retour d'erreur pour affichage UI
      // (ex: setError(e.message) dans un state additionnel)
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fonction register
   * Appelle le service register, complète l'objet user pour matcher le type User
   * (Par défaut, nouveau user est ACTIVE)
   */
  const handleRegister = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      const response: RegisterResponse = await register(data);
      // Utilise strictement la réponse backend
      const userToSet: User = {
        ...response.user,
        status: "ACTIVE",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName:
          response.user.firstName != null ? response.user.firstName : "",
        lastName: response.user.lastName != null ? response.user.lastName : "",
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
      const userToSet: User = {
        id: "temp",
        email: "",
        firstName: "",
        lastName: "",
        isActive: true,
        status: "ACTIVE",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
        isEmailVerified: false,
        lastLoginAt: new Date(),
        phone: "",
        avatar: "",
      };
      setUser(userToSet);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.status === "ACTIVE",
        loading,
        token,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        setIsAuthenticated,
        setUser,
      }}
    >
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
