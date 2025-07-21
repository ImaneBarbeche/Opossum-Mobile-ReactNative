// Écran d'inscription
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { isValidEmail, isStrongPassword, isValidName } from '../../utils/validators';
import Loader from '../../components/Loader';
import Toast from 'react-native-toast-message';
import { register } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import ScreenBackground from '../../components/ScreenBackground';

// Typage navigation pour éviter les erreurs
type AuthStackParamList = {
  LocationPermission: undefined;
  // Ajoute d'autres routes ici si besoin
  Profil: undefined; // Onglet profil dans MainTab
};
const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const { setUser } = useAuth();
  // 1. Déclaration des états pour chaque champ du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Fonction appelée lors de la soumission du formulaire
  const handleRegister = async () => {
	// Validation des champs
	if (!firstName || !lastName || !email || !password || !confirmPassword) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: 'Tous les champs sont obligatoires.',
	  });
	  return;
	}
	if (!isValidName(firstName)) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: 'Le prénom doit comporter entre 1 et 50 caractères.',
	  });
	  return;
	}
	if (!isValidName(lastName)) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: 'Le nom doit comporter entre 1 et 50 caractères.',
	  });
	  return;
	}
	if (!isValidEmail(email)) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: "L'adresse email n'est pas valide.",
	  });
	  return;
	}
	if (!isStrongPassword(password)) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule et un chiffre.',
	  });
	  return;
	}
	if (password !== confirmPassword) {
	  Toast.show({
		type: 'error',
		text1: 'Erreur',
		text2: 'Les mots de passe ne correspondent pas.',
	  });
	  return;
	}
	setLoading(true);
	try {
	  console.log('register called', { firstName, lastName, email, password, confirmPassword });
	  const response = await register({ firstName, lastName, email, password, confirmPassword, acceptTerms: true });
	  console.log('register response', response);
	if (response && response.user) {
	  setUser({
		...response.user,
		isActive: true,
		role: response.user.role || 'USER',
		createdAt: new Date(),
		updatedAt: new Date(),
	  });
	  Toast.show({ type: 'success', text1: 'Inscription réussie', text2: 'Bienvenue !' });
	} else {
	  Toast.show({ type: 'error', text1: 'Erreur', text2: 'Réponse d’inscription invalide.' });
	}
	} catch (error: any) {
	  Toast.show({ type: 'error', text1: 'Erreur', text2: error.message || 'Erreur lors de l’inscription.' });
	} finally {
	  setLoading(false);
	}
  };

  // 3. Rendu du formulaire
  return (
	<ScreenBackground>
	  <View style={styles.container}>
		{loading && <Loader visible={loading} />}
		<Text style={styles.title}>Créer un compte</Text>
		{/* Champ prénom */}
		<TextInput
		  style={styles.input}
		  placeholder="Prénom"
		  value={firstName}
		  onChangeText={setFirstName}
		/>
		{/* Champ nom */}
		<TextInput
		  style={styles.input}
		  placeholder="Nom"
		  value={lastName}
		  onChangeText={setLastName}
		/>
		{/* Champ email */}
		<TextInput
		  style={styles.input}
		  placeholder="Email"
		  value={email}
		  onChangeText={setEmail}
		  autoCapitalize="none"
		  keyboardType="email-address"
		/>
		{/* Champ mot de passe */}
		<TextInput
		  style={styles.input}
		  placeholder="Mot de passe"
		  value={password}
		  onChangeText={setPassword}
		  secureTextEntry
		/>
		{/* Confirmation mot de passe */}
		<TextInput
		  style={styles.input}
		  placeholder="Confirmer le mot de passe"
		  value={confirmPassword}
		  onChangeText={setConfirmPassword}
		  secureTextEntry
		/>
		{/* Bouton s'inscrire */}
		<TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
		  <Text style={styles.buttonText}>Confirmer l'inscription</Text>
		</TouchableOpacity>
		{/* Bouton annuler */}
		<TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={loading}>
		  <Text style={styles.cancelButtonText}>Annuler l'inscription</Text>
		</TouchableOpacity>
	  </View>
	</ScreenBackground>
  );
};

// 4. Styles de base pour le formulaire
const styles = StyleSheet.create({
  bgContainer: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
  },
  container: {
	flex: 0,
	justifyContent: 'center',
	alignItems: 'center',
	padding: 24,
	backgroundColor: 'rgba(255,255,255,0.85)',
	borderRadius: 16,
	maxWidth: 420,
	width: '90%',
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.15,
	shadowRadius: 8,
	elevation: 4,
  },
  title: {
	fontSize: 24,
	fontWeight: 'bold',
	marginBottom: 24,
  },
  input: {
	width: '100%',
	borderRadius: 8,
	padding: 12,
	marginBottom: 12,
	borderWidth: 1,
	borderColor: '#ccc',
	fontSize: 16,
	backgroundColor: 'rgba(255,255,255,0.6)',
  },
  button: {
	backgroundColor: '#2e7d32',
	borderRadius: 8,
	paddingVertical: 12,
	paddingHorizontal: 32,
	marginTop: 12,
  },
  buttonText: {
	color: '#fff',
	fontWeight: 'bold',
	fontSize: 16,
  },
  cancelButton: {
	marginTop: 8,
	paddingVertical: 10,
	paddingHorizontal: 32,
	borderRadius: 8,
	backgroundColor: 'rgba(255,255,255,0.4)',
  },
  cancelButtonText: {
	color: '#2e7d32',
	fontWeight: 'bold',
	fontSize: 16,
  },
});

export default RegisterScreen;