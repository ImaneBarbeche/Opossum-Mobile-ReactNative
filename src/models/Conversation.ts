import { Message } from "./Message";
import { User } from "./User";

// Interface pour la compatibilité avec l'ancien code
export interface Conversation {
  conversationId: string;
  listingId: string;
  listingTitle: string;
  otherUser: User[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationSummary {
  conversationId: string; // UUID
  listingId: string; // UUID
  otherUserId: string; // UUID
  otherUserName: string;
  lastMessagePreview: string;
  lastActivityAt: string; // ISO string
  unreadCount: number;
}

export interface AnnouncementWithConversation {
  listingId: string; // UUID
  listingTitle: string;
  conversationCount: number;
}

export interface ConversationMessagesResponse {
  conversationInfo: ConversationSummary;
  messages: Message[];
  totalElements: number;
  totalPages: number;
}