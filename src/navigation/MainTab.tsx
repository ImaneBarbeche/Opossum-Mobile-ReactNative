import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";

import ListingStack from "./ListingStack";
import MapScreen from "../screens/MapScreen";
import MessagingStack from "./MessagingStack";
import ProfileScreen from "../screens/ProfileScreen";
import CreateListingScreen from "../screens/CreateListingScreen";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const insets = useSafeAreaInsets();
  const { token, user } = useAuth();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2e7d32",
        tabBarInactiveTintColor: "#222",
        tabBarStyle: {
          backgroundColor: "#d6ecd8",
          borderTopWidth: 0.5,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Mes annonces") {
            return (
              <FontAwesome5 name="clipboard-list" size={24} color={color} />
            );
          }
          if (route.name === "Carte") {
            return <Feather name="map-pin" size={24} color={color} />;
          }
          if (route.name === "Ajouter") {
            return (
              <Ionicons
                name="add-circle"
                size={40}
                color={focused ? "#2e7d32" : "#222"}
                style={{ marginTop: -8 }}
              />
            );
          }
          if (route.name === "Messages") {
            return <Feather name="send" size={24} color={color} />;
          }
          if (route.name === "Profil") {
            return <Feather name="user" size={24} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="Mes annonces" component={ListingStack} />
      <Tab.Screen name="Carte" component={MapScreen} />
      <Tab.Screen
        name="Ajouter"
        component={CreateListingScreen}
        options={{
          tabBarLabel: "",
        }}
      />
      <Tab.Screen name="Messages">
        {(props) => (
          <MessagingStack
            {...props}
            screenProps={{ token, myUserId: user?.id || "" }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTab;
