// Écran de mot de passe oublié
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
// Définition des types de navigation pour l'auth stack
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { forgotPassword } from '../../services/auth.service';
import { colors, spacing, typography, componentStyles } from '../../theme';
import ScreenBackground from '../../components/ScreenBackground';

const styles = StyleSheet.create({
  container: {
	...componentStyles.centerContainer,
	padding: spacing.lg,
	backgroundColor: colors.primaryLight,
  },
  card: {
	...componentStyles.card,
	width: '100%',
	maxWidth: 400,
	alignSelf: 'center',
	padding: spacing.xl,
	backgroundColor: colors.white,
  },
  title: {
	...typography.h2,
	color: colors.primary,
	textAlign: 'center',
	marginBottom: spacing.md,
  },
  subtitle: {
	...typography.body,
	color: colors.darkGray,
	textAlign: 'center',
	marginBottom: spacing.lg,
  },
  input: {
	backgroundColor: colors.primaryLight,
	borderRadius: 10,
	padding: spacing.md,
	marginBottom: spacing.md,
	fontSize: 16,
	borderWidth: 1,
	borderColor: colors.mediumGray,
	color: colors.black,
  },
  buttonWrapper: {
	marginTop: spacing.lg,
	marginBottom: spacing.sm,
  },
});

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
	setLoading(true);
	try {
	  const res = await forgotPassword(email);
	  Alert.alert('Succès', res.message);
	} catch (err: any) {
	  Alert.alert('Erreur', err.message || "Erreur lors de la demande de réinitialisation");
	} finally {
	  setLoading(false);
	}
  };

  return (
  <ScreenBackground>
	<View style={styles.card}>
	  <Text style={styles.title}>Mot de passe oublié</Text>
	  <Text style={styles.subtitle}>Entrez votre email pour recevoir le lien de réinitialisation.</Text>
	  <TextInput
		placeholder="Email"
		value={email}
		onChangeText={setEmail}
		autoCapitalize="none"
		keyboardType="email-address"
		style={styles.input}
		placeholderTextColor={colors.darkGray}
	  />
	  <View style={styles.buttonWrapper}>
		<Button
		  title={loading ? "Envoi..." : "Envoyer le lien"}
		  onPress={handleForgot}
		  disabled={loading || !email}
		  color={colors.primary}
		/>
	  </View>
  <View style={{ marginTop: 16 }}>
	<Button
	  title="Aller à l'écran de reset avec un token"
	  onPress={() => {
		navigation.navigate('ResetPassword', { token: 'VOTRE_TOKEN' });
	  }}
	  color="#888"
	/>
  </View>
	</View>
  </ScreenBackground>
  );
};

export default ForgotPasswordScreen;