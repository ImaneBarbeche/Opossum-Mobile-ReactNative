export interface Message {
  messageId: string; // UUID du backend
  content: string;
  senderId: string; // UUID du backend
  receiverId: string; // UUID du backend
  isFromMe: boolean;
  isRead: boolean;
  sentAt: string; // ISO string (Instant du backend)
  status: "ACTIVE" | "DELETED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

// DTOs pour les requêtes
export interface SendMessageRequest {
  toUserId: string; // UUID
  content: string;
}

export interface ContactOwnerRequest {
  receiverId: string; // UUID
  content: string;
}

// DTOs pour les réponses
export interface SendMessageResponse {
  message: Message;
  conversationId: string;
}

export interface ContactOwnerResponse {
  conversationId: string;
  firstMessage: Message;
}

export interface DeleteMessageResponse {
  status: "ACTIVE" | "DELETED" | "ARCHIVED";
  message: string;
}

export interface MarkReadResponse {
  messagesMarkedAsRead: number;
  info: string;
}

