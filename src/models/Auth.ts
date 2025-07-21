// Interface TypeScript pour Auth

import { User } from "./User";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expiresIn?: number;
  timestamp?: string;
}
export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    isEmailVerified: boolean;
    firstName: string;
    lastName: string;
    role?: string;
  };
  access_token?: string;
  refresh_token?: string;
  expiresIn?: number;
  timestamp?: string;
  message: string;
}
export interface RefreshTokenRequest {
  refresh_token: string; // Juste le token à rafraîchir
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string; // Pour confirmer le mot de passe
  acceptTerms: boolean; // Acceptation des CGU
  phone?: string; // Optionnel à l'inscription ?
}

export interface ResetPasswordRequest {
  email: string; // Email pour envoyer le lien de réinitialisation
}

export interface VerifyEmailRequest {
  token: string; // Le token reçu par email
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}