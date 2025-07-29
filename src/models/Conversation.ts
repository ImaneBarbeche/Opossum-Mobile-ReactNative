export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  sentAt: string;
  status: "ACTIVE" | "DELETED" | "ARCHIVED";
}

export interface Conversation {
  conversationId: string;
  listingId: string;
  listingTitle: string;
  otherUser: User[];
  lastMessage: Message | null;
  unreadCount: number;
}