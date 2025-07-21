// Écran de réinitialisation du mot de passe
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { resetPassword } from '../../services/auth.service';
import { colors, spacing, typography, componentStyles } from '../../theme';
import { StyleSheet } from 'react-native';
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

const ResetPasswordScreen = ({ route, navigation }: any) => {
  const { token } = route.params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      Alert.alert('Succès', 'Votre mot de passe a été réinitialisé.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <View style={styles.card}>
        <Text style={styles.title}>Réinitialiser le mot de passe</Text>
        <Text style={styles.subtitle}>Choisissez un nouveau mot de passe.</Text>
        <TextInput
          placeholder="Nouveau mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={colors.darkGray}
        />
        <TextInput
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={colors.darkGray}
        />
        <View style={styles.buttonWrapper}>
          <Button
            title={loading ? "Envoi..." : "Réinitialiser"}
            onPress={handleReset}
            disabled={loading || !password || !confirm}
            color={colors.primary}
          />
        </View>
      </View>
    </ScreenBackground>
  );
};

export default ResetPasswordScreen;
