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

type Message = {
  messageId: number;
  fromUserId: number;
  toUserId: number;
  texte: string;
  timestamp: string;
  isMe: boolean;
};

type RouteParams = {
  listingId: number;
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
const MOCK_MESSAGES: { [key: number]: Message[] } = {
  1: [
    {
      messageId: 1,
      fromUserId: 99,
      toUserId: 101,
      texte: "Bonjour, le vélo est toujours dispo ?",
      timestamp: "2025-07-24 09:00",
      isMe: true,
    },
    {
      messageId: 2,
      fromUserId: 101,
      toUserId: 99,
      texte: "Oui, bien sûr !",
      timestamp: "2025-07-24 09:05",
      isMe: false,
    },
  ],
  2: [
    {
      messageId: 3,
      fromUserId: 99,
      toUserId: 202,
      texte: "L'appart est libre le week-end ?",
      timestamp: "2025-07-24 10:00",
      isMe: true,
    },
    {
      messageId: 4,
      fromUserId: 202,
      toUserId: 99,
      texte: "Oui, dispo samedi et dimanche.",
      timestamp: "2025-07-24 10:05",
      isMe: false,
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
          setMessages(data);
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
        Conversation pour : {titre}
      </Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.messageId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              componentStyles.card,
              {
                padding: 10,
                marginBottom: 16,
                flexDirection: "column",
                backgroundColor: item.isMe ? "#DFF6E0" : "#FDF6E3",
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={[typography.h3, { color: colors.black, flex: 1 }]}>
                {item.isMe ? "Moi" : "Propriétaire"}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {
                    fontWeight: "bold",
                    color: item.isMe ? colors.success : colors.primary,
                    marginBottom: 2,
                  },
                ]}
              >
                {item.texte}
              </Text>
              <Text
                style={[
                  typography.body,
                  { color: colors.darkGray, marginBottom: 8 },
                ]}
              >
                {item.timestamp}
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
