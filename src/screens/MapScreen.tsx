import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MapListView from "../components/map/MapListView";
import MapMapView from "../components/map/MapMapView";
import MapSearchBar from "../components/map/MapSearchBar";
import MapFilterModal from "../components/map/MapFilterModal";
import { colors } from "../theme";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { fetchMapListings } from "../services/listing.service";
import { useAuth } from "../context/AuthContext";

const MapScreen: React.FC = () => {
  // Dynamically require MapView and Marker only on mobile
  let MapView: any = null,
    Marker: any = null;
  if (Platform.OS !== "web") {
    // @ts-ignore
    MapView = require("react-native-maps").default;
    // @ts-ignore
    Marker = require("react-native-maps").Marker;
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
  // Etat pour la modale de recherche avancée
  const [filterModalVisible, setFilterModalVisible] = React.useState(false);
  // Etat pour la région visible de la carte
  const [mapRegion, setMapRegion] = React.useState<any | null>(null);
  // Etat pour la dernière ville/adresse utilisée pour le centrage
  const [lastCenteredCity, setLastCenteredCity] = React.useState<string>("");

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
      if (status !== "granted") {
        // Permission refusée, on garde la position par défaut
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (location?.coords) {
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        // Initialiser la région de la carte
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);
  // Etat pour les annonces récupérées via l'API
  const [markers, setMarkers] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (markers && markers.length > 0) {
      const mapped = markers.map((m) => ({
        id: m.id,
        titre: m.title,
        latitude: m.lat,
        longitude: m.lng,
      }));
    } else {
    }
  }, [markers]);

  // Mapping pour affichage correct sur la carte
  const mappedMarkers = markers.map((m) => ({
    ...m,
    latitude: m.lat,
    longitude: m.lng,
    titre: m.title,
  }));
  // const [nearbyListings, setNearbyListings] = React.useState<any[]>([]);
  const { token } = useAuth();

  // Fonction pour calculer le rayon (en km) à partir de la région de la carte
  function calculateRadius(region: any) {
    if (!region) return 10; // Valeur par défaut si la région n'est pas définie
    // Approximation : 1° latitude ≈ 111 km
    const latRadius = (region.latitudeDelta || 0.0922) * 111;
    // On prend la moitié pour avoir le rayon depuis le centre
    return Math.round(latRadius / 2);
  }

  React.useEffect(() => {
    // Récupère les markers pour la carte ET la liste (une seule source)
    const fetchMarkers = async () => {
      try {
        const dynamicRadius = calculateRadius(mapRegion);
        // Construction dynamique des params sans les clés undefined
        const paramsRaw = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: dynamicRadius,
          type: filterType,
          category: filterCategory,
          q: filterQ, // Ajout du filtre de recherche
          page: filterPage ? Number(filterPage) : 0,
          size: filterSize ? Number(filterSize) : 20,
          token: token,
        };
        const params = Object.fromEntries(
          Object.entries(paramsRaw).filter(
            ([_, v]) => v !== undefined && v !== null
          )
        );
        const res = await fetchMapListings(params);
        // If you know the expected type, e.g. { data: any[] }
        const data = (res as { data?: any[] }).data || [];
        setMarkers(data);
      } catch (e) {
        console.error("[API] fetchMapListings error:", e);
        setMarkers([]);
      }
    };
    fetchMarkers();
  }, [
    filterType,
    filterCategory,
    filterPage,
    filterSize,
    token,
    userLocation.latitude,
    userLocation.longitude,
    filterQ,
    mapRegion,
  ]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.lightGray }}
      edges={["bottom"]}
    >
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
        <MapMapView
          MapView={MapView}
          Marker={Marker}
          userLocation={userLocation}
          listings={mappedMarkers}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        />
      )}
      {/* Modale de recherche avancée extraite */}
      <MapFilterModal
        visible={filterModalVisible}
        onClose={async () => {
          // Si une ville/adresse est saisie et différente de la dernière centrée
          if (filterCity && filterCity !== lastCenteredCity) {
            // Géocodage
            const geocode = await import("../utils/geocode");
            const coords = await geocode.geocodeAddress(filterCity, "");
            if (coords) {
              setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
              setMapRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              setLastCenteredCity(filterCity);
            }
          }
          setFilterModalVisible(false);
        }}
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
        onReset={async () => {
          setFilterQ("");
          setFilterType(null);
          setFilterCategory(null);
          setFilterCity("");
          setFilterPage("0");
          setFilterSize("20");
          setLastCenteredCity("");
          // Revenir à la position GPS ou par défaut
          let location;
          try {
            location = await import("expo-location").then(mod => mod.getCurrentPositionAsync({ accuracy: mod.Accuracy.Balanced }));
          } catch {
            location = null;
          }
          if (location && location.coords) {
            setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            setMapRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          } else {
            // Position par défaut Lille
            setUserLocation({ latitude: 50.6938, longitude: 3.1746 });
            setMapRegion({
              latitude: 50.6938,
              longitude: 3.1746,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
          setFilterModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};
export default MapScreen;
