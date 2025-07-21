// Import des modules React et des hooks nécessaires
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from "react-native";
import { colors, spacing, typography, componentStyles } from '../../theme';
import { Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import Loader from '../../components/Loader';
import ScreenBackground from '../../components/ScreenBackground';

import { validateLoginForm } from '../../utils/loginValidation';

/**
 * Écran de connexion (LoginScreen)
 * Permet à l'utilisateur de se connecter ou d'aller vers l'inscription
 */
const LoginScreen = ({ navigation }: any) => {
  // Récupère la fonction login et l'état loading depuis le contexte d'auth
  const { login, loading } = useAuth();
  // État local pour stocker l'email saisi
  const [email, setEmail] = useState("");
  // État local pour stocker le mot de passe saisi
  const [password, setPassword] = useState("");

  // Fonction pour gérer la connexion
  const handleLogin = async () => {
	const validation = validateLoginForm({ email, password });
	if (!validation.valid) {
	  Toast.show({ type: 'error', ...(validation.error || { text1: 'Erreur', text2: 'Erreur inconnue.' }) });
	  return;
	}
	try {
	  await login({ email, password });
	} catch (error: any) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: error?.message || 'Impossible de se connecter.',
	  });
	}
  };

  return (
	<ScreenBackground>
	  {loading && <Loader visible={loading} />}
	  <View style={{
		backgroundColor: 'rgba(255,255,255,0.85)',
		borderRadius: 24,
		padding: spacing.xl,
		shadowColor: colors.black,
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		alignItems: 'center',
		width: '90%',
		maxWidth: 400,
		alignSelf: 'center',
	  }}>
		<Image source={require('../../../assets/icons/icone.png')} style={{ width: 80, height: 80, marginBottom: spacing.md }} resizeMode="contain" />
		<Text style={{ fontSize: 32, fontWeight: 'bold', color: colors.black, textAlign: 'center', marginBottom: spacing.lg, fontFamily: 'sans-serif' }}>Retrouv'It</Text>
		<View style={{ width: '100%', alignSelf: 'center' }}>
		  {/* Champ email */}
		  <Text style={{ ...(typography.body || {}), marginBottom: spacing.sm }}>Email :</Text>
		  <TextInput
			style={{
			  backgroundColor: colors.primaryLight,
			  borderRadius: 10,
			  padding: spacing.md,
			  marginBottom: spacing.md,
			  fontSize: 16,
			  borderWidth: 1,
			  borderColor: colors.mediumGray,
			}}
			placeholder="mon.email@mail.com"
			value={email}
			onChangeText={setEmail}
			autoCapitalize="none"
			keyboardType="email-address"
		  />
		  {/* Champ mot de passe */}
		  <Text style={{ ...(typography.body || {}), marginBottom: spacing.sm }}>Mot de passe :</Text>
		  <TextInput
			style={{
			  backgroundColor: colors.primaryLight,
			  borderRadius: 10,
			  padding: spacing.md,
			  marginBottom: spacing.md,
			  fontSize: 16,
			  borderWidth: 1,
			  borderColor: colors.mediumGray,
			}}
			placeholder="************"
			value={password}
			onChangeText={setPassword}
			secureTextEntry
		  />
		  {/* Lien mot de passe oublié : navigation vers l'écran dédié */}
		  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
			<Text style={{ color: colors.primary, marginTop: 8, marginBottom: 8, textAlign: 'right' }}>Mot de passe oublié ?</Text>
		  </TouchableOpacity>
		  {/* Bouton Se connecter */}
		  <TouchableOpacity
			style={{
			  backgroundColor: colors.black,
			  borderRadius: 24,
			  paddingVertical: spacing.sm,
			  marginTop: spacing.sm,
			  marginBottom: spacing.sm,
			  alignItems: 'center',
			  shadowColor: colors.black,
			  shadowOpacity: 0.2,
			  shadowRadius: 4,
			  elevation: 2,
			}}
			onPress={handleLogin}
			disabled={loading}
		  >
			<Text style={{ color: colors.buttonTextPrimary, ...(typography.button || {}), fontWeight: 'bold' }}>Se connecter</Text>
		  </TouchableOpacity>
		  {/* Bouton S'inscrire */}
		  <TouchableOpacity
			style={{
			  backgroundColor: colors.black,
			  borderRadius: 24,
			  paddingVertical: spacing.sm,
			  marginTop: spacing.sm,
			  marginBottom: spacing.sm,
			  alignItems: 'center',
			  shadowColor: colors.black,
			  shadowOpacity: 0.2,
			  shadowRadius: 4,
			  elevation: 2,
			}}
			onPress={() => navigation.navigate("Register")}
			disabled={loading}
		  >
			<Text style={{ color: colors.buttonTextPrimary, ...(typography.button || {}), fontWeight: 'bold' }}>S'inscrire</Text>
		  </TouchableOpacity>
		</View>
	  </View>
	</ScreenBackground>
  );
};



export default LoginScreen;