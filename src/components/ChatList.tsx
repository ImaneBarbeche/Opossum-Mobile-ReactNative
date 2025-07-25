import React, { useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
// Service pour récupérer tous les messages de l'utilisateur
import { getUserMessages } from "./../services/message.service";

type Props = {
  token: string; // JWT de l'utilisateur connecté
  myUserId: string; // ID de l'utilisateur connecté
  onSelectConversation: (listingId: string, otherUserId: string) => void;
};

type Thread = {
  listingId: string;
  annonceTitle: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  lastMessage: {
    content: string;
    sentAt: string;
  };
  unreadCount: number;
};

// Ajout du type pour la réponse API
type GetUserMessagesResponse = {
  success: boolean;
  data: {
    messages: any[];
    // Ajoute d'autres propriétés si besoin
  };
};

export default function ChatList({
  token,
  myUserId,
  onSelectConversation,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getUserMessages(token, myUserId)
      .then((res) => {
        const response = res.data as GetUserMessagesResponse;
        if (mounted && response.success) {
          const messages = response.data.messages; // Liste plate de messages
          // Regroupe les messages par annonce et autre user
          const threadMap = new Map<string, Thread>();
          messages.forEach((msg) => {
            const otherId =
              msg.senderId === myUserId ? msg.receiverId : msg.senderId;
            const key = `${msg.listingId}-${otherId}`;
            const isUnread = !msg.isRead && msg.senderId !== myUserId;
            if (!threadMap.has(key)) {
              threadMap.set(key, {
                listingId: msg.listingId,
                annonceTitle: msg.annonceTitle ?? "Annonce",
                otherUser: {
                  id: otherId,
                  firstName: msg.otherUserFirstName ?? "",
                  lastName: msg.otherUserLastName ?? "",
                  avatarUrl: msg.otherUserAvatarUrl,
                },
                lastMessage: {
                  content: msg.content,
                  sentAt: msg.sentAt,
                },
                unreadCount: isUnread ? 1 : 0,
              });
            } else {
              const thread = threadMap.get(key)!;
              // Met à jour le dernier message si celui-ci est plus récent
              if (new Date(msg.sentAt) > new Date(thread.lastMessage.sentAt)) {
                thread.lastMessage = {
                  content: msg.content,
                  sentAt: msg.sentAt,
                };
              }
              // Incrémente le compteur de non lus
              if (isUnread) {
                thread.unreadCount += 1;
              }
            }
          });
          setThreads(
            Array.from(threadMap.values()).sort(
              (a, b) =>
                new Date(b.lastMessage.sentAt).getTime() -
                new Date(a.lastMessage.sentAt).getTime()
            )
          );
        }
      })
      .catch(() => {
        /* gestion d'erreur simplifiée */
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token, myUserId]);

  if (loading) return <ActivityIndicator />;

  return (
    <FlatList
      data={threads}
      keyExtractor={(item) => `${item.listingId}_${item.otherUser.id}`}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            onSelectConversation(item.listingId, item.otherUser.id)
          }
        >
          <Image
            source={
              item.otherUser.avatarUrl
                ? { uri: item.otherUser.avatarUrl }
                : require("../../assets/images/avatar-placeholder.png")
            }
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{item.annonceTitle}</Text>
            <Text style={styles.user}>
              {item.otherUser.firstName} {item.otherUser.lastName}
            </Text>
            <Text style={styles.lastMsg} numberOfLines={1}>
              {item.lastMessage?.content}
            </Text>
          </View>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Aucune conversation</Text>}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEE",
    marginRight: 10,
  },
  info: { flex: 1 },
  title: { fontWeight: "bold", fontSize: 16 },
  user: { color: "#666" },
  lastMsg: { color: "#444", marginTop: 2 },
  unreadBadge: {
    backgroundColor: "#E33",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  unreadText: { color: "#FFF", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 30, color: "#AAA" },
});
