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
import { componentStyles, colors, spacing, typography } from "../../theme";
import { listingScreenStyles } from "../../theme/listingScreenStyles";
import { useAuth } from "../../context/AuthContext";
import FloatingLogoutButton from "../../components/FloatingLogoutButton";
import { deleteListing, getUserListings } from "../../services/listing.service";
import { Listing } from "../../models/Listing";
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
    // Même logique fallback image que MapListView
    const isValid = (url?: string) => typeof url === 'string' && url.trim() !== '' && !url.includes('via.placeholder.com/150?text=No+Image') && !url.includes('via.placeholder.com/80');
    let imageSource: any = null;
    if (isValid(item.thumbnailUrl)) {
      imageSource = { uri: item.thumbnailUrl };
    } else if (isValid(item.photoUrl)) {
      imageSource = { uri: item.photoUrl };
    } else if (isValid((item as any).imageUrl)) {
      imageSource = { uri: (item as any).imageUrl };
    } else {
      imageSource = require("../../../assets/images/no-photo.png");
    }
    // Définition des couleurs de badge harmonisées
    const typeBadge = {
      label: item.type === 'FOUND' ? 'Trouvé' : 'Perdu',
      color: item.type === 'FOUND' ? colors.success : colors.error,
    };
  let statusBadge: { label: string; color: string } = { label: '', color: colors.success };
    switch (item.status) {
      case 'RESOLVED':
        statusBadge = { label: 'Résolu', color: colors.info };
        break;
      case 'ARCHIVED':
        statusBadge = { label: 'Archivé', color: colors.warning };
        break;
      case 'DELETED':
        statusBadge = { label: 'Supprimé', color: colors.error };
        break;
      default:
        statusBadge = { label: 'Actif', color: colors.success };
    }
    return (
      <TouchableOpacity
        style={{ marginHorizontal: 8, marginVertical: 6 }}
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate("ObjectDetail", { id: item.id });
        }}
      >
        <View style={[listingScreenStyles.card, { position: 'relative' }]}> 
          {/* Badges en haut à droite */}
          <View style={{ position: 'absolute', top: 10, right: 10, flexDirection: 'row', gap: 6, zIndex: 2 }}>
            <View style={[listingScreenStyles.badge, { backgroundColor: typeBadge.color }]}> 
              <Text style={listingScreenStyles.badgeText} numberOfLines={1} ellipsizeMode="tail">{typeBadge.label}</Text>
            </View>
            <View style={[listingScreenStyles.badge, { backgroundColor: statusBadge.color }]}> 
              <Text style={listingScreenStyles.badgeText} numberOfLines={1} ellipsizeMode="tail">{statusBadge.label}</Text>
            </View>
          </View>
          {/* Image et catégorie */}
          <View style={listingScreenStyles.imageContainer}>
            <RNImage
              source={imageSource}
              style={listingScreenStyles.image}
              resizeMode="cover"
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 180, marginTop: 8 }}>
              <Text style={{ fontSize: 18 }}>
                {require('../../utils/categories').getCategoryEmoji(item.category)}
              </Text>
              <Text
                style={{ fontSize: 13, fontWeight: '500', color: colors.primaryDark, maxWidth: 140 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {require('../../utils/categories').getCategoryLabel(item.category)}
              </Text>
            </View>
          </View>
          <View style={listingScreenStyles.content}>
            <Text style={listingScreenStyles.title}>{item.title}</Text>
            <Text style={listingScreenStyles.description} numberOfLines={2}>{item.description}</Text>
            <View style={listingScreenStyles.infoRow}>
              <Text style={listingScreenStyles.infoText}>{item.city}</Text>
            </View>
            {/* Date en bas à droite */}
            <View style={{ position: 'absolute', bottom: 10, right: 16 }}>
              <Text style={{ fontSize: 13, color: colors.primaryLight }}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
  <View style={listingScreenStyles.container}>
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
