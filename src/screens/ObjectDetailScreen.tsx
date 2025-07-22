import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { componentStyles, colors, spacing, typography } from "../theme";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { getListingDetails, updateListing, deleteListing } from "../services/annonce.service";
import { getValidAccessToken } from "../services/token.helper";
import EditListingModal from "../components/EditListingModal";

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
  // On ne calcule isOwner que si data est défini
  const isOwner = data && (user?.id === data.user?.id || user?.id === data.userId);
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
    <View style={{ flex: 1, backgroundColor: colors.lightGray }}>
      <View style={{ height: 32 }} />
      <View
        style={[
          componentStyles.card,
          {
            flex: 1,
            minHeight: 420,
            margin: 16,
            backgroundColor: data.type === "FOUND" ? "#DFF6E0" : "#FDF6E3",
            padding: 24,
            justifyContent: 'flex-start',
          },
        ]}
      >
        {/* Boutons d'action en haut à droite */}
        {isOwner && (
          <View style={{ position: 'absolute', top: 18, right: 18, flexDirection: 'row', zIndex: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => setEditModalVisible(true)}
            >
              <Ionicons name="pencil" size={20} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: colors.error,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={async () => {
                Alert.alert(
                  'Supprimer l\'annonce',
                  'Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.',
                  [
                    { text: 'Annuler', style: 'cancel' },
                    {
                      text: 'Supprimer',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          setLoading(true);
                          const token = await getValidAccessToken();
                          if (!token) throw new Error('Token manquant');
                          await deleteListing(data.id, token);
                          Alert.alert('Succès', 'Annonce supprimée avec succès');
                          navigation.goBack();
                        } catch (e: any) {
                          let backendMsg = e?.response?.data?.message || e?.response?.data?.error || e.message || 'Erreur lors de la suppression';
                          if (typeof backendMsg !== 'string') backendMsg = JSON.stringify(backendMsg);
                          Alert.alert('Erreur', backendMsg);
                        } finally {
                          setLoading(false);
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Ionicons name="trash" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
        {/* PHOTO CENTRÉE */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image
            source={{ uri: data.photoUrl || "https://via.placeholder.com/120" }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 16,
              backgroundColor: colors.mediumGray,
              marginBottom: 12,
            }}
          />
          {/* TITRE CENTRÉ */}
          <Text style={[typography.h2, { textAlign: 'center', marginBottom: 6 }]}>{data.title}</Text>
        </View>
        {/* TYPE ET CATÉGORIE CENTRÉS */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            color: data.type === "FOUND" ? colors.primary : colors.error,
            textAlign: 'center',
            marginBottom: 2,
          }}
        >
          {data.type === "FOUND" ? "Objet trouvé" : "Objet perdu"}
        </Text>
        <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 12 }}>
          Catégorie : {data.category}
        </Text>
        {/* DESCRIPTION */}
        <Text style={{ fontSize: 16, marginBottom: 16, color: colors.darkGray, textAlign: 'center' }}>
          {data.description}
        </Text>
        {/* LIEU */}
        <View style={{ marginBottom: 12, alignItems: 'center' }}>
          <Text style={{ fontWeight: "bold" }}>Lieu :</Text>
          {data.location ? (
            <>
              <Text style={{ textAlign: 'center' }}>
                {data.location.address || ''}{data.location.address && data.location.city ? ', ' : ''}{data.location.city || ''}
              </Text>
              <Text style={{ textAlign: 'center' }}>
                Lat: {data.location.latitude ?? ''} / Long: {data.location.longitude ?? ''}
              </Text>
            </>
          ) : (
            <Text style={{ textAlign: 'center' }}>Non renseigné</Text>
          )}
        </View>
        {/* DATE */}
        <Text style={{ color: colors.darkGray, marginBottom: 16, textAlign: 'center' }}>
          Créée le : {new Date(data.createdAt).toLocaleString()}
        </Text>
        {/* PROPRIÉTAIRE */}
        {!isOwner && data.user && (
          <View style={{ marginBottom: 10, alignItems: 'center' }}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Propriétaire :</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
              <Image
                source={{ uri: data.user.avatar }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              />
              <Text>
                {data.user.firstName} {data.user.lastName}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  marginLeft: 8,
                }}
                onPress={() =>
                  data.user &&
                  navigation.navigate("Mes annonces", {
                    screen: "PublicProfile",
                    params: { userId: data.user.id },
                  })
                }
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Voir profil
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#2e7d32",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  marginLeft: 8,
                }}
                onPress={() =>
                  data.user &&
                  navigation.navigate("Messages", {
                    annonceId: data.id,
                    receiverId: data.user.id,
                  })
                }
              >
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  Contacter
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default ObjectDetailScreen;

