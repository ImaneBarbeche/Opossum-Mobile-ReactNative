import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
export const API_BASE_URL = ENV_API_BASE_URL;


// Endpoints d'authentification
export const AUTH_ENDPOINTS = {
  refresh: `${API_BASE_URL}/auth/refresh`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
};

// Endpoints utilisateur
export const USER_ENDPOINTS = {
  verifyEmail: (token: string) => `${API_BASE_URL}/auth/verify-email/${encodeURIComponent(token)}`,
  delete: `${API_BASE_URL}/users/delete-profile`,
  editPassword: `${API_BASE_URL}/users/update-password`,
  editProfile: `${API_BASE_URL}/users/update-profile`,
  me: `${API_BASE_URL}/users/me`,
};

// Endpoints annonces
export const ANNOUNCE_ENDPOINTS = {
  myListings: `${API_BASE_URL}/listings/me`,
  allListings: `${API_BASE_URL}/listings/all`,
  listingDetailsById: (id: string) => `${API_BASE_URL}/listings/${id}`,
  create: `${API_BASE_URL}/listings/create`,
  update: (id: string) => `${API_BASE_URL}/listings/${id}/update`,
  delete: (id: string) => `${API_BASE_URL}/listings/${id}/delete`,
  search: `${API_BASE_URL}/listings/search`,
  filter: `${API_BASE_URL}/listings/filter`,
};

// Endpoints messaging
export const MESSAGE_ENDPOINTS = {
   listingsWithMessages: `${API_BASE_URL}/messages/listings/messages`, // Liste des annonces avec conversations
  contactOwner: (listingId: string) => `${API_BASE_URL}/messages/contact/${listingId}`, // Contacter propriétaire
  sendMessage: (conversationId: string) => `${API_BASE_URL}/messages/conversations/${conversationId}/messages/send`, // Envoyer message
  listingConversations: (listingId: string) => `${API_BASE_URL}/messages/listings/${listingId}/conversations`, // Conversations d'une annonce
  conversationMessages: (conversationId: string) => `${API_BASE_URL}/messages/conversations/${conversationId}/messages`, // Messages d'une conversation
  markAsRead: (conversationId: string) => `${API_BASE_URL}/messages/conversations/${conversationId}/read`, // Marquer comme lu
  deleteMessage: (messageId: string) => `${API_BASE_URL}/messages/${messageId}/delete`, // Supprimer message
  reportMessage: (messageId: string) => `${API_BASE_URL}/messages/${messageId}/report`, // Signaler message
  };