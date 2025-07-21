import { USER_ENDPOINTS } from '../config/api';
import { handleNetworkError } from '../utils/networkErrorHandler';


// Vérification de l'email utilisateur
export const verifyUserEmail = async (token: string) => {
  try {
    const response = await axios.get(USER_ENDPOINTS.verifyEmail, {
      params: { token },
    });
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
export const changeUserPassword = async (
  currentPassword: string,
  newPassword: string,
  token: string
) => {
  try {
    const response = await axios.put(
      USER_ENDPOINTS.editPassword,
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    handleNetworkError(error);
  }
};

// Service pour la gestion des utilisateurs
// Récupère le profil utilisateur connecté
export const fetchCurrentUserProfile = async (token: string) => {
  const response = await fetch(USER_ENDPOINTS.me, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};

import axios from 'axios';
import { UserUpdateRequest } from '../models/User';

export const updateUserProfile = async (data: UserUpdateRequest, token: string) => {
  try {
    if (!data.email) {
      throw new Error("L'email est obligatoire pour la modification du profil.");
    }
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
