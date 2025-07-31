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
import { User } from "../../models/User";

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
      console.log("=== DEBUT fetchConversations ===");
      console.log("📍 Token présent:", !!token);
      console.log("📍 MyUserId:", myUserId);

      if (!token) {
        console.log("❌ Token manquant");
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
        console.log("🚀 Appel de getMyMessageListings...");

        // ✅ Appel API corrigé avec pagination Spring Boot (page=0, size=10)
        const data = await getMyMessageListings(token, myUserId, 0, 10);
        console.log("✅ Données reçues:");
        console.log("📊 Type:", typeof data);
        console.log("📊 Est tableau:", Array.isArray(data));
        console.log("📊 Longueur:", data?.length);
        console.log("📊 Contenu:", JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.log("⚠️ Données pas en tableau, tableau vide");
          setConversations([]);
          setError("Format de données inattendu de l'API");
        }
      } catch (err: any) {
        console.error("❌ ERREUR complète:", err);
        setError(err.message || "Erreur lors du chargement des conversations");
        setConversations([]);
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
            onPress={() => {
              // Find the other user (not the current user)
              const otherUser =
                item.otherUser.find((user) => user.id !== myUserId) ||
                item.otherUser[0];

              navigation?.navigate("ConversationChatScreen", {
                mode: "chat",
                conversationId: item.conversationId,
                listingId: item.listingId,
                otherUserId: otherUser.id,
                otherUserName: `${otherUser.firstName} ${otherUser.lastName}`,
                listingTitle: item.listingTitle,
              });
            }}
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
