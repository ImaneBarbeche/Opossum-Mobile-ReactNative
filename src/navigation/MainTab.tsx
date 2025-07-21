// Navigation principale après login
import React from "react";
// Import du créateur de barre d'onglets
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Import des icônes Expo (pour personnaliser chaque onglet)
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

// Import des écrans à afficher dans les onglets
import ListingStack from "./ListingStack";
import MapScreen from "../screens/MapScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListingScreen from "../screens/CreateListingScreen";

// Création du composant de navigation à onglets
const Tab = createBottomTabNavigator();

const MainTab = () => (
  <Tab.Navigator
      // screenOptions permet de personnaliser l'apparence et le comportement de chaque onglet
    screenOptions={({ route }) => ({
      headerShown: false, // Pas de header pour les onglets
      tabBarActiveTintColor: '#2e7d32', // vert pour l'onglet actif
      tabBarInactiveTintColor: '#222', // gris pour les onglets inactifs
      tabBarStyle: {
        backgroundColor: '#d6ecd8', // vert très clair
        borderTopWidth: 0.5,
        height: 65, // Hauteur de la barre d'onglets
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 4,
      },
            // Définition de l'icône pour chaque onglet selon son nom
      tabBarIcon: ({ color, size, focused }) => {
        if (route.name === 'Mes annonces') {
                    // Onglet "Mes annonces" : icône clipboard-list
          return <FontAwesome5 name="clipboard-list" size={24} color={color} />;
        }
        if (route.name === 'Carte') {
                    // Onglet "Carte" : icône map-pin
          return <Feather name="map-pin" size={24} color={color} />;
        }
        if (route.name === 'Ajouter') {
                    // Onglet central "Ajouter" : gros bouton +
          return <Ionicons name="add-circle" size={36} color={focused ? '#2e7d32' : '#222'} style={{ marginTop: -8 }} />;
        }
        if (route.name === 'Messages') {
                    // Onglet "Messages" : icône send
          return <Feather name="send" size={24} color={color} />;
        }
        if (route.name === 'Profil') {
                    // Onglet "Profil" : icône user
          return <Feather name="user" size={24} color={color} />;
        }
        return null;
      },
    })}
  >
        {/* Définition de chaque onglet avec son écran associé */}
    <Tab.Screen name="Mes annonces" component={ListingStack} />
    <Tab.Screen name="Carte" component={MapScreen} />
    <Tab.Screen name="Ajouter" component={CreateListingScreen}
      options={{
        tabBarLabel: '', // Pas de label sous le bouton +
        tabBarIcon: ({ color, size, focused }) => (
                    // Icône + plus grande et centrée
          <Ionicons name="add-circle" size={48} color={focused ? '#2e7d32' : '#222'} style={{ marginTop: -16 }} />
        ),
      }}
    />
    <Tab.Screen name="Messages" component={ChatScreen} />
    <Tab.Screen name="Profil" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MainTab;
