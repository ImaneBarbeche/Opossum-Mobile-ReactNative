import React from "react";
import { Platform, View, Text } from "react-native";

interface MapMapViewProps {
  MapView: any;
  Marker: any;
  userLocation: { latitude: number; longitude: number };
  listings: any[];
}

const MapMapView: React.FC<MapMapViewProps> = ({ MapView, Marker, userLocation, listings }) => {
  if (Platform.OS === 'web' || !MapView) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>La carte n'est pas disponible sur le web.</Text></View>;
  }
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 24,
      margin: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={userLocation}
          title="Vous"
          pinColor="#4F8EF7"
        />
        {listings.map(obj => (
          obj.latitude && obj.longitude ? (
            <Marker
              key={obj.id}
              coordinate={{ latitude: obj.latitude, longitude: obj.longitude }}
              title={obj.title}
              pinColor={obj.type === "LOST" ? "#E9446A" : "#4EC97B"}
              // TODO: custom marker icon or avatar
            />
          ) : null
        ))}
      </MapView>
    </View>
  );
};

export default MapMapView;
