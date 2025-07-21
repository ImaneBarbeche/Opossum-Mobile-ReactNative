import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MapListView from "../components/MapListView";
import MapMapView from "../components/MapMapView";
import MapSearchBar from "../components/MapSearchBar";
import MapFilterModal from "../components/MapFilterModal";
import { componentStyles, colors, spacing, typography } from '../theme';
import { Modal } from "react-native";
import { FlatList } from "react-native";
import { TextInput } from "react-native";
import { Platform } from "react-native";
import { getMockListings } from "../services/mockApi";
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";


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
      {/* Barre de recherche simple extraite */}
      <MapSearchBar
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => setFilterModalVisible(true)}
        onListView={goToListView}
      />
      {/* Vue liste ou carte */}
      {showList ? (
        <MapListView listings={filteredListings} />
      ) : (
        <MapMapView MapView={MapView} Marker={Marker} userLocation={userLocation} listings={filteredListings} />
      )}
      {/* Modale de recherche avancée extraite */}
      <MapFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        filterRadius={filterRadius}
        setFilterRadius={setFilterRadius}
        filterDateFrom={filterDateFrom}
        setFilterDateFrom={setFilterDateFrom}
        filterDateTo={filterDateTo}
        setFilterDateTo={setFilterDateTo}
        filterSortBy={filterSortBy}
        setFilterSortBy={setFilterSortBy}
        filterPage={filterPage}
        setFilterPage={setFilterPage}
        filterSize={filterSize}
        setFilterSize={setFilterSize}
        onReset={() => {
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
        }}
      />
    </View>
  );
};
export default MapScreen;
