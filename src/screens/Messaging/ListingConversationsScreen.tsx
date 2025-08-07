import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { colors } from "../../theme";
import { listingConversationsStyles } from "../../theme/listingConversationsStyles";
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
        mode: "chat", 
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
      <View style={listingConversationsStyles.container}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32, alignSelf: "center" }} />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={listingConversationsStyles.container}>
        <View style={listingConversationsStyles.errorBox}>
          <Text style={listingConversationsStyles.errorText}>{error}</Text>
          <TouchableOpacity onPress={retryLoad} style={listingConversationsStyles.retryButton}>
            <Text style={listingConversationsStyles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={listingConversationsStyles.container}>
      <FlatList
        data={conversations}
  keyExtractor={(item, index) => item.conversationId ? String(item.conversationId) : String(index)}
        renderItem={({ item }) => {
          // Avatar générique (image placeholder)
          return (
            <TouchableOpacity
              onPress={() => handleConversationPress(item)}
              style={[listingConversationsStyles.card, {
                borderLeftColor: item.unreadCount > 0 ? colors.primary : colors.lightGray,
                flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
              }]}
              activeOpacity={0.85}
            >
              {/* Avatar */}
              <View style={{ marginRight: 16 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lightGray, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image
                    source={require('../../../assets/images/avatar-placeholder.png')}
                    style={{ width: 44, height: 44, borderRadius: 22, opacity: 0.7 }}
                    resizeMode="cover"
                  />
                  {/* Badge non lu (point bleu) */}
                  {item.unreadCount > 0 && (
                    <View style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: colors.primary,
                      borderWidth: 2,
                      borderColor: colors.white,
                    }} />
                  )}
                </View>
              </View>
              {/* Colonne centrale : nom, message, date */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Text
                    style={[listingConversationsStyles.cardTitle, { fontWeight: item.unreadCount > 0 ? 'bold' : 'normal', flexShrink: 1, flexGrow: 1, minWidth: 0 }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.otherUserName}
                  </Text>
                  {/* Badge non lu */}
                  {item.unreadCount > 0 && (
                    <View style={[listingConversationsStyles.unreadBadge, { marginLeft: 8 }]}> 
                      <Text style={listingConversationsStyles.unreadBadgeText}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
                {item.lastMessagePreview && (
                  <Text
                    style={item.unreadCount > 0 ? listingConversationsStyles.lastMessage : listingConversationsStyles.lastMessageItalic}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.lastMessagePreview}
                  </Text>
                )}
                <Text style={listingConversationsStyles.lastActivity}>
                  {new Date(item.lastActivityAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={listingConversationsStyles.emptyContainer}>
            <Text style={listingConversationsStyles.emptyText}>Aucune conversation trouvée</Text>
            <Text style={listingConversationsStyles.emptySubText}>Les conversations apparaîtront ici quand des utilisateurs vous contacteront</Text>
          </View>
        }
      />
    </View>
  );
}
