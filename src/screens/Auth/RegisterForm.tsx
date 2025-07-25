import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../theme';
import Loader from '../../components/Loader';
import Toast from 'react-native-toast-message';
import { validateRegisterForm } from '../../utils/registerValidation';
import register from '../../services/auth.register';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterForm: React.FC = () => {
  const navigation = useNavigation<any>();
  const { setUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const validation = validateRegisterForm({ firstName, lastName, email, password, confirmPassword, phone });
    if (!validation.valid) {
      Toast.show({ type: 'error', ...(validation.error || { text1: 'Erreur', text2: 'Erreur inconnue.' }) });
      return;
    }
    setLoading(true);
    try {
      const response = await register({ firstName, lastName, email, password, confirmPassword, acceptTerms: true, phone });
      if (response && response.user) {
        Toast.show({
          type: 'success',
          text1: 'Inscription réussie',
          text2: 'Veuillez vérifier votre email pour activer votre compte.',
        });
        // Redirige vers la page de connexion
        navigation.navigate('Login');
      } else {
        Toast.show({ type: 'error', text1: 'Erreur', text2: 'Réponse d’inscription invalide.' });
      }
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: error.message || 'Erreur lors de l’inscription.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderRadius: 16,
      maxWidth: 420,
      width: '90%',
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      alignSelf: 'center',
    }}>
      {loading && <Loader visible={loading} />}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Créer un compte</Text>
      <TextInput
        style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', fontSize: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', fontSize: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', fontSize: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', fontSize: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        placeholder="Téléphone (optionnel)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', fontSize: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={{ width: '100%', borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ccc', fontSize: 16, backgroundColor: 'rgba(255,255,255,0.6)' }}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={{ backgroundColor: '#2e7d32', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, marginTop: 12 }}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Confirmer l'inscription</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.4)' }}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: 16 }}>Annuler l'inscription</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;
