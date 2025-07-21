
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="location-outline" size={64} color="#2e7d32" style={{ marginBottom: 16 }} />
        <Text style={styles.text}>
          J’autorise Retrouv’It à accéder à la géolocalisation de mon téléphone
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.accept]} onPress={handleAccept}>
            <Text style={styles.buttonText}>Je suis d’accord</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.refuse]} onPress={handleRefuse}>
            <Text style={[styles.buttonText, { color: '#2e7d32' }]}>Je refuse !</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#eaf6ea', // On retire le fond pour laisser apparaître le background global
  },
  card: {
    // backgroundColor: '#f8f8e8',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#222',
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    marginHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2e7d32',
  },
  accept: {
    backgroundColor: '#2e7d32',
  },
  refuse: {
    backgroundColor: '#eaf6ea',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LocationPermissionScreen;