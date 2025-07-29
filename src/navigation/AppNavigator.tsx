import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack";
import MainTab from "./MainTab";
import { useAuth } from "../context/AuthContext";

// Deep linking config
const linking = {
  prefixes: ["http://192.168.1.7:8081", "https://opossum.app", "opossum://"],
  config: {
    screens: {
      Login: "login",
      Register: "register",
      ForgotPassword: "forgot-password",
      ResetPassword: {
        path: "reset-password",
        parse: {
          token: (token: string) => `${token}`,
        },
      },
      MyMessageListings: "mes-messages",
      ConversationScreen: {
        path: "conversation/:conversationId",
        parse: {
          conversationId: (id: string) => `${id}`,
        },
      },
    },
  },
};

const AppNavigator = () => {
  const { isAuthenticated, user } = useAuth();
  const userStatus = user?.status;
  const canAccessApp = isAuthenticated && userStatus === "ACTIVE";

  return (
    <NavigationContainer linking={linking} fallback={<></>}>
      {canAccessApp ? <MainTab /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
