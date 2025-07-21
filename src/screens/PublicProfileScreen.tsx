import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { componentStyles, colors, spacing, typography } from '../theme';
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
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  if (!user) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>Profil introuvable</Text></View>;
  }

  return (
    <View style={[
      componentStyles.card,
      { alignItems: 'center', padding: 24, margin: 24, backgroundColor: colors.white }
    ]}>
      <Image source={{ uri: user.avatar || "https://via.placeholder.com/80" }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 16, backgroundColor: colors.mediumGray }} />
      <Text style={[typography.h2, { marginBottom: 8, color: colors.black }]}>{user.firstName} {user.lastName}</Text>
      <Text style={{ color: colors.darkGray, fontSize: 15 }}>Inscrit le : {new Date(user.createdAt).toLocaleDateString()}</Text>
      {/* Données privées non affichées */}
    </View>
  );
};



export default PublicProfileScreen;
