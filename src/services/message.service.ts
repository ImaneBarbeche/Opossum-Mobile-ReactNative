import { MESSAGE_ENDPOINTS } from "../config/api";
import type { 
  Message, 
  ContactOwnerRequest, 
  ContactOwnerResponse, 
  SendMessageRequest, 
  SendMessageResponse,
  DeleteMessageResponse,
  MarkReadResponse 
} from "../models/Message";
import type { 
  Conversation, 
  ConversationSummary, 
  AnnouncementWithConversation,
  ConversationMessagesResponse 
} from "../models/Conversation";

/**
 * 🎯 1. Liste des annonces avec conversations (MyMessageListingsScreen)
 * Backend: GET /api/v1/messages/listings/messages
 * Retourne: Page<AnnouncementWithConversationDto>
 */
export async function getMyMessageListings(
  token: string,
  myUserId: string,
  page: number = 0, // ✅ Backend Spring commence à 0
  size: number = 10, // ✅ Backend utilise "size" pas "limit"
  type?: string,
  status?: string,
  search?: string
): Promise<Conversation[]> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    
    const url = `${MESSAGE_ENDPOINTS.listingsWithMessages}?${params}`;
    console.log("🌐 getMyMessageListings - URL:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    console.log("📡 getMyMessageListings - Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ getMyMessageListings - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📦 getMyMessageListings - Réponse:", JSON.stringify(data, null, 2));
    
    // ✅ Backend retourne Page<AnnouncementWithConversationDto>
    const announcements: AnnouncementWithConversation[] = data.content || [];
    
    // Transformer en format Conversation pour compatibilité UI
    return announcements.map((announcement) => ({
      conversationId: `listing_${announcement.listingId}`,
      listingId: announcement.listingId,
      listingTitle: announcement.title,
      otherUser: [], // Pas disponible dans AnnouncementWithConversationDto
      lastMessage: null, // Pas disponible dans AnnouncementWithConversationDto
      unreadCount: announcement.conversationCount, // conversationCount comme proxy
    }));
    
  } catch (error) {
    console.error("💥 getMyMessageListings - Erreur:", error);
    throw new Error("Erreur lors de la récupération des annonces avec messages");
  }
}

/**
 * 🎯 2. Contacter propriétaire (créer conversation)
 * Backend: POST /api/v1/messages/contact/{listingId}
 * Body: ContactOwnerRequest { receiverId, content }
 * Retourne: ContactOwnerResponse { conversationId, firstMessage }
 */
export async function contactListingOwner(
  token: string,
  listingId: string,
  content: string,
  receiverId: string
): Promise<ContactOwnerResponse> {
  try {
    const requestBody: ContactOwnerRequest = {
      receiverId,
      content,
    };
    
    console.log("🌐 contactListingOwner - URL:", MESSAGE_ENDPOINTS.contactOwner(listingId));
    console.log("📤 contactListingOwner - Body:", requestBody);
    
    const response = await fetch(MESSAGE_ENDPOINTS.contactOwner(listingId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ contactListingOwner - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("✅ contactListingOwner - Succès:", result);
    return result;
  } catch (error) {
    console.error("💥 contactListingOwner - Erreur:", error);
    throw error;
  }
}

/**
 * 🎯 3. Envoyer message dans conversation existante
 * Backend: POST /api/v1/messages/conversations/{conversationId}/messages/send
 * Body: SendMessageRequest { toUserId, texte }
 * Retourne: SendMessageResponse
 */
export async function sendMessage(
  token: string,
  conversationId: string,
  content: string,
  toUserId: string
): Promise<SendMessageResponse> {
  try {
    const requestBody: SendMessageRequest = {
      toUserId,
      content,
    };
    
    console.log("🌐 sendMessage - URL:", MESSAGE_ENDPOINTS.sendMessage(conversationId));
    console.log("📤 sendMessage - Body:", requestBody);
    
    const response = await fetch(MESSAGE_ENDPOINTS.sendMessage(conversationId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ sendMessage - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("✅ sendMessage - Succès:", result);
    return result;
  } catch (error) {
    console.error("💥 sendMessage - Erreur:", error);
    throw error;
  }
}

/**
 * 🎯 4. Conversations d'une annonce (niveau 2)
 * Backend: GET /api/v1/messages/listings/{listingId}/conversations
 * Retourne: Page<ConversationSummaryDto>
 */
export async function getListingConversations(
  token: string,
  listingId: string,
  page: number = 0,
  size: number = 10
): Promise<ConversationSummary[]> {
  try {
    const url = `${MESSAGE_ENDPOINTS.listingConversations(listingId)}?page=${page}&size=${size}`;
    console.log("🌐 getListingConversations - URL:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ getListingConversations - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📦 getListingConversations - Réponse:", data);
    
    // ✅ Backend retourne Page<ConversationSummaryDto>
    return data.content || [];
    
  } catch (error) {
    console.error("💥 getListingConversations - Erreur:", error);
    throw new Error("Erreur lors de la récupération des conversations");
  }
}

/**
 * 🎯 5. Messages d'une conversation (niveau 3)
 * Backend: GET /api/v1/messages/conversations/{conversationId}/messages
 * Retourne: ConversationMessagesResponse
 */
export async function getConversationMessages(
  token: string,
  conversationId: string,
  page: number = 0,
  size: number = 20
): Promise<ConversationMessagesResponse> {
  try {
    const url = `${MESSAGE_ENDPOINTS.conversationMessages(conversationId)}?page=${page}&size=${size}`;
    console.log("🌐 getConversationMessages - URL:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ getConversationMessages - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("📦 getConversationMessages - Réponse:", result);
    
    // ✅ Backend retourne ConversationMessagesResponse directement
    return result;
    
  } catch (error) {
    console.error("💥 getConversationMessages - Erreur:", error);
    throw new Error("Erreur lors de la récupération des messages");
  }
}

/**
 * 🎯 6. Marquer conversation comme lue
 * Backend: PUT /api/v1/messages/conversations/{conversationId}/read
 * Retourne: MarkReadResponse
 */
export async function markConversationAsRead(
  token: string,
  conversationId: string
): Promise<MarkReadResponse> {
  try {
    console.log("🌐 markConversationAsRead - URL:", MESSAGE_ENDPOINTS.markAsRead(conversationId));
    
    const response = await fetch(MESSAGE_ENDPOINTS.markAsRead(conversationId), {
      method: "PUT", // ✅ Backend utilise PUT pas POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ markConversationAsRead - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("✅ markConversationAsRead - Succès:", result);
    return result;
  } catch (error) {
    console.error("💥 markConversationAsRead - Erreur:", error);
    throw new Error("Erreur lors du marquage de la conversation comme lue");
  }
}

/**
 * 🎯 7. Supprimer message
 * Backend: DELETE /api/v1/messages/{messageId}/delete
 * Retourne: DeleteMessageResponse
 */
export async function deleteMessage(
  token: string,
  messageId: string
): Promise<DeleteMessageResponse> {
  try {
    console.log("🌐 deleteMessage - URL:", MESSAGE_ENDPOINTS.deleteMessage(messageId));
    
    const response = await fetch(MESSAGE_ENDPOINTS.deleteMessage(messageId), {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ deleteMessage - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log("✅ deleteMessage - Succès:", result);
    return result;
  } catch (error) {
    console.error("💥 deleteMessage - Erreur:", error);
    throw new Error("Erreur lors de la suppression du message");
  }
}

/**
 * 🎯 8. Signaler message
 * Backend: POST /api/v1/messages/{messageId}/report
 * Retourne: void (ResponseEntity<Void>)
 */
export async function reportMessage(
  token: string,
  messageId: string,
  reason?: string
): Promise<void> {
  try {
    console.log("🌐 reportMessage - URL:", MESSAGE_ENDPOINTS.reportMessage(messageId));
    
    const response = await fetch(MESSAGE_ENDPOINTS.reportMessage(messageId), {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
      },
      credentials: "include",
      body: reason ? JSON.stringify({ reason }) : undefined,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ reportMessage - Erreur:", errorText);
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
    
    console.log("✅ reportMessage - Message signalé avec succès");
  } catch (error) {
    console.error("💥 reportMessage - Erreur:", error);
    throw new Error("Erreur lors du signalement du message");
  }
}
