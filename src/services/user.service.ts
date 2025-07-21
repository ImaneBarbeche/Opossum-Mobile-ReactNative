// Récupère un profil utilisateur (privé ou public)
export const getUserProfile = async (id: string, token?: string) => {
  // id = 'me' pour profil privé, sinon UUID pour public
  const url = `${USER_ENDPOINTS.me.replace('/me', '')}/${id}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { method: 'GET', headers });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result?.error?.message || 'Erreur lors de la récupération du profil');
  return result.data;
};
// Service pour la gestion des utilisateurs
// Récupère le profil utilisateur connecté
import { User } from '../models/User';
import { USER_ENDPOINTS } from '../config/api';
import { handleNetworkError } from '../utils/networkErrorHandler';
import axios from 'axios';
import { UserUpdateRequest } from '../models/User';

// Vérification de l'email utilisateur
export const verifyUserEmail = async (token: string) => {
  try {
    const url = USER_ENDPOINTS.verifyEmail(token);
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    handleNetworkError(error);
  }
};
// Suppression du compte utilisateur
export const deleteUserAccount = async (
  password: string,
  token: string
) => {
  try {
    const response = await axios.request({
      url: USER_ENDPOINTS.delete,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        password,
        confirmDeletion: true,
      },
    });
    return response.data;
  } catch (error: any) {
    handleNetworkError(error);
  }
};
// Changement de mot de passe utilisateur
// Changement de mot de passe utilisateur (nouvelle spec)
export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  try {
    const response = await fetch(USER_ENDPOINTS.editPassword, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result?.error?.message || 'Erreur lors du changement de mot de passe');
    }
    return result;
  } catch (error: any) {
    handleNetworkError(error);
    throw error;
  }
};

export const fetchCurrentUserProfile = async (token: string): Promise<User | null> => {
  const response = await fetch(USER_ENDPOINTS.me, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!data || typeof data !== 'object') return null;
  // Adaptation stricte au modèle User
  return {
    id: data.id,
    email: data.email,
    isEmailVerified: data.isEmailVerified ?? true,
    firstName: data.firstName,
    lastName: data.lastName,
    isActive: data.isActive ?? true,
    role: data.role?.toLowerCase?.() || 'user',
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    phone: data.phone,
    avatar: data.avatar,
    lastLoginAt: data.lastLoginAt ? new Date(data.lastLoginAt) : undefined,
  };
};

export const updateUserProfile = async (data: UserUpdateRequest, token: string) => {
  try {
    const response = await axios.put(USER_ENDPOINTS.editProfile, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    handleNetworkError(error);
  }
};
