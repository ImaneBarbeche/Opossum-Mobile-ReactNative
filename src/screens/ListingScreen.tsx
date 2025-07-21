// Accueil après connexion

import React, { useEffect, useState, useRef } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, Image as RNImage } from "react-native";
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
      style={[styles.card, item.type === 'FOUND' ? styles.cardFound : styles.cardLost]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ObjectDetail', { id: item.id })}
    >
      <View style={styles.cardRow}>
        <RNImage
          source={{ uri: item.photoUrl || 'https://via.placeholder.com/80' }}
          style={styles.cardImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <View style={styles.iconRow}>
        <TouchableOpacity onPress={() => {
            // Correction : on met à jour selectedListing à chaque clic
            setSelectedListing({ ...item });
            setEditModalVisible(true);
          }}>
            <Ionicons name="create-outline" size={22} color="#4F8EF7" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#E9446A" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.status, { color: item.type === 'LOST' ? '#E9446A' : '#4F8EF7' }]}> 
        {item.type === 'LOST' ? 'Objet perdu' : 'Objet trouvé'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FloatingLogoutButton onLogout={logout} />
      <Text style={styles.header}>Mes annonces</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4F8EF7" style={{ marginTop: 32 }} />
      ) : error ? (
        <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
      ) : (
        <FlatList
          data={annonces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F8EF7',
    marginBottom: 16,
    alignSelf: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column',
  },
  cardFound: {
    backgroundColor: '#DFF6E0',
  },
  cardLost: {
    backgroundColor: '#FDF6E3',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Navigation bar styles removed
});

export default ListingScreen;
