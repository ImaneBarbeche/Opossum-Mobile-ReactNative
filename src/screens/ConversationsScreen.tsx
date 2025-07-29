import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { componentStyles, colors, spacing, typography } from "../theme";
import { RouteProp, useRoute } from "@react-navigation/native";
import type { Message } from "../models/Message";

type RouteParams = {
  conversationId: string;
  listingTitle?: string;
};

type ConversationScreenProps = {
  token: string;
  myUserId: string;
  useMock?: boolean;
  navigation?: any;
  route?: any;
};

const MOCK_MESSAGES: Message[] = [
  {
    messageId: "1",
    conversationId: "c1",
    listingId: "l1",
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
    listingId: "l1",
    senderId: "101",
    receiverId: "99",
    content: "Oui, bien sûr !",
    sentAt: "2025-07-24 09:05",
    isRead: true,
    status: "ACTIVE",
    createdAt: "2025-07-24 09:05",
    updatedAt: "2025-07-24 09:05",
  },
];

export default function ConversationScreen({
  token,
  myUserId,
  useMock = true,
  navigation,
  route,
}: ConversationScreenProps) {
  const routeParams =
    route?.params ??
    useRoute<RouteProp<{ params: RouteParams }, "params">>().params;
  const { conversationId, listingTitle } = routeParams;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useMock) {
      setTimeout(() => {
        setMessages(
          MOCK_MESSAGES.filter((m) => m.conversationId === conversationId)
        );
        setLoading(false);
      }, 500);
    } else {
      fetch(
        `http://localhost:8080/api/conversations/${conversationId}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setMessages(
            (data as Message[]).filter((msg) => msg.status === "ACTIVE")
          );
          setLoading(false);
        });
    }
  }, [conversationId, useMock, token]);

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
        Liste des annonces {listingTitle ? ` pour : ${listingTitle}` : ""}
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
                {item.senderId === myUserId ? "Moi" : "Autre"}
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
