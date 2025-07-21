
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { View, Text, TouchableOpacity } from 'react-native';
import { componentStyles, colors, spacing, typography } from '../../theme';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Typage navigation pour éviter l'erreur TS7031
type RootStackParamList = {
  Accueil: undefined;
  MainTab: undefined;
  // Ajoute d'autres routes ici si besoin
};
type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};


const LocationPermissionScreen: React.FC<Props> = () => {
  const { setIsAuthenticated } = useAuth();
  // Fonction appelée si l'utilisateur accepte
  const handleAccept = async () => {
    await Location.requestForegroundPermissionsAsync();
    setIsAuthenticated(true);
  };

  // Fonction appelée si l'utilisateur refuse
  const handleRefuse = () => {
    setIsAuthenticated(true);
  };

  return (
    <View style={[componentStyles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
      <View style={{
        borderRadius: 16,
        padding: 28,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.black,
        width: '85%',
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: colors.white,
      }}>
        <Ionicons name="location-outline" size={64} color={colors.success} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 24, color: colors.black, fontWeight: '500' }}>
          J’autorise Retrouv’It à accéder à la géolocalisation de mon téléphone
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 14,
              marginHorizontal: 6,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: colors.success,
            }}
            onPress={handleAccept}
          >
            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>Je suis d’accord</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 14,
              marginHorizontal: 6,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: colors.lightGray,
              borderWidth: 2,
              borderColor: colors.success,
            }}
            onPress={handleRefuse}
          >
            <Text style={{ color: colors.success, fontWeight: 'bold', fontSize: 16 }}>Je refuse !</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};



export default LocationPermissionScreen;