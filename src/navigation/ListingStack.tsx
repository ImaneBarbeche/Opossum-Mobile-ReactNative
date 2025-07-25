import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingScreen from "../screens/ListingScreen";
import ObjectDetailScreen from "../screens/ObjectDetailScreen";
import PublicProfileScreen from "../screens/PublicProfileScreen";
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
