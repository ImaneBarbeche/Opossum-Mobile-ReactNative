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
import { RouteProp, useRoute } from "@react-navigation/native";
import type { ConversationSummary } from "../../models/Conversation";
import { getListingConversations } from "../../services/message.service";

type RouteParams = {
  listingId: string;
  listingTitle: string; // ✅ Changé de "titre" à "listingTitle" pour cohérence
};

type ListingConversationsScreenProps = {
  token: string;
  myUserId: string;
  navigation?: any;
  route?: any;
};

export default function ListingConversationsScreen({
  token,
  myUserId,
  navigation,
  route,
}: ListingConversationsScreenProps) {
  const routeParams =
    route?.params ??
    useRoute<RouteProp<{ params: RouteParams }, "params">>().params;
  const { listingId, listingTitle } = routeParams;

  // ✅ Changé de Message[] à ConversationSummary[] car on affiche les conversations, pas les messages
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
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

        // ✅ Utilise la vraie API backend - GET /api/v1/messages/listings/{listingId}/conversations
        const data = await getListingConversations(token, listingId, 0, 10);
        console.log("[ListingConversationsScreen] Réponse getListingConversations:", data);
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          setConversations([]);
          setError("Format de données inattendu de l'API");
        }
      } catch (err: any) {
        console.error("❌ ERREUR dans fetchConversations:");
        console.error("❌ Message:", err.message);
        console.error("❌ Erreur complète:", err);

        setError(err.message || "Erreur lors du chargement des conversations");
        setConversations([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, listingId]
  );

  // ✅ Supprimé useMock, utilise directement la vraie API
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

  const handleConversationPress = useCallback(
    (conversation: ConversationSummary) => {
      navigation?.navigate("ConversationChatScreen", {
        conversationId: conversation.conversationId,
        listingId: conversation.listingId,
        otherUserId: conversation.otherUserId,
        otherUserName: conversation.otherUserName,
        listingTitle: listingTitle,
      });
    },
    [navigation, listingTitle]
  );

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
          Conversations : {listingTitle}
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
          Conversations : {listingTitle}
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
        Conversations : {listingTitle}
      </Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.conversationId} // ✅ Utilise conversationId au lieu de messageId
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleConversationPress(item)}
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
              {/* ✅ Affiche le nom de l'autre utilisateur au lieu de "Moi" ou "Propriétaire" */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={[
                    typography.h3,
                    {
                      color: colors.black,
                      flex: 1,
                      fontWeight: item.unreadCount > 0 ? "bold" : "normal",
                    },
                  ]}
                >
                  {item.otherUserName}
                </Text>

                {/* ✅ Badge pour les messages non lus */}
                {item.unreadCount > 0 && (
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>

              {/* ✅ Aperçu du dernier message */}
              {item.lastMessagePreview && (
                <Text
                  style={[
                    typography.body,
                    {
                      color: colors.darkGray,
                      marginBottom: 8,
                      fontStyle: item.unreadCount > 0 ? "normal" : "italic",
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.lastMessagePreview}
                </Text>
              )}

              {/* ✅ Date de la dernière activité */}
              <Text style={[typography.caption, { color: colors.mediumGray }]}>
                {new Date(item.lastActivityAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
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
              Les conversations apparaîtront ici quand des utilisateurs vous
              contacteront
            </Text>
          </View>
        }
      />
    </View>
  );
}
