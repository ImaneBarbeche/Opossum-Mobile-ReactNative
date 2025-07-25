// AppNavigator.tsx
// Gestion de la navigation de l'application
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTab from "./MainTab";
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification

// Import des nouveaux écrans
import MyMessageListingsScreen from "../screens/Messaging/MyMessageListingsScreen";
import ListingConversationScreen from "../screens/Messaging/ListingConversationScreen"; // Correction du nom de l'import

// Deep linking config
const linking = {
  prefixes: ["http://192.168.1.7:8081", "https://opossum.app", "opossum://"],
  config: {
    screens: {
      // AuthStack screens
      Login: "login",
      Register: "register",
      ForgotPassword: "forgot-password",
      ResetPassword: {
        path: "reset-password",
        parse: {
          token: (token: string) => `${token}`,
        },
      },
      // Nouvelle partie pour les messages
      MyMessageListings: "mes-messages",
      ListingConversation: {
        path: "listing/:listingId/conversation",
        parse: {
          listingId: (id: string) => Number(id),
        },
      },
    },
  },
};

const AppNavigator = () => {
  const { isAuthenticated, user } = useAuth();

  // Gestion du status utilisateur : si BLOCKED ou DELETED, reste sur AuthStack
  const userStatus = user?.status;
  const canAccessApp = isAuthenticated && userStatus === "ACTIVE";

  return (
    <NavigationContainer linking={linking} fallback={<></>}>
      {canAccessApp ? <MainTab /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
