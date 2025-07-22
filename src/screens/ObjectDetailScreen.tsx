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
import { getListingDetails, updateListing } from "../services/annonce.service";
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
    <View
      style={[
        componentStyles.card,
        {
          margin: 16,
          backgroundColor: data.type === "FOUND" ? "#DFF6E0" : "#FDF6E3",
          padding: 16,
        },
      ]}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Image
          source={{ uri: data.photoUrl || "https://via.placeholder.com/80" }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            marginRight: 12,
            backgroundColor: colors.mediumGray,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={[typography.h2, { marginBottom: 2 }]}>{data.title}</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: data.type === "FOUND" ? colors.primary : colors.error,
              marginBottom: 2,
            }}
          >
            {data.type === "FOUND" ? "Objet trouvé" : "Objet perdu"}
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 2 }}>
            Catégorie : {data.category}
          </Text>
          <Text style={{ fontSize: 15, marginBottom: 2 }}>
            Statut : {data.status}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 16, marginBottom: 10, color: colors.darkGray }}>
        {data.description}
      </Text>
      {isOwner && (
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            alignSelf: 'flex-end',
            marginBottom: 10,
          }}
          onPress={() => setEditModalVisible(true)}
        >
          <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 15 }}>Modifier</Text>
        </TouchableOpacity>
      )}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Lieu :</Text>
        {data.location ? (
          <>
            <Text>
              {data.location.address || ''}{data.location.address && data.location.city ? ', ' : ''}{data.location.city || ''}
            </Text>
            <Text>
              Lat: {data.location.latitude ?? ''} / Long: {data.location.longitude ?? ''}
            </Text>
          </>
        ) : (
          <Text>Non renseigné</Text>
        )}
      </View>
      {!isOwner && data.user && (
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Propriétaire :</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: data.user.avatar }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
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
      <Text style={{ color: colors.darkGray, marginTop: 10 }}>
        Créée le : {new Date(data.createdAt).toLocaleString()}
      </Text>
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
          try {
            setLoading(true);
            // Récupère le token d'accès valide
            const token = await getValidAccessToken();
            if (!token) throw new Error('Token manquant');
            // Cast du status pour correspondre au type attendu
            const body = {
              ...fields,
              status: fields.status as "ACTIVE" | "RESOLVED"
            };
            const updated = await updateListing(data.id, token, body);
            setData(updated);
            setEditModalVisible(false);
          } catch (e: any) {
            let backendMsg = e?.response?.data?.message || e?.response?.data?.error || e.message || 'Erreur lors de la modification';
            if (typeof backendMsg !== 'string') backendMsg = JSON.stringify(backendMsg);
            Alert.alert('Erreur', backendMsg);
          } finally {
            setLoading(false);
          }
        }}
      />
    </View>
  );
};

export default ObjectDetailScreen;
