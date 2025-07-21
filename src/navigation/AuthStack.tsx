
// Routes d'authentification
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import LocationPermissionScreen from "../screens/Auth/LocationPermissionScreen";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    {/* <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} /> */}
    <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
  </Stack.Navigator>
);

export default AuthStack;
