// Écran de mot de passe oublié
import React, { useState } from 'react';
// (navigation supprimée, types inutiles retirés)
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { forgotPassword } from '../../services/auth.password';
import { colors, spacing, typography, componentStyles } from '../../theme';
import ScreenBackground from '../../components/ScreenBackground';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
	setLoading(true);
	try {
	  const res = await forgotPassword(email);
	  Toast.show({ type: 'success', text1: 'Succès', text2: res.message });
	} catch (err: any) {
	  Toast.show({ type: 'error', text1: 'Erreur', text2: err.message || "Erreur lors de la demande de réinitialisation" });
	} finally {
	  setLoading(false);
	}
  };

  return (
  <ScreenBackground>
	<View style={[componentStyles.card, { width: '100%', maxWidth: 400, alignSelf: 'center', padding: spacing.xl, backgroundColor: colors.white }]}> 
	  <Text style={[typography.h2, { color: colors.primary, textAlign: 'center', marginBottom: spacing.md }]}>Mot de passe oublié</Text>
	  <Text style={[typography.body, { color: colors.darkGray, textAlign: 'center', marginBottom: spacing.lg }]}>Entrez votre email pour recevoir le lien de réinitialisation.</Text>
	  <TextInput
		placeholder="Email"
		value={email}
		onChangeText={setEmail}
		autoCapitalize="none"
		keyboardType="email-address"
		style={[componentStyles.input, { marginBottom: spacing.md }]}
		placeholderTextColor={colors.darkGray}
	  />
	  <View style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
		<Button
		  title={loading ? "Envoi..." : "Envoyer le lien"}
		  onPress={handleForgot}
		  disabled={loading || !email}
		  color={colors.primary}
		/>
	  </View>
	</View>
  </ScreenBackground>
  );
};

export default ForgotPasswordScreen;