import React from "react";
import { View, Text, FlatList } from "react-native";
import { componentStyles, colors } from '../theme';

interface MapListViewProps {
  listings: any[];
}

const MapListView: React.FC<MapListViewProps> = ({ listings }) => (
  <View style={[componentStyles.container, { backgroundColor: colors.lightGray }]}> 
    {listings.length === 0 ? (
      <Text style={{ textAlign: 'center', marginTop: 32, color: colors.darkGray }}>Aucune annonce trouvée.</Text>
    ) : (
      <FlatList
        data={listings}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.white, margin: 8, borderRadius: 12, padding: 16, shadowColor: colors.black, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }}>
            <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 16 }}>{item.title}</Text>
            <Text style={{ color: colors.darkGray, marginTop: 4 }}>{item.description}</Text>
            <Text style={{ color: colors.mediumGray, marginTop: 4, fontSize: 13 }}>{item.city} • {item.category}</Text>
            {item.distance !== undefined && (
              <Text style={{ color: colors.success, marginTop: 4, fontSize: 13 }}>{item.distance.toFixed(1)} km</Text>
            )}
          </View>
        )}
      />
    )}
  </View>
);

export default MapListView;
