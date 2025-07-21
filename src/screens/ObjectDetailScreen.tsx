
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { getListingDetailsMock } from "../services/annonce.service";

type ObjectDetailScreenRouteProp = RouteProp<any, any>;

const ObjectDetailScreen = () => {
  const route = useRoute<ObjectDetailScreenRouteProp>();
  const navigation = useNavigation<any>();
  const { id } = route.params || { id: "1" };
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getListingDetailsMock(id).then((res: any) => {
      if (res.success) {
        setData(res.data);
        setError(null);
      } else {
        setError(res.error?.message || "Erreur inconnue");
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: "red" }}>{error}</Text></View>;
  }
  if (!data) return null;

  return (
    <View style={[styles.card, data.type === 'FOUND' ? styles.cardFound : styles.cardLost]}>
      <View style={styles.cardRow}>
        <Image source={{ uri: data.photoUrl || 'https://via.placeholder.com/80' }} style={styles.cardImage} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.type}>{data.type === 'FOUND' ? 'Objet trouvé' : 'Objet perdu'}</Text>
          <Text style={styles.category}>Catégorie : {data.category}</Text>
          <Text style={styles.status}>Statut : {data.status}</Text>
        </View>
      </View>
      <Text style={styles.description}>{data.description}</Text>
      <View style={styles.locationBlock}>
        <Text style={styles.locationTitle}>Lieu :</Text>
        <Text>{data.location.address}, {data.location.city}</Text>
        <Text>Lat: {data.location.latitude} / Long: {data.location.longitude}</Text>
      </View>
      <View style={styles.ownerBlock}>
        <Text style={styles.ownerTitle}>Propriétaire :</Text>
        <View style={styles.ownerRow}>
          <Image source={{ uri: data.user.avatar }} style={styles.avatar} />
          <Text>{data.user.firstName} {data.user.lastName}</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => data.user && navigation.navigate('Mes annonces', { screen: 'PublicProfile', params: { userId: data.user.id } })}
          >
            <Text style={styles.profileButtonText}>Voir profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: '#2e7d32', marginLeft: 8 }]}
            onPress={() => data.user && navigation.navigate('Messages', { annonceId: data.id, receiverId: data.user.id })}
          >
            <Text style={styles.profileButtonText}>Contacter</Text>
          </TouchableOpacity>
        </View>
      </View>
         {/* Partie contact supprimée, tout passe par la messagerie interne */}
      <Text style={styles.date}>Créée le : {new Date(data.createdAt).toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    backgroundColor: '#4F8EF7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 10,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 2 },
  type: { fontSize: 15, fontWeight: "bold", color: "#007AFF", marginBottom: 2 },
  category: { fontSize: 15, marginBottom: 2 },
  status: { fontSize: 15, marginBottom: 2 },
  description: { fontSize: 16, marginBottom: 10, color: '#555' },
  locationBlock: { marginBottom: 10 },
  locationTitle: { fontWeight: "bold" },
  ownerBlock: { marginBottom: 10 },
  ownerTitle: { fontWeight: "bold" },
  ownerRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  contactBlock: { marginBottom: 10 },
  contactTitle: { fontWeight: "bold" },
  contactButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 8, marginTop: 8 },
  contactButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  date: { color: "#888", marginTop: 10 },
});

export default ObjectDetailScreen;
