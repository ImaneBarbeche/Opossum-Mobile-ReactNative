import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { mockUsers } from "../services/mockApi";

type PublicProfileRouteParams = { userId: string };
const PublicProfileScreen = () => {
  const route = useRoute<RouteProp<{ params: PublicProfileRouteParams }, 'params'>>();
  const { userId } = route.params;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    // Simule un appel API pour le profil public
    const found = mockUsers.find(u => u.id === userId);
    setTimeout(() => {
      setUser(found || null);
      setLoading(false);
    }, 500);
  }, [userId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4F8EF7" /></View>;
  }
  if (!user) {
    return <View style={styles.center}><Text style={{ color: "red" }}>Profil introuvable</Text></View>;
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: user.avatar || "https://via.placeholder.com/80" }} style={styles.avatar} />
      <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.date}>Inscrit le : {new Date(user.createdAt).toLocaleDateString()}</Text>
      {/* Données privées non affichées */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 24,
    margin: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  date: {
    color: '#888',
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PublicProfileScreen;
