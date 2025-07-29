export type MessageStatus = "ACTIVE" | "DELETED" | "REPORTED" | "ARCHIVED";

export interface Message {
  messageId: string;              // UUID du message
  conversationId: string;         // UUID de la conversation
  listingId: string;              // UUID de l'annonce
  senderId: string;               // UUID de l'expéditeur
  receiverId: string;             // UUID du destinataire
  content: string;                // Corps du message
  isRead: boolean;                // Statut de lecture
  status: MessageStatus;          // Statut du message (enum)
  sentAt: string;                 // Date d'envoi (ISO string)
  createdAt: string;              // Date de création (ISO string)
  updatedAt: string;              // Dernière modification (ISO string)
  deletedAt?: string | null;      // Date de suppression (soft delete), optionnelle
  edited?: boolean;               // Indique si le message a été édité, optionnel
  reportCount?: number;           // Nombre de signalements, optionnel
}