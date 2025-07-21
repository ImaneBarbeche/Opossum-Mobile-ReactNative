// Interface TypeScript pour User + les actions de gestion des utilisateurs
export interface User {
  id: string;
  email: string;
  isEmailVerified: boolean;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role?: string; // Updated to match backend response
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
  avatar?: string;
  lastLoginAt?: Date;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}
export interface DeleteAccountRequest {
  reason?: string; // Raison de la suppression, optionnelle
  password?: string; // Pour sécuriser la suppression ?

}
