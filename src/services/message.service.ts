import { MESSAGE_ENDPOINTS } from "../config/api";
import type { Message } from "../models/Message";
import type { Conversation } from "../models/Conversation";

/**
 * Récupère toutes les conversations de l'utilisateur
 */
export async function getUserConversations(
  token: string,
  myUserId: string
): Promise<Conversation[]> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.conversations, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Vérifier la structure de la réponse
    if (Array.isArray(data)) {
      return data;
    } else if (data.conversations && Array.isArray(data.conversations)) {
      return data.conversations;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Structure de réponse inattendue pour getUserConversations:', data);
      return [];
    }
  } catch (error) {
    console.error('Erreur dans getUserConversations:', error);
    throw error;
  }
}

/**
 * Envoie un premier message (ouvrir une conversation)
 */
export async function contactListingOwner(
  token: string,
  listingId: string,
  content: string
): Promise<Message> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.contact(listingId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur dans contactListingOwner:', error);
    throw error;
  }
}

/**
 * Envoie un message dans une conversation
 */
export async function sendMessage(
  token: string,
  conversationId: string,
  content: string
): Promise<Message> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.sendMessage(conversationId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur dans sendMessage:', error);
    throw error;
  }
}

/**
 * Liste paginée des annonces où l'utilisateur a des conversations (niveau 1)
 */
export async function getMyMessageListings(
  token: string,
  myUserId: string,
  page: number = 1,
  limit: number = 10
): Promise<Conversation[]> {
  try {
    console.log('Calling API:', `${MESSAGE_ENDPOINTS.listingMessages}?page=${page}&limit=${limit}`);
    
    const response = await fetch(`${MESSAGE_ENDPOINTS.listingMessages}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Gérer différentes structures de réponse possible
    let listings = [];
    
    if (Array.isArray(data)) {
      // Si la réponse est directement un tableau
      listings = data;
    } else if (data.listings && Array.isArray(data.listings)) {
      // Si la réponse a une propriété 'listings'
      listings = data.listings;
    } else if (data.data && Array.isArray(data.data)) {
      // Si la réponse a une propriété 'data'
      listings = data.data;
    } else if (data.content && Array.isArray(data.content)) {
      // Si la réponse a une propriété 'content'
      listings = data.content;
    } else {
      console.warn('Structure de réponse inattendue:', data);
      return []; // Retourner un tableau vide
    }
    
    // Transformer les données pour correspondre au modèle Conversation
    return listings.map((listing: any) => ({
      conversationId: listing.conversationId || listing.listingId || listing.id || `conv_${Date.now()}_${Math.random()}`,
      listingId: listing.listingId || listing.id,
      listingTitle: listing.listingTitle || listing.title || 'Titre non disponible',
      otherUser: listing.otherUser || listing.participants || [],
      lastMessage: listing.lastMessage || {
        id: '',
        content: 'Aucun message',
        senderId: '',
        sentAt: new Date().toISOString(),
        status: 'ACTIVE' as const
      },
      unreadCount: listing.unreadCount || 0,
    }));
    
  } catch (error) {
    console.error('Erreur dans getMyMessageListings:', error);
    throw new Error("Erreur lors de la récupération des annonces avec messages");
  }
}

/**
 * Liste paginée des conversations dans une annonce sélectionnée (niveau 2)
 */
export async function getListingConversations(
  token: string,
  listingId: string,
  page: number = 1,
  limit: number = 10
): Promise<Conversation[]> {
  try {
    const response = await fetch(`${MESSAGE_ENDPOINTS.listingConversations(listingId)}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Vérifier la structure de la réponse
    if (Array.isArray(data)) {
      return data;
    } else if (data.conversations && Array.isArray(data.conversations)) {
      return data.conversations;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.content && Array.isArray(data.content)) {
      return data.content;
    } else {
      console.warn('Structure de réponse inattendue pour getListingConversations:', data);
      return [];
    }
  } catch (error) {
    console.error('Erreur dans getListingConversations:', error);
    throw new Error("Erreur lors de la récupération des conversations");
  }
}

/**
 * Afficher les messages d'une conversation sélectionnée
 */
export async function getConversationMessages(
  token: string,
  conversationId: string
): Promise<Message[]> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.getMessages(conversationId), {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Vérifier la structure de la réponse
    if (Array.isArray(data)) {
      return data;
    } else if (data.messages && Array.isArray(data.messages)) {
      return data.messages;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('Structure de réponse inattendue pour getConversationMessages:', data);
      return [];
    }
  } catch (error) {
    console.error('Erreur dans getConversationMessages:', error);
    throw new Error("Erreur lors de la récupération des messages");
  }
}

/**
 * Marquer tous les messages non lus comme lus dans une conversation
 */
export async function markAllMessagesAsRead(
  token: string,
  conversationId: string
): Promise<void> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.markAsRead(conversationId), {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur dans markAllMessagesAsRead:', error);
    throw new Error("Erreur lors du marquage des messages comme lus");
  }
}

/**
 * Marquer une conversation comme lue (alias pour ChatScreen)
 */
export async function markConversationAsRead(
  token: string, 
  listingId: string, 
  otherUserId?: string
): Promise<void> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.markAsRead(listingId), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ otherUserId }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur dans markConversationAsRead:', error);
    throw new Error("Erreur lors du marquage de la conversation comme lue");
  }
}

/**
 * Supprimer (soft) un message (seul l'expéditeur peut le faire dans les 24h)
 */
export async function deleteMessage(
  token: string,
  messageId: string
): Promise<void> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.deleteMessage(messageId), {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur dans deleteMessage:', error);
    throw new Error("Erreur lors de la suppression du message");
  }
}

/**
 * Archiver un message (optionnel si besoin)
 */
export async function archiveMessage(
  token: string,
  messageId: string
): Promise<void> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.archiveMessage(messageId), {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur dans archiveMessage:', error);
    throw new Error("Erreur lors de l'archivage du message");
  }
}

/**
 * Signaler un message
 */
export async function reportMessage(
  token: string,
  messageId: string,
  reason: string
): Promise<void> {
  try {
    const response = await fetch(MESSAGE_ENDPOINTS.reportMessage(messageId), {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      credentials: "include",
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Erreur dans reportMessage:', error);
    throw new Error("Erreur lors du signalement du message");
  }
}