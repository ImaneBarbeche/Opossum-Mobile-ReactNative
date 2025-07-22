import Toast from 'react-native-toast-message';
// Accueil après connexion

import React, { useEffect, useState, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image as RNImage } from "react-native";
import { componentStyles, colors, spacing, typography } from '../theme';
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import { getMyListings, deleteListing } from "../services/annonce.service";
import EditListingModal from "../components/EditListingModal";
import { Listing } from "../models/Annonce";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ListingScreen: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [annonces, setAnnonces] = useState<Listing[]>([]);
  // Plus de stockage local, tout passe par l'API
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
          const data = await getMyListings(token);
          // Trie par date décroissante
          const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAnnonces(sorted);
        } catch (e: any) {
          setError(e.message || 'Erreur lors du chargement des annonces');
        } finally {
          setIsLoading(false);
        }
      };
      fetchListings();
    }, [token])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Confirmation", "Supprimer cette annonce ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteListing(token!, id);
            setAnnonces((prev) => prev.filter(item => item.id !== id));
            Toast.show({ type: 'success', text1: 'Annonce supprimée' });
          } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Erreur', text2: e.message || "Erreur lors de la suppression." });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Listing }) => {
    const safeUri = item.thumbnailUrl && item.thumbnailUrl.trim() !== ''
      ? item.thumbnailUrl.startsWith('http')
        ? item.thumbnailUrl
        : `${process.env.EXPO_PUBLIC_API_BASE_URL || ''}${item.thumbnailUrl}`
      : 'https://via.placeholder.com/80';
    return (
      <TouchableOpacity
        style={[
          componentStyles.card,
          { padding: 10, marginBottom: 16, flexDirection: 'column', backgroundColor: item.type === 'FOUND' ? '#DFF6E0' : '#FDF6E3' }
        ]}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('ObjectDetail', { id: item.id });
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <RNImage
            source={{ uri: safeUri }}
            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: colors.mediumGray }}
          />
        <View style={{ flex: 1 }}>
          <Text style={[typography.h3, { color: colors.black, flex: 1 }]}>{item.title}</Text>
          <Text style={[typography.body, { color: colors.darkGray, marginBottom: 8 }]}>{item.description}</Text>
        </View>
        {/* Boutons édition et corbeille supprimés */}
      </View>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: item.type === 'LOST' ? colors.error : colors.primary }}>
        {item.type === 'LOST' ? 'Objet perdu' : 'Objet trouvé'}
      </Text>
    </TouchableOpacity>
    );
  };

  return (
    <View style={[componentStyles.container, { backgroundColor: colors.lightGray, paddingTop: 40 }]}> 
      <FloatingLogoutButton onLogout={logout} />
      <Text style={[typography.h1, { color: colors.primary, marginBottom: spacing.md, alignSelf: 'center' }]}>Mes annonces</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
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
              const data = await getMyListings(token);
              const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setAnnonces(sorted);
            } catch (e: any) {
              setError(e.message || 'Erreur lors du rafraîchissement');
            } finally {
              setIsLoading(false);
            }
          }}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>Aucune annonce trouvée.</Text>}
        />
      )}
      {/*
      {selectedListing && (
        <EditListingModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          listing={selectedListing}
          onSave={(fields) => {
            // Appel du mock de mise à jour
            // Edition mockée sans contrôle utilisateur
            // Map status string to allowed enum values for Listing
            const allowedStatus = ["ACTIVE", "RESOLVED", "ARCHIVED", "DELETED"] as const;
            const mappedFields = {
              ...fields,
              status: allowedStatus.includes(fields.status as any)
                ? (fields.status as "ACTIVE" | "RESOLVED" | "ARCHIVED" | "DELETED")
                : "ACTIVE"
            };
            // Edition locale
            localMockRef.current = localMockRef.current.map(item =>
              item.id === selectedListing.id ? { ...item, ...mappedFields } : item
            );
            setAnnonces([...localMockRef.current]);
            setEditModalVisible(false);
          }}
        />
      )}
      */}
    </View>
  );
};



export default ListingScreen;
