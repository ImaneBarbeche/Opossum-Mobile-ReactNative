import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface MapListViewProps {
  listings: any[];
}

import { useNavigation } from '@react-navigation/native';

const MapListView: React.FC<MapListViewProps> = ({ listings }) => {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.lightGray, paddingTop: 64 }} edges={["top"]}>
      {listings.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 32, color: colors.darkGray }}>Aucune annonce trouvée.</Text>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Mes annonces', { screen: 'ObjectDetail', params: { id: item.id } })}
              activeOpacity={0.8}
            >
              <View style={{ backgroundColor: colors.white, margin: 8, borderRadius: 12, padding: 16, shadowColor: colors.black, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
                <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 16 }}>{item.title}</Text>
                <Text style={{ color: colors.darkGray, marginTop: 4 }}>{item.description}</Text>
                <Text style={{ color: colors.mediumGray, marginTop: 4, fontSize: 13 }}>{item.city} • {item.category}</Text>
                {item.distance !== undefined && (
                  <Text style={{ color: colors.success, marginTop: 4, fontSize: 13 }}>{item.distance.toFixed(1)} km</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default MapListView;
