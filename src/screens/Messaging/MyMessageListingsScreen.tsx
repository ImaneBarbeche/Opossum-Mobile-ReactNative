import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { colors } from "../../theme";
import { messagingScreenStyles } from "../../theme/messagingScreenStyles";
import { getMyMessageListings, getListingConversations } from "../../services/message.service";
import { AnnouncementWithConversation } from "../../models/Conversation";
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
  const [announcements, setAnnouncements] = useState<AnnouncementWithConversation[]>([]);
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

        // ✅ Appel API corrigé avec pagination Spring Boot (page=0, size=10)
        const data = await getMyMessageListings(token, 0, 10);
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          setAnnouncements([]);
          setError("Format de données inattendu de l'API");
        }
      } catch (err: any) {
        console.error("❌ ERREUR complète:", err);
        setError(err.message || "Erreur lors du chargement des conversations");
        setAnnouncements([]);
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
    setRefreshing(true);
    getMyMessageListings(token, 0, 10)
      .then((data) => {
        setAnnouncements(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Erreur lors du chargement des annonces");
        setAnnouncements([]);
      })
      .finally(() => setRefreshing(false));
  }, [token, myUserId]);

  const retryLoad = useCallback(() => {
    setError(null);
    fetchConversations();
  }, [fetchConversations]);


  const Header = () => (
    <Text style={messagingScreenStyles.header}>Liste de mes annonces avec discussions</Text>
  );

  if (loading && !refreshing) {
    return (
      <View style={messagingScreenStyles.container}>
        <Header />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32, alignSelf: "center" }} />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={messagingScreenStyles.container}>
        <Header />
        <View style={{ backgroundColor: colors.white, borderRadius: 12, padding: 20, alignItems: "center", shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 }}>
          <Text style={{ color: colors.error, textAlign: "center", marginBottom: 16, fontSize: 16 }}>{error}</Text>
          <TouchableOpacity
            onPress={retryLoad}
            style={{
              borderRadius: 8,
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 16 }}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Au clic sur une annonce, charger les conversations pour cette annonce
  const handleAnnouncementPress = async (listingId, listingTitle) => {
    setLoading(true);
    try {
      const conversations = await getListingConversations(token, listingId, 0, 10);
      navigation.navigate("ListingConversationsScreen", {
        conversations,
        listingId,
        listingTitle,
      });
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des conversations");
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={messagingScreenStyles.container}>
      <Header />
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.listingId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleAnnouncementPress(item.listingId, item.title)}
            style={messagingScreenStyles.card}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={messagingScreenStyles.cardTitle} numberOfLines={2}>
                {item.title ? item.title : "Annonce sans titre"}
              </Text>
            </View>
            <View style={messagingScreenStyles.badgeContainer}>
              <View style={messagingScreenStyles.badge}>
                <Text style={messagingScreenStyles.badgeText}>
                  {item.conversationCount ?? 0}
                </Text>
              </View>
              <Text style={messagingScreenStyles.badgeLabel}>Conversations</Text>
            </View>
          </TouchableOpacity>
        )}
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
          <View style={messagingScreenStyles.emptyContainer}>
            <Text style={messagingScreenStyles.emptyText}>Aucune annonce trouvée</Text>
            <Text style={messagingScreenStyles.emptySubText}>Les annonces apparaîtront ici quand vous aurez des conversations</Text>
          </View>
        }
      />
    </View>
  );
}
