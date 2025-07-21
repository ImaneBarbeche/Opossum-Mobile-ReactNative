// Accueil après connexion

import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image as RNImage } from "react-native";
import { componentStyles, colors, spacing, typography } from '../theme';
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import { getMyListings, deleteListing } from "../services/annonce.service";
import { getMockListings, mockUpdateListing } from "../services/mockApi";
import EditListingModal from "../components/EditListingModal";
import { Listing } from "../models/Annonce";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ListingScreen: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [annonces, setAnnonces] = useState<Listing[]>([]);
  // Stockage local des annonces mockées pour éviter la perte au reload
  const localMockRef = useRef<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation() as any;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    // Au premier montage, charge les annonces mockées en mémoire locale
    if (localMockRef.current.length === 0) {
      localMockRef.current = getMockListings("any", true);
    }
    // Trie par date décroissante
    const sorted = [...localMockRef.current].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAnnonces(sorted);
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const exists = localMockRef.current.some(item => item.id === id);
    if (!exists) {
      Alert.alert("Erreur", "L'annonce n'existe plus ou a déjà été supprimée.");
      return;
    }
    Alert.alert("Confirmation", "Supprimer cette annonce ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          // Supprime localement si elle existe
          localMockRef.current = localMockRef.current.filter(item => item.id !== id);
          setAnnonces([...localMockRef.current]);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Listing }) => (
    <TouchableOpacity
      style={[
        componentStyles.card,
        { padding: 10, marginBottom: 16, flexDirection: 'column', backgroundColor: item.type === 'FOUND' ? '#DFF6E0' : '#FDF6E3' }
      ]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ObjectDetail', { id: item.id })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RNImage
          source={{ uri: item.photoUrl || 'https://via.placeholder.com/80' }}
          style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: colors.mediumGray }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[typography.h3, { color: colors.black, flex: 1 }]}>{item.title}</Text>
          <Text style={[typography.body, { color: colors.darkGray, marginBottom: 8 }]}>{item.description}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {
            setSelectedListing({ ...item });
            setEditModalVisible(true);
          }}>
            <Ionicons name="create-outline" size={22} color={colors.primary} style={{ marginLeft: 12 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color={colors.error} style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: item.type === 'LOST' ? colors.error : colors.primary }}>
        {item.type === 'LOST' ? 'Objet perdu' : 'Objet trouvé'}
      </Text>
    </TouchableOpacity>
  );

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
          onRefresh={() => {
            if (token && user?.id) {
              const refreshed = getMockListings(user.id);
              // Trie par date décroissante
              const sorted = [...refreshed].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              setAnnonces(sorted);
            }
          }}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>Aucune annonce trouvée.</Text>}
        />
      )}
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
    </View>
  );
};



export default ListingScreen;
