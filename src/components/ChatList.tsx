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
// If getUserConversations is a default export:
import { getUserConversations } from "../services/message.service";
// Or, if the correct named export is different, e.g. 'fetchUserConversations':
// import { fetchUserConversations as getUserConversations } from "../services/message.service";
import type { Message } from "../models/Message";

type Props = {
  token: string;
  myUserId: string;
  onSelectConversation: (listingId: string, otherUserId: string) => void;
};

type Thread = {
  listingId: string;
  listingTitle: string;
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

    getUserConversations(token, myUserId)
      .then((conversations) => {
        if (mounted) {
          const threadMap = new Map<string, Thread>();
          conversations.forEach((conversation) => {
            const thread: Thread = {
              listingId: conversation.listingId,
              listingTitle: conversation.listingTitle,
              otherUser: Array.isArray(conversation.otherUser)
                ? conversation.otherUser.find((u: any) => u.id !== myUserId) ||
                  conversation.otherUser[0]
                : conversation.otherUser,
              lastMessage: conversation.lastMessage,
              unreadCount: conversation.unreadCount,
            };
            threadMap.set(conversation.listingId, thread);
          });
          setThreads(Array.from(threadMap.values()));
        }
      })
      .catch((error) => {
        console.error("Error fetching conversations:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

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
            <Text style={styles.title}>{item.listingTitle}</Text>
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
