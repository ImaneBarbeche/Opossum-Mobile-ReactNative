import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { componentStyles, colors, spacing, typography } from "../../theme";

type Annonce = {
  listingId: number;
  titre: string;
  ownerId: number;
};

type MyMessageListingsScreenProps = {
  token: string;
  myUserId: string;
  useMock?: boolean;
  navigation?: any;
  route?: any;
};

// MOCK DATA : Annonces où l'utilisateur a écrit un message
const MOCK_ANNONCES: Annonce[] = [
  { listingId: 1, titre: "Vélo électrique", ownerId: 101 },
  { listingId: 2, titre: "Appart T2 centre ville", ownerId: 202 },
];

export default function MyMessageListingsScreen({
  token,
  myUserId,
  useMock = true,
  navigation,
}: MyMessageListingsScreenProps) {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = navigation;

  useEffect(() => {
    if (useMock) {
      setTimeout(() => {
        setAnnonces(MOCK_ANNONCES);
        setLoading(false);
      }, 500);
    } else {
      fetch(
        `http://localhost:8080/api/my-annonce-messages?userId=${myUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setAnnonces(data);
          setLoading(false);
        });
    }
  }, [useMock, token, myUserId]);

  if (loading)
    return (
      <View
        style={[
          componentStyles.container,
          { backgroundColor: colors.lightGray, paddingTop: 64 },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 32 }}
        />
      </View>
    );

  return (
    <View
      style={[
        componentStyles.container,
        { backgroundColor: colors.lightGray, paddingTop: 64 },
      ]}
    >
      <Text
        style={[
          typography.h1,
          {
            color: colors.primary,
            marginBottom: spacing.md,
            alignSelf: "center",
          },
        ]}
      >
        Mes messages
      </Text>
      <FlatList
        data={annonces}
        keyExtractor={(item) => item.listingId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              nav.navigate("AnnonceConversation", {
                listingId: item.listingId,
                titre: item.titre,
              })
            }
            style={[
              componentStyles.card,
              {
                padding: 10,
                marginBottom: 16,
                flexDirection: "column",
                backgroundColor: "#FDF6E3",
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              <Text style={[typography.h3, { color: colors.black, flex: 1 }]}>
                {item.titre}
              </Text>
              <Text
                style={[
                  typography.body,
                  { color: colors.darkGray, marginBottom: 8 },
                ]}
              >
                Propriétaire ID: {item.ownerId}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 32 }}>
            Aucune annonce trouvée.
          </Text>
        }
      />
    </View>
  );
}
