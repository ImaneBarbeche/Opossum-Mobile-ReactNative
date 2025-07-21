import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import Toast from 'react-native-toast-message';
import { ImageBackground, StyleSheet } from 'react-native';

export default function App() {
  return (

      <AuthProvider>
        <AppNavigator />
        <Toast />
      </AuthProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
