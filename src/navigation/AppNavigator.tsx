import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTab from "./MainTab";
import { useAuth } from "../context/AuthContext"; // Import du contexte d'authentification

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  // Deep linking config
  const linking = {
    prefixes: ["exp://192.168.1.225:8081", "https://opossum.app", "opossum://"],
    config: {
      screens: {
        // AuthStack screens
        Login: "login",
        Register: "register",
        VerifyEmail: "verify-email/:token",
        ForgotPassword: "forgot-password",
        ResetPassword: {
          path: "auth/reset-password",
          parse: {
            token: (token: string) => token,
          },
        },
        // MainTab screens (déclarés à la racine)
        Listing: "listing",
        ObjectDetail: "object/:id",
        EditListing: "edit/:id",
        PublicProfile: "public-profile/:userId",
        Carte: "map",
        Ajouter: "add",
        Messages: "messages",
        Profil: "profile",
      },
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<></>}>
      {isAuthenticated ? <MainTab /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
