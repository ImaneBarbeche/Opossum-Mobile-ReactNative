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
import { getMyMessageListings, getListingConversations } from "../../services/message.service";
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
  const [announcements, setAnnouncements] = useState([]);
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
        const data = await getMyMessageListings(token, myUserId, 0, 10);
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
    getMyMessageListings(token, myUserId, 0, 10)
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
    <View style={[componentStyles.container, { backgroundColor: colors.lightGray, paddingTop: 64 }]}> 
      <Text style={[typography.h1, { color: colors.primary, marginBottom: 16, alignSelf: "center" }]}>Liste de mes annonces avec discussions</Text>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.listingId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleAnnouncementPress(item.listingId, item.title)}
            style={[componentStyles.card, { padding: 16, marginBottom: 12, backgroundColor: colors.white }]}
            activeOpacity={0.8}
          >
            <Text style={[typography.h3, { color: colors.black, marginBottom: 8 }]}>{item.title}</Text>
            <Text style={[typography.body, { color: colors.darkGray, marginBottom: 8 }]}>Conversations: {item.conversationCount}</Text>
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
            <Text style={{ textAlign: "center", color: colors.darkGray, fontSize: 16 }}>Aucune annonce trouvée</Text>
            <Text style={{ textAlign: "center", color: colors.mediumGray, marginTop: 8 }}>Les annonces apparaîtront ici quand vous aurez des conversations</Text>
          </View>
        }
      />
    </View>
  );
}
