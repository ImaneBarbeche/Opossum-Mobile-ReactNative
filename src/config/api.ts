// URL de base de l'API (backend quand je suis en formation)
export const API_BASE_URL = 'http://192.168.1.225:8080/api/v1';

// // URL de base de l'API (backend quand je suis chez moi)
// export const API_BASE_URL = 'http://192.168.1.80:8080/api/v1';

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
  conversations: `${API_BASE_URL}/conversations`,
  contact: (listingId: string) => `${API_BASE_URL}/contact/${listingId}`,
  sendMessage: (conversationId: string) => `${API_BASE_URL}/conversations/${conversationId}/messages/send`,
  getMessages: (conversationId: string) => `${API_BASE_URL}/conversations/${conversationId}/messages`,
  deleteMessage: (messageId: string) => `${API_BASE_URL}/{messageId}/delete`,
  archiveMessage: (messageId: string) => `${API_BASE_URL}/${messageId}/archive`,
  reportMessage: (messageId: string) => `${API_BASE_URL}/${messageId}/report`,
  listingMessages: `${API_BASE_URL}/listings/messages`,
  listingConversations: (listingId: string) => `${API_BASE_URL}/listings/${listingId}/conversations`,
  markAsRead: (conversationId: string) => `${API_BASE_URL}/conversations/${conversationId}/read`,
};