import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingScreen from "../screens/Listings/ListingScreen";
import ObjectDetailScreen from "../screens/Listings/ObjectDetailScreen";
import PublicProfileScreen from "../screens/Profile/PublicProfileScreen";
// Placeholder pour EditListingScreen
const EditListingScreen = () => null;

const Stack = createStackNavigator();

const ListingStack = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Listing" component={ListingScreen} />
    <Stack.Screen name="ObjectDetail" component={ObjectDetailScreen} />
    <Stack.Screen name="EditListing" component={EditListingScreen} />
    <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
  </Stack.Navigator>
);

export default ListingStack;
