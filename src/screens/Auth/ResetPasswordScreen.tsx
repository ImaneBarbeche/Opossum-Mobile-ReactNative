
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, componentStyles } from '../../theme';
import { AUTH_ENDPOINTS } from '../../config/api';

const ResetPasswordScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Récupère le token passé en paramètre (query param ou path)
  const token = (route.params as any)?.token;
  React.useEffect(() => {
  }, [route.params, token]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Lien de réinitialisation invalide ou expiré.' });
      return;
    }
    if (!newPassword || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Veuillez remplir les deux champs.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(AUTH_ENDPOINTS.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result?.error?.message || 'Erreur lors de la réinitialisation.');
      }
      Toast.show({ type: 'success', text1: 'Mot de passe réinitialisé', text2: 'Vous pouvez vous connecter.' });
      navigation.navigate('Login' as never);
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: e.message || 'Erreur inconnue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[componentStyles.card, { margin: 24, padding: 24 }]}> 
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Réinitialiser le mot de passe</Text>
      {!token ? (
        <Text style={{ color: colors.error, textAlign: 'center' }}>Lien invalide ou expiré.</Text>
      ) : (
        <>
          <TextInput
            placeholder="Nouveau mot de passe"
            secureTextEntry
            style={{ borderBottomWidth: 1, marginBottom: 16, padding: 8 }}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Confirmer le mot de passe"
            secureTextEntry
            style={{ borderBottomWidth: 1, marginBottom: 24, padding: 8 }}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={{ backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center' }}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>
              {loading ? 'En cours...' : 'Valider'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ResetPasswordScreen;