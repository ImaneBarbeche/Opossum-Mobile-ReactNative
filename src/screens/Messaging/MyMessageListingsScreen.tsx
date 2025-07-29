import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { componentStyles, colors, spacing, typography } from "../../theme";
import type { Conversation } from "../../models/Conversation";
import { getMyMessageListings } from "../../services/message.service";

type MyMessageListingsScreenProps = {
  token: string;
  myUserId: string;
  navigation?: any;
  route?: any;
};

export default function MyMessageListingsScreen({
  token,
  myUserId,
  navigation,
}: MyMessageListingsScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(
    async (isRefresh = false) => {
      if (!token) {
        setError("Token manquant");
        setLoading(false);
        return;
      }

      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data = await getMyMessageListings(token, myUserId);
        setConversations(data);
      } catch (err: any) {
        console.error("Error fetching conversations:", err);
        setError(err.message || "Erreur lors du chargement des conversations");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, myUserId]
  );

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const onRefresh = useCallback(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  const retryLoad = useCallback(() => {
    setError(null);
    fetchConversations();
  }, [fetchConversations]);

  if (loading && !refreshing) {
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
          Liste de mes annonces avec discussions
        </Text>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 32 }}
        />
      </View>
    );
  }

  if (error && !refreshing) {
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
          Liste de mes annonces avec discussions
        </Text>
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text
            style={{
              color: colors.error,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={retryLoad}
            style={{
              borderRadius: 8,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: colors.white, fontWeight: "bold" }}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        Liste de mes annonces avec discussions
      </Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.conversationId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate("ConversationScreen", {
                conversationId: item.conversationId,
                listingTitle: item.listingTitle,
                listingId: item.listingId,
              })
            }
            style={[
              componentStyles.card,
              {
                padding: 16,
                marginBottom: 12,
                flexDirection: "column",
                backgroundColor: colors.white,
                borderLeftWidth: 4,
                borderLeftColor:
                  item.unreadCount > 0 ? colors.primary : colors.lightGray,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  typography.h3,
                  { color: colors.black, marginBottom: 8 },
                ]}
              >
                {item.listingTitle}
              </Text>

              {item.lastMessage && (
                <Text
                  style={[
                    typography.body,
                    {
                      color: colors.darkGray,
                      marginBottom: 8,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.lastMessage.content || "Aucun message"}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {item.unreadCount > 0 && (
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {item.unreadCount} nouveau
                      {item.unreadCount > 1 ? "x" : ""}
                    </Text>
                  </View>
                )}

                {item.lastMessage?.sentAt && (
                  <Text
                    style={[typography.caption, { color: colors.mediumGray }]}
                  >
                    {new Date(item.lastMessage.sentAt).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 32 }}>
            <Text
              style={{
                textAlign: "center",
                color: colors.darkGray,
                fontSize: 16,
              }}
            >
              Aucune conversation trouvée
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: colors.mediumGray,
                marginTop: 8,
              }}
            >
              Les conversations apparaîtront ici quand vous recevrez des
              messages sur vos annonces
            </Text>
          </View>
        }
      />
    </View>
  );
}
