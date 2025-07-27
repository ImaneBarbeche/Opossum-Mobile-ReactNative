import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import MapListView from "../components/MapListView";
import MapMapView from "../components/MapMapView";
import MapSearchBar from "../components/MapSearchBar";
import MapFilterModal from "../components/MapFilterModal";
import { componentStyles, colors, spacing, typography } from '../theme';
import { Modal } from "react-native";
import { FlatList } from "react-native";
import { TextInput } from "react-native";
import { Platform } from "react-native";
import * as Location from 'expo-location';
import { fetchMapListings, fetchNearbyListings } from "../services/annonce.service";
import { useAuth } from "../context/AuthContext";


import { Ionicons } from '@expo/vector-icons';


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
  const [filterQ, setFilterQ] = React.useState<string>("");
  const [filterType, setFilterType] = React.useState<string | null>(null);
  const [filterCategory, setFilterCategory] = React.useState<string | null>(null);
  const [filterCity, setFilterCity] = React.useState<string>("");
  const [filterPage, setFilterPage] = React.useState<string>("0");
  const [filterSize, setFilterSize] = React.useState<string>("20");
  // Etat pour basculer entre carte et liste
  const [showList, setShowList] = React.useState(false);
  const { user, logout, loading } = useAuth();
  // Etat pour la barre de recherche simple (fusionné avec filterQ)
  // Etat pour la modale de recherche avancée
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);

  // Handler pour basculer vers la vue liste (à brancher sur la navigation)
  const goToListView = () => {
    setShowList(true);
  };

  // Position réelle de l'utilisateur (par défaut Lille, remplacée après autorisation)
  const [userLocation, setUserLocation] = React.useState({
    latitude: 50.6938,
    longitude: 3.1746,
  });

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Permission refusée, on garde la position par défaut
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (location?.coords) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);
  // Etat pour les annonces récupérées via l'API
  const [markers, setMarkers] = React.useState<any[]>([]);
  // Log détaillé pour debug : afficher les markers récupérés depuis l’API
  React.useEffect(() => {
    if (markers && markers.length > 0) {
      const mapped = markers.map(m => ({
        id: m.id,
        titre: m.title,
        latitude: m.lat,
        longitude: m.lng
      }));
    } else {
    }
  }, [markers]);

  // Mapping pour affichage correct sur la carte
  const mappedMarkers = markers.map(m => ({
    ...m,
    latitude: m.lat,
    longitude: m.lng,
    titre: m.title
  }));
  // const [nearbyListings, setNearbyListings] = React.useState<any[]>([]);
  const { token } = useAuth();

  React.useEffect(() => {
    // Récupère les markers pour la carte ET la liste (une seule source)
    const fetchMarkers = async () => {
      try {
        // Construction dynamique des params sans les clés undefined
        const paramsRaw = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: 10,
          type: filterType,
          category: filterCategory,
          page: filterPage ? Number(filterPage) : 0,
          size: filterSize ? Number(filterSize) : 20,
          token: token,
        };
        const params = Object.fromEntries(Object.entries(paramsRaw).filter(([_, v]) => v !== undefined && v !== null));
        const res = await fetchMapListings(params);
        setMarkers(res.data || []);
      } catch (e) {
        setMarkers([]);
      }
    };
    fetchMarkers();
  }, [filterType, filterCategory, filterPage, filterSize, token, userLocation.latitude, userLocation.longitude]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightGray }} edges={["bottom"]}>
      {/* Barre de recherche simple extraite */}
      <MapSearchBar
        search={filterQ}
        setSearch={setFilterQ}
        onOpenFilters={() => setFilterModalVisible(true)}
        onListView={goToListView}
        showListButton={!showList}
        showMapButton={showList}
        onMapView={() => setShowList(false)}
      />
      {/* Vue liste ou carte */}
      {showList ? (
        <MapListView listings={mappedMarkers} />
      ) : (
        <MapMapView MapView={MapView} Marker={Marker} userLocation={userLocation} listings={mappedMarkers} />
      )}
      {/* Modale de recherche avancée extraite */}
      <MapFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filterQ={filterQ}
        setFilterQ={setFilterQ}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        filterPage={filterPage}
        setFilterPage={setFilterPage}
        filterSize={filterSize}
        setFilterSize={setFilterSize}
        onReset={() => {
          setFilterQ("");
          setFilterType(null);
          setFilterCategory(null);
          setFilterCity("");
          setFilterPage("0");
          setFilterSize("20");
          setFilterModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};
export default MapScreen;
