// Import des modules React et des hooks nécessaires
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import { colors, spacing, typography, componentStyles } from '../../theme';
import { Image } from 'react-native';
import Loader from '../../components/Loader';
import { useAuth } from "../../context/AuthContext";
import Toast from 'react-native-toast-message';
import ScreenBackground from '../../components/ScreenBackground';


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
	if (!email || !password) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: 'Veuillez saisir votre email et mot de passe.',
	  });
	  return;
	}
	// Optionnel : validation email
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: "L'adresse email n'est pas valide.",
	  });
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
	  <View style={styles.card}>
		<Image source={require('../../../assets/icons/icone.png')} style={styles.logoImg} resizeMode="contain" />
		<Text style={styles.logoText}>Retrouv'It</Text>
		<View style={styles.form}>
		  {/* Champ email */}
		  <Text style={styles.label}>Email :</Text>
		  <TextInput
			style={styles.input}
			placeholder="mon.email@mail.com"
			value={email}
			onChangeText={setEmail}
			autoCapitalize="none"
			keyboardType="email-address"
		  />
		  {/* Champ mot de passe */}
		  <Text style={styles.label}>Mot de passe :</Text>
		  <TextInput
			style={styles.input}
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
		  <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
			<Text style={styles.buttonText}>Se connecter</Text>
		  </TouchableOpacity>
		  {/* Bouton S'inscrire */}
		  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Register")} disabled={loading}> 
			<Text style={styles.buttonText}>S'inscrire</Text>
		  </TouchableOpacity>
		</View>
	  </View>
	</ScreenBackground>
  );
};

const styles = StyleSheet.create({
  bgContainer: {
	flex: 1,
	backgroundColor: colors.primaryLight, 
	justifyContent: 'center',
	alignItems: 'center',
	padding: spacing.md,
  },
  card: {
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
  },
  logoImg: {
	width: 80,
	height: 80,
	marginBottom: spacing.md,
  },
  logoText: {
	fontSize: 32,
	fontWeight: 'bold',
	color: colors.black,
	textAlign: 'center',
	marginBottom: spacing.lg,
	fontFamily: 'sans-serif',
  },
  logo: {
	fontSize: 32,
	fontWeight: 'bold',
	marginBottom: spacing.lg,
	color: colors.primary,
	textAlign: 'center',
  },
  form: {
	width: '100%',
	alignSelf: 'center',
  },
  label: {
	...(typography.body || {}),
	marginBottom: spacing.sm,
  },
  input: {
	backgroundColor: colors.primaryLight,
	borderRadius: 10,
	padding: spacing.md,
	marginBottom: spacing.md,
	fontSize: 16,
	borderWidth: 1,
	borderColor: colors.mediumGray,
  },
  button: {
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
  },
  buttonText: {
	color: colors.buttonTextPrimary,
	...(typography.button || {}),
	fontWeight: 'bold',
  },
  // Styles spécifiques pour les boutons de la modale
  modalButton: {
	backgroundColor: colors.primary,
	borderRadius: 8,
	paddingVertical: spacing.md,
	paddingHorizontal: spacing.lg,
	marginTop: spacing.sm,
	marginBottom: spacing.sm,
	alignItems: 'center',
	minWidth: 120,
  },
  modalButtonText: {
	color: colors.buttonTextPrimary,
	fontSize: 16,
	fontWeight: 'bold',
	textAlign: 'center',
  },
  modalOverlay: {
	flex: 1,
	backgroundColor: 'rgba(0,0,0,0.3)',
	justifyContent: 'center',
	alignItems: 'center',
  },
  modalContent: {
	backgroundColor: '#fff',
	borderRadius: 12,
	padding: 24,
	width: '85%',
	alignItems: 'center',
	elevation: 4,
  },
  modalTitle: {
	fontSize: 18,
	fontWeight: 'bold',
	marginBottom: 16,
	color: colors.primary,
  },
  modalInput: {
	backgroundColor: colors.white,
	borderRadius: 10,
	paddingVertical: spacing.md,
	paddingHorizontal: spacing.xl,
	marginBottom: spacing.lg,
	fontSize: 16,
	borderWidth: 2,
	borderColor: colors.primary,
	width: '100%',
	minWidth: 260,
	maxWidth: 400,
	alignSelf: 'center',
	shadowColor: colors.primary,
	shadowOpacity: 0.08,
	shadowRadius: 4,
	elevation: 1,
  },
});

export default LoginScreen;