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
import { messagingScreenStyles } from "../../theme/messagingScreenStyles";
import { getMyMessageListings, getListingConversations } from "../../services/message.service";
import { getListingDetails } from "../../services/listing.service";
import { AnnouncementWithConversation } from "../../models/Conversation";
import type { Listing } from "../../models/Listing";
import { getCategoryEmoji } from "../../utils/categories";

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
  // On enrichit chaque annonce avec ses détails (type, catégorie, image...)
  const [announcements, setAnnouncements] = useState<AnnouncementWithConversation[]>([]);
  const [detailedListings, setDetailedListings] = useState<Record<string, Listing | null>>({});
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

        // 1. Récupère la liste des annonces avec conversations
        const data = await getMyMessageListings(token, 0, 10);
        if (Array.isArray(data)) {
          setAnnouncements(data);
          // 2. Pour chaque annonce, charge les détails (en parallèle)
          const detailResults = await Promise.all(
            data.map(async (item) => {
              try {
                const details = await getListingDetails(item.listingId, token);
                return [item.listingId, details];
              } catch (e) {
                return [item.listingId, null];
              }
            })
          );
          // 3. Stocke les détails dans un objet { [listingId]: details }
          setDetailedListings(Object.fromEntries(detailResults));
        } else {
          setAnnouncements([]);
          setDetailedListings({});
          setError("Format de données inattendu de l'API");
        }
      } catch (err: any) {
        console.error("❌ ERREUR complète:", err);
        setError(err.message || "Erreur lors du chargement des conversations");
        setAnnouncements([]);
        setDetailedListings({});
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
    <Text style={messagingScreenStyles.header}>💬 Messagerie de mes annonces</Text>
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
        renderItem={({ item }) => {
          const details = detailedListings[item.listingId];
          // On prépare les infos pour la carte harmonisée
          const imageUrl = details?.photoUrl || details?.thumbnailUrl || require("../../../assets/images/no-photo.png");
          const type = details?.type;
          const category = details?.category;
          const emoji = category ? getCategoryEmoji(category) : "";
          return (
            <TouchableOpacity
              onPress={() => handleAnnouncementPress(item.listingId, item.listingTitle)}
              style={messagingScreenStyles.card}
              activeOpacity={0.85}
            >
              {/* Miniature à gauche */}
              <View style={{ marginRight: 16 }}>
                {typeof imageUrl === "string" ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.lightGray }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={imageUrl}
                    style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: colors.lightGray }}
                    resizeMode="cover"
                  />
                )}
              </View>
              {/* Colonne centrale = contenu principal (titre, badge type) */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "nowrap" }}>
                  {/* Badge type */}
                  {type && (
                    <View style={{
                      backgroundColor: type === "LOST" ? colors.error : colors.success,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginRight: 8,
                    }}>
                      <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 12 }}>
                        {type === "LOST" ? "Perdu" : "Trouvé"}
                      </Text>
                    </View>
                  )}
                  {/* Emoji catégorie + titre, tronqué proprement */}
                  <Text
                    style={[messagingScreenStyles.cardTitle, { flexShrink: 1, flexGrow: 1, minWidth: 0 }]}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {emoji ? emoji + " " : ""}
                    {item.listingTitle ? item.listingTitle : "Annonce sans titre"}
                  </Text>
                </View>
              </View>
              {/* Badge conversations moderne avec icône */}
              <View style={{ alignSelf: "flex-start", marginLeft: 12, flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={[messagingScreenStyles.badge, { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, minWidth: 32 }]}> 
                  <Text style={{ fontSize: 15, marginRight: 2 }}>💬</Text>
                  <Text style={messagingScreenStyles.badgeText}>{item.conversationCount ?? 0}</Text>
                </View>
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
          <View style={messagingScreenStyles.emptyContainer}>
            <Text style={messagingScreenStyles.emptyText}>Aucune annonce trouvée</Text>
            <Text style={messagingScreenStyles.emptySubText}>Les annonces apparaîtront ici quand vous aurez des conversations</Text>
          </View>
        }
      />
    </View>
  );
}
