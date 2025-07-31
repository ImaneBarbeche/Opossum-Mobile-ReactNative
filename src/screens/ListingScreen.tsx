import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image as RNImage,
} from "react-native";
import { componentStyles, colors, spacing, typography } from "../theme";
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import { deleteListing, getUserListings } from "../services/listing.service";
import { Listing } from "../models/Listing";
import { useNavigation } from "@react-navigation/native";

const ListingScreen: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [annonces, setAnnonces] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation() as any;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchListings = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
          const data = await getUserListings(token);
          // Trie par date décroissante
          const sorted = [...data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setAnnonces(sorted);
        } catch (e: any) {
          setError(e.message || "Erreur lors du chargement des listings");
        } finally {
          setIsLoading(false);
        }
      };
      fetchListings();
    }, [token])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Confirmation", "Supprimer cette listing ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteListing(token!, id);
            setAnnonces((prev) => prev.filter((item) => item.id !== id));
            Toast.show({ type: "success", text1: "listing supprimée" });
          } catch (e: any) {
            Toast.show({
              type: "error",
              text1: "Erreur",
              text2: e.message || "Erreur lors de la suppression.",
            });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Listing }) => {
    const safeUri =
      item.photoUrl && item.photoUrl.trim() !== ""
        ? item.photoUrl.startsWith("http")
          ? item.photoUrl
          : `${process.env.EXPO_PUBLIC_API_BASE_URL || ""}${item.photoUrl}`
        : item.thumbnailUrl && item.thumbnailUrl.trim() !== ""
        ? item.thumbnailUrl.startsWith("http")
          ? item.thumbnailUrl
          : `${process.env.EXPO_PUBLIC_API_BASE_URL || ""}${item.thumbnailUrl}`
        : "https://via.placeholder.com/80";
    return (
      <TouchableOpacity
        style={[
          componentStyles.card,
          {
            padding: 10,
            marginBottom: 16,
            flexDirection: "column",
            backgroundColor: item.type === "FOUND" ? "#DFF6E0" : "#FDF6E3",
          },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("ObjectDetail", { id: item.id });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <RNImage
            source={{ uri: safeUri }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 16,
              marginRight: 12,
              backgroundColor: colors.mediumGray,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={[typography.h3, { color: colors.black, flex: 1 }]}>
              {item.title}
            </Text>
            {/* Affichage du statut de l'listing */}
            <Text
              style={[
                typography.caption,
                {
                  fontWeight: "bold",
                  color:
                    item.status === "ACTIVE"
                      ? colors.success
                      : item.status === "RESOLVED"
                      ? colors.info
                      : item.status === "ARCHIVED"
                      ? colors.warning
                      : item.status === "DELETED"
                      ? colors.error
                      : colors.darkGray,
                  marginBottom: 2,
                },
              ]}
            >
              Statut : {item.status}
            </Text>
            <Text
              style={[
                typography.body,
                { color: colors.darkGray, marginBottom: 8 },
              ]}
            >
              {item.description}
            </Text>
          </View>
          {/* Boutons édition et corbeille supprimés */}
        </View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: item.type === "LOST" ? colors.error : colors.primary,
          }}
        >
          {item.type === "LOST" ? "Objet perdu" : "Objet trouvé"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        componentStyles.container,
        { backgroundColor: colors.lightGray, paddingTop: 64 },
      ]}
    >
      <FloatingLogoutButton onLogout={logout} />
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
        Mes annonces
      </Text>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 32 }}
        />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          refreshing={isLoading}
          onRefresh={async () => {
            if (!token) return;
            setIsLoading(true);
            try {
              const data = await getUserListings(token);
              const sorted = [...data].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              );
              setAnnonces(sorted);
            } catch (e: any) {
              setError(e.message || "Erreur lors du rafraîchissement");
            } finally {
              setIsLoading(false);
            }
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 32 }}>
              Aucune listing trouvée.
            </Text>
          }
        />
      )}
    </View>
  );
};

export default ListingScreen;
