// Service pour la gestion des messages

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/messages';

// Récupère tous les messages liés à l'utilisateur connecté
export async function getUserMessages(token: string, myUserId: string, page = 0, size = 100, sort = 'sentAt,desc') {
  // Nouvelle API : tous les messages reçus ou envoyés par l'utilisateur, avec info annonce et autre user
  return axios.get(`${BASE_URL}/user/${myUserId}/all?page=${page}&size=${size}&sort=${sort}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Récupère tous les messages d'une conversation annonce+user
export async function getConversationMessages(token: string, listingId: string, otherUserId: string, page = 0, size = 50, sort = 'sentAt,asc') {
  return axios.get(`${BASE_URL}/conversation/${listingId}/${otherUserId}?page=${page}&size=${size}&sort=${sort}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Envoie un premier message (contact annonce)
export async function contactListingOwner(token: string, listingId: string, content: string, includeContactInfo = false) {
  return axios.post(
    `${BASE_URL}/contact/${listingId}`,
    { content, includeContactInfo },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Envoie un message dans une conversation (suite)
export async function sendMessage(token: string, listingId: string, receiverId: string, content: string) {
  return axios.post(
    `${BASE_URL}`,
    { listingId, receiverId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Supprime un message (dans les 24h, si expéditeur)
export async function deleteMessage(token: string, messageId: string) {
  return axios.delete(`${BASE_URL}/${messageId}/delete`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Marque un message comme lu (seul destinataire)
export async function markMessageAsRead(token: string, messageId: string) {
  return axios.put(`${BASE_URL}/${messageId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// Marque toute la conversation comme lue
export async function markConversationAsRead(token: string, listingId: string, otherUserId: string) {
  return axios.put(`${BASE_URL}/conversation/${listingId}/${otherUserId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}