import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { componentStyles, colors, typography } from "../theme";
import { objectDetailScreenStyles } from "../theme/objectDetailScreenStyles";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  getListingDetails,
  updateListing,
  deleteListing,
  fetchDistance,
} from "../services/listing.service";
import { getCategoryLabel } from "../utils/categories";
import * as Location from "expo-location";
import { getValidAccessToken } from "../services/token.helper";
import EditListingModal from "../components/listings/EditListingModal";

type ObjectDetailScreenRouteProp = RouteProp<any, any>;

const ObjectDetailScreen = () => {
  const route = useRoute<ObjectDetailScreenRouteProp>();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { id } = route.params || { id: "1" };
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  // Distance à l'annonce (doit être après data)
  const [distanceText, setDistanceText] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // On ne calcule isOwner que si data est défini
  const isOwner =
    data && (user?.id === data.user?.id || user?.id === data.userId);

  // Récupère la position réelle de l'utilisateur au montage
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (location?.coords) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    if (
      data &&
      data.latitude &&
      data.longitude &&
      userLocation &&
      userLocation.latitude &&
      userLocation.longitude
    ) {
      fetchDistance({
        fromLat: userLocation.latitude,
        fromLon: userLocation.longitude,
        toLat: data.latitude,
        toLon: data.longitude,
        unit: "km",
      })
        .then((res: any) => {
          setDistanceText(res.data?.distance?.text ?? null);
        })
        .catch(() => setDistanceText(null));
    }
  }, [data, userLocation]);
  useEffect(() => {
    setLoading(true);
    getListingDetails(id)
      .then((res: any) => {
        setData(res);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || "Erreur inconnue");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }
  if (!data) return null;

  return (
    <View style={objectDetailScreenStyles.root}>
      <View style={{ height: 32 }} />
      <View
        style={[
          objectDetailScreenStyles.card,
          { backgroundColor: data.type === "FOUND" ? "#DFF6E0" : "#FDF6E3" },
        ]}
      >
        {/* Boutons d'action en haut à droite */}
        {isOwner && (
          <View style={objectDetailScreenStyles.actionRow}>
            <TouchableOpacity
              style={[
                objectDetailScreenStyles.actionBtn,
                { backgroundColor: colors.primary, marginRight: 8 },
              ]}
              onPress={() => setEditModalVisible(true)}
            >
              <Ionicons name="pencil" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                objectDetailScreenStyles.actionBtn,
                { backgroundColor: colors.error },
              ]}
              onPress={() => {
                Alert.alert(
                  "Suppression",
                  "Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.",
                  [
                    { text: "Annuler", style: "cancel" },
                    {
                      text: "Supprimer",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          setLoading(true);
                          const token = await getValidAccessToken();
                          if (!token) throw new Error("Token manquant");
                          await deleteListing(data.id, token);
                          Toast.show({
                            type: "success",
                            text1: "Succès",
                            text2: "Annonce supprimée avec succès",
                            position: "bottom",
                          });
                          navigation.goBack();
                        } catch (e: any) {
                          let backendMsg =
                            e?.response?.data?.message ||
                            e?.response?.data?.error ||
                            e.message ||
                            "Erreur lors de la suppression";
                          if (typeof backendMsg !== "string")
                            backendMsg = JSON.stringify(backendMsg);
                          Toast.show({
                            type: "error",
                            text1: "Erreur",
                            text2: backendMsg,
                            position: "bottom",
                          });
                        } finally {
                          setLoading(false);
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
        {/* PHOTOS : carrousel horizontal si plusieurs images, sinon image unique */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          {Array.isArray(data.photos) && data.photos.length > 1 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={objectDetailScreenStyles.photoScroll}
            >
              {data.photos.map((url: string, idx: number) => (
                <Image
                  key={idx}
                  source={{ uri: url || "https://via.placeholder.com/120" }}
                  style={objectDetailScreenStyles.photoItem}
                />
              ))}
            </ScrollView>
          ) : (
            <Image
              source={{
                uri:
                  Array.isArray(data.photos) && data.photos[0]
                    ? data.photos[0]
                    : data.photoUrl && data.photoUrl.trim() !== ""
                    ? data.photoUrl
                    : data.thumbnailUrl && data.thumbnailUrl.trim() !== ""
                    ? data.thumbnailUrl
                    : "https://via.placeholder.com/120",
              }}
              style={objectDetailScreenStyles.photo}
            />
          )}
          {/* TITRE CENTRÉ */}
          <Text style={objectDetailScreenStyles.title}>{data.title}</Text>
        </View>
        {/* TYPE ET CATÉGORIE CENTRÉS */}
        <Text
          style={[
            objectDetailScreenStyles.type,
            { color: data.type === "FOUND" ? colors.primary : colors.error },
          ]}
        >
          {data.type === "FOUND" ? "Objet trouvé" : "Objet perdu"}
        </Text>
        <Text style={objectDetailScreenStyles.category}>
          Catégorie : {getCategoryLabel(data.category)}
        </Text>
        {/* DESCRIPTION */}
        <Text style={objectDetailScreenStyles.description}>
          {data.description}
        </Text>
        {/* LIEU + DISTANCE */}
        <View style={objectDetailScreenStyles.locationBlock}>
          <Text style={objectDetailScreenStyles.locationLabel}>Lieu :</Text>
          {data.location ? (
            <>
              <Text style={objectDetailScreenStyles.locationText}>
                {data.location.address || ""}
                {data.location.address && data.location.city ? ", " : ""}
                {data.location.city || ""}
              </Text>
              <Text style={objectDetailScreenStyles.locationText}>
                Lat: {data.location.latitude ?? ""} / Long:{" "}
                {data.location.longitude ?? ""}
              </Text>
              {distanceText && (
                <Text style={objectDetailScreenStyles.distance}>
                  À {distanceText} de votre position
                </Text>
              )}
            </>
          ) : (
            <Text style={objectDetailScreenStyles.locationText}>
              Non renseigné
            </Text>
          )}
        </View>
        {/* DATE */}
        <Text style={objectDetailScreenStyles.date}>
          Créée le : {new Date(data.createdAt).toLocaleString()}
        </Text>
        {/* PROPRIÉTAIRE */}
        {!isOwner && data.user && (
          <View style={objectDetailScreenStyles.ownerBlock}>
            <Text
              style={[
                objectDetailScreenStyles.locationLabel,
                { marginBottom: 4 },
              ]}
            >
              Propriétaire :
            </Text>
            <View style={objectDetailScreenStyles.ownerRow}>
              <Image
                source={{ uri: data.user.avatar }}
                style={objectDetailScreenStyles.ownerAvatar}
              />
              <Text>
                {data.user.firstName} {data.user.lastName}
              </Text>
              <TouchableOpacity
                style={objectDetailScreenStyles.ownerBtn}
                onPress={() =>
                  data.user &&
                  navigation.navigate("Mes annonces", {
                    screen: "PublicProfile",
                    params: { userId: data.user.id },
                  })
                }
              >
                <Text style={objectDetailScreenStyles.ownerBtnText}>
                  Voir profil
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={objectDetailScreenStyles.contactBtn}
                onPress={() =>
                  data.user &&
                  navigation.navigate("Messages", {
                    listingId: data.id,
                    receiverId: data.user.id,
                  })
                }
              >
                <Text style={objectDetailScreenStyles.contactBtnText}>
                  Contacter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Modal d'édition de l'annonce (propriétaire uniquement) */}
      {isOwner && data && (
        <EditListingModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          listing={{
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            status: data.status,
          }}
          onSave={async (fields) => {
            if (!data.id) {
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "L'identifiant de l'annonce est manquant",
                position: "bottom",
              });
              return;
            }
            try {
              setLoading(true);
              const token = await getValidAccessToken();
              if (!token) {
                Toast.show({
                  type: "error",
                  text1: "Erreur",
                  text2: "Votre session a expiré. Veuillez vous reconnecter.",
                  position: "bottom",
                });
                setLoading(false);
                return;
              }
              await updateListing(data.id, token, {
                ...fields,
                status: fields.status as
                  | "ACTIVE"
                  | "RESOLVED"
                  | "ARCHIVED"
                  | "DELETED",
              });
              setEditModalVisible(false);
              // Recharge les données après édition
              const updated = await getListingDetails(data.id, token);
              setData(updated);
            } catch (e: any) {
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: e.message || "Erreur lors de la modification",
                position: "bottom",
              });
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </View>
  );
};

export default ObjectDetailScreen;
