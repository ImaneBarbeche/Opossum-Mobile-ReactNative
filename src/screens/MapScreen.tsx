import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Modal } from "react-native";
import { FlatList } from "react-native";
import { TextInput } from "react-native";
import { Platform } from "react-native";
import { getMockListings } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import { useNavigation } from '@react-navigation/native';


const MapScreen: React.FC = () => {
  // Dynamically require MapView and Marker only on mobile
  let MapView: any = null, Marker: any = null;
  if (Platform.OS !== 'web') {
    // @ts-ignore
    MapView = require('react-native-maps').default;
    // @ts-ignore
    Marker = require('react-native-maps').Marker;
  }
  // Etats pour les filtres avancés
  const [filterType, setFilterType] = React.useState<string | null>(null);
  const [filterCategory, setFilterCategory] = React.useState<string | null>(null);
  const [filterCity, setFilterCity] = React.useState<string>("");
  const [filterRadius, setFilterRadius] = React.useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = React.useState<string>("");
  const [filterDateTo, setFilterDateTo] = React.useState<string>("");
  const [filterSortBy, setFilterSortBy] = React.useState<string>("relevance");
  const [filterPage, setFilterPage] = React.useState<string>("0");
  const [filterSize, setFilterSize] = React.useState<string>("20");
  const navigation = useNavigation<any>();
  // ...existing code...
  // Etat pour basculer entre carte et liste
  const [showList, setShowList] = React.useState(false);
  const { user, logout, loading } = useAuth();
  // Etat pour la barre de recherche simple
  const [search, setSearch] = React.useState("");
  // Etat pour la modale de recherche avancée
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);

  // Handler pour basculer vers la vue liste (à brancher sur la navigation)
  const goToListView = () => {
    setShowList(true);
  };

  // Position mockée de l'utilisateur (à remplacer par la vraie localisation)
  const userLocation = {
    latitude: 50.6938,
    longitude: 3.1746,
  };
  // Récupère toutes les annonces mockées (affichage global)
  const allMockListings = getMockListings("any", true);
  // Filtrage par recherche simple
  // Filtrage combiné (recherche simple + filtres avancés)
  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Haversine formula
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  let filteredListings = allMockListings
    .map(item => {
      // Ajoute la distance si latitude/longitude utilisateur et objet présents
      let distance = undefined;
      if (
        filterRadius && item.latitude && item.longitude && userLocation.latitude && userLocation.longitude
      ) {
        distance = getDistanceKm(userLocation.latitude, userLocation.longitude, item.latitude, item.longitude);
      }
      return { ...item, distance };
    })
    .filter(item => {
      // Recherche textuelle
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      // Type
      const matchesType = filterType ? item.type === filterType : true;
      // Catégorie
      const matchesCategory = filterCategory ? item.category === filterCategory : true;
      // Ville
      const matchesCity = filterCity ? item.city?.toLowerCase().includes(filterCity.toLowerCase()) : true;
      // Rayon
      const matchesRadius = filterRadius && item.distance !== undefined ? item.distance <= Number(filterRadius) : true;
      // Date min
      const matchesDateFrom = filterDateFrom && item.createdAt ? new Date(item.createdAt) >= new Date(filterDateFrom) : true;
      // Date max
      const matchesDateTo = filterDateTo && item.createdAt ? new Date(item.createdAt) <= new Date(filterDateTo) : true;
      return matchesSearch && matchesType && matchesCategory && matchesCity && matchesRadius && matchesDateFrom && matchesDateTo;
    });

  // Tri
  if (filterSortBy === "distance") {
    filteredListings = filteredListings.sort((a, b) => {
      if (a.distance === undefined) return 1;
      if (b.distance === undefined) return -1;
      return a.distance - b.distance;
    });
  } else if (filterSortBy === "date") {
    filteredListings = filteredListings.sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } // sinon pertinence = ordre initial

  // Pagination
  const page = Number(filterPage) || 0;
  const size = Number(filterSize) || 20;
  filteredListings = filteredListings.slice(page * size, (page + 1) * size);

  return (
   <View style={{ flex: 1 }}>
      <FloatingLogoutButton onLogout={logout} />
      {/* Barre de recherche simple */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#888"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Text style={styles.filterText}>Filtres</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listButton} onPress={goToListView}>
          <Text style={styles.listText}>Vue liste</Text>
        </TouchableOpacity>
      </View>
      {/* Vue liste ou carte */}
      {showList ? (
        <View style={styles.listContainer}>
          {/* ...existing code pour la liste... */}
        </View>
      ) : (
        Platform.OS !== 'web' && MapView ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Marqueur utilisateur (bleu) */}
            <Marker
              coordinate={userLocation}
              title="Vous"
              pinColor="#4F8EF7"
            />
            {/* Marqueurs annonces mockées filtrées */}
            {filteredListings.map(obj => (
              obj.latitude && obj.longitude ? (
                <Marker
                  key={obj.id}
                  coordinate={{ latitude: obj.latitude, longitude: obj.longitude }}
                  title={obj.title}
                  pinColor={obj.type === "LOST" ? "#E9446A" : "#4EC97B"}
                />
              ) : null
            ))}
          </MapView>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>La carte n'est pas disponible sur le web.</Text>
          </View>
        )
      )}
      {/* Modale de recherche avancée */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recherche avancée</Text>
            {/* Type perdu/trouvé */}
            <View style={styles.modalRow}>
              <TouchableOpacity
                style={[styles.modalTypeButton, filterType === "LOST" && styles.modalTypeSelected]}
                onPress={() => setFilterType(filterType === "LOST" ? null : "LOST")}
              >
                <Text style={styles.modalTypeText}>Perdu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTypeButton, filterType === "FOUND" && styles.modalTypeSelected]}
                onPress={() => setFilterType(filterType === "FOUND" ? null : "FOUND")}
              >
                <Text style={styles.modalTypeText}>Trouvé</Text>
              </TouchableOpacity>
            </View>
            {/* Catégorie */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Catégorie :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="ex: keys, electronics, accessories..."
                value={filterCategory || ""}
                onChangeText={setFilterCategory}
              />
            </View>
            {/* Ville/adresse */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Ville / Adresse :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="ex: Paris, Lyon..."
                value={filterCity}
                onChangeText={setFilterCity}
              />
            </View>
            {/* Rayon (km) */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Rayon (km) :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="ex: 10"
                value={filterRadius}
                onChangeText={setFilterRadius}
                keyboardType="numeric"
              />
            </View>
            {/* Date min */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Date min :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="YYYY-MM-DD"
                value={filterDateFrom}
                onChangeText={setFilterDateFrom}
              />
            </View>
            {/* Date max */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Date max :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="YYYY-MM-DD"
                value={filterDateTo}
                onChangeText={setFilterDateTo}
              />
            </View>
            {/* Tri */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Tri :</Text>
              <TouchableOpacity
                style={[styles.modalTypeButton, filterSortBy === "relevance" && styles.modalTypeSelected]}
                onPress={() => setFilterSortBy("relevance")}
              >
                <Text style={styles.modalTypeText}>Pertinence</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTypeButton, filterSortBy === "date" && styles.modalTypeSelected]}
                onPress={() => setFilterSortBy("date")}
              >
                <Text style={styles.modalTypeText}>Date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTypeButton, filterSortBy === "distance" && styles.modalTypeSelected]}
                onPress={() => setFilterSortBy("distance")}
              >
                <Text style={styles.modalTypeText}>Distance</Text>
              </TouchableOpacity>
            </View>
            {/* Pagination */}
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Page :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="0"
                value={filterPage}
                onChangeText={setFilterPage}
                keyboardType="numeric"
              />
              <Text style={styles.modalLabel}>Taille :</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="20"
                value={filterSize}
                onChangeText={setFilterSize}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalButtonText}>Valider</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                setFilterType(null);
                setFilterCategory(null);
                setFilterCity("");
                setFilterRadius("");
                setFilterDateFrom("");
                setFilterDateTo("");
                setFilterSortBy("relevance");
                setFilterPage("0");
                setFilterSize("20");
                setFilterModalVisible(false);
              }}>
                <Text style={styles.modalButtonText}>Réinitialiser</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  ownerAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  ownerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  ownerAvatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerAvatarFallbackText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ownerName: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 8,
  },
  profileButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F8EF7',
    marginBottom: 16,
    alignSelf: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTypeButton: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalTypeSelected: {
    backgroundColor: '#4F8EF7',
  },
  modalTypeText: {
    color: '#222',
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: 15,
    color: '#555',
    marginRight: 8,
    minWidth: 90,
  },
  modalInput: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 38,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardFound: {
    backgroundColor: '#DFF6E0',
  },
  cardLost: {
    backgroundColor: '#FDF6E3',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  backToMapButton: {
    alignSelf: 'flex-start',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
  },
  backToMapText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F8EF7',
    alignSelf: 'center',
    marginBottom: 12,
  },
  listCard: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#fff',
  },
  listImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listImageText: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  listDescription: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  listStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  listStatusText: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    zIndex: 2,
    marginTop: 80, // Décale la barre sous le bouton logout
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchLabel: {
    color: "#888",
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: "#4F8EF7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listButton: {
    marginLeft: 8,
    backgroundColor: "#E9446A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  listText: {
    color: "#fff",
    fontWeight: "bold",
  },
  map: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    color: "#333",
  },
});

export default MapScreen;
