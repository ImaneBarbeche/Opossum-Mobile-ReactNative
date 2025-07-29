import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { componentStyles, colors, spacing, typography } from "../../theme";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { Message } from "../../models/Message";

type RouteParams = {
  listingId: string;
  titre: string;
};

type ListingConversationScreenProps = {
  token: string;
  myUserId: string;
  useMock?: boolean;
  navigation?: any;
  route?: any;
};

// MOCK DATA : messages pour chaque annonce
const MOCK_MESSAGES: { [key: string]: Message[] } = {
  "1": [
    {
      messageId: "1",
      conversationId: "c1",
      listingId: "1",
      senderId: "99",
      receiverId: "101",
      content: "Bonjour, le vélo est toujours dispo ?",
      sentAt: "2025-07-24 09:00",
      isRead: true,
      status: "ACTIVE",
      createdAt: "2025-07-24 09:00",
      updatedAt: "2025-07-24 09:00",
    },
    {
      messageId: "2",
      conversationId: "c1",
      listingId: "1",
      senderId: "101",
      receiverId: "99",
      content: "Oui, bien sûr !",
      sentAt: "2025-07-24 09:05",
      isRead: true,
      status: "ACTIVE",
      createdAt: "2025-07-24 09:05",
      updatedAt: "2025-07-24 09:05",
    },
  ],
  "2": [
    {
      messageId: "3",
      conversationId: "c2",
      listingId: "2",
      senderId: "99",
      receiverId: "202",
      content: "L'appart est libre le week-end ?",
      sentAt: "2025-07-24 10:00",
      isRead: true,
      status: "ACTIVE",
      createdAt: "2025-07-24 10:00",
      updatedAt: "2025-07-24 10:00",
    },
    {
      messageId: "4",
      conversationId: "c2",
      listingId: "2",
      senderId: "202",
      receiverId: "99",
      content: "Oui, dispo samedi et dimanche.",
      sentAt: "2025-07-24 10:05",
      isRead: true,
      status: "ACTIVE",
      createdAt: "2025-07-24 10:05",
      updatedAt: "2025-07-24 10:05",
    },
  ],
};

export default function ListingConversationScreen({
  token,
  myUserId,
  useMock = true,
  navigation,
  route,
}: ListingConversationScreenProps) {
  const routeParams =
    route?.params ??
    useRoute<RouteProp<{ params: RouteParams }, "params">>().params;
  const { listingId, titre } = routeParams;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMock) {
      setTimeout(() => {
        setMessages(MOCK_MESSAGES[listingId] || []);
        setLoading(false);
      }, 500);
    } else {
      fetch(`http://localhost:8080/api/listings/${listingId}/conversation`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          // On filtre côté front les messages supprimés (status !== "ACTIVE")
          setMessages(
            (data as Message[]).filter((msg) => msg.status === "ACTIVE")
          );
          setLoading(false);
        });
    }
  }, [listingId, useMock, token]);

  if (loading)
    return (
      <View
        style={[
          componentStyles.container,
          { backgroundColor: colors.lightGray, paddingTop: 64 },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 32 }}
        />
      </View>
    );

  return (
    <View
      style={[
        componentStyles.container,
        { backgroundColor: colors.lightGray, paddingTop: 64 },
      ]}
    >
      <Text
        style={[
          typography.h1,
          {
            color: colors.primary,
            marginBottom: spacing.md,
            alignSelf: "center",
          },
        ]}
      >
        Conversations pour : {titre}
      </Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.messageId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              componentStyles.card,
              {
                padding: 10,
                marginBottom: 16,
                flexDirection: "column",
                backgroundColor:
                  item.senderId === myUserId ? "#DFF6E0" : "#FDF6E3",
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={[typography.h3, { color: colors.black, flex: 1 }]}>
                {item.senderId === myUserId ? "Moi" : "Propriétaire"}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {
                    fontWeight: "bold",
                    color:
                      item.senderId === myUserId
                        ? colors.success
                        : colors.primary,
                    marginBottom: 2,
                  },
                ]}
              >
                {item.content}
              </Text>
              <Text
                style={[
                  typography.body,
                  { color: colors.darkGray, marginBottom: 8 },
                ]}
              >
                {item.sentAt}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 32 }}>
            Aucun message trouvé.
          </Text>
        }
      />
    </View>
  );
}
