import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

// Écran de vérification email via token reçu en deep link
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { token: string };
};

const VerifyEmailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList, 'VerifyEmail'>>();
  // Récupère le token passé en paramètre
  const token = (route as any).params?.token;

  useEffect(() => {
    if (!token) {
      Toast.show({ type: 'error', text1: 'Token manquant', text2: 'Lien de vérification invalide.' });
      navigation.navigate('Login');
      return;
    }
    // Ici, tu peux appeler ton API pour vérifier l'email avec le token
    // Exemple :
    // verifyEmail(token).then(...)
    // Pour la démo, on affiche juste un message
    Toast.show({ type: 'success', text1: 'Email vérifié !', text2: 'Vous pouvez vous connecter.' });
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification de l'email...</Text>
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 24 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', margin: 24, textAlign: 'center' },
});

export default VerifyEmailScreen;
