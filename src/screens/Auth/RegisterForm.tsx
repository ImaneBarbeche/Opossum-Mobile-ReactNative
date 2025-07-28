import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import registerFormStyles from '../../theme/registerFormStyles';
import Loader from '../../components/Loader';
import Toast from 'react-native-toast-message';
import { validateRegisterForm } from '../../utils/registerValidation';
import register from '../../services/auth.register';
import { useNavigation } from '@react-navigation/native';

const RegisterForm: React.FC = () => {
  const navigation = useNavigation<any>();
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
    <View style={registerFormStyles.container}>
      {loading && <Loader visible={loading} />}
      <Text style={registerFormStyles.title}>Créer un compte</Text>
      <TextInput
        style={registerFormStyles.input}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={registerFormStyles.input}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={registerFormStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={registerFormStyles.input}
        placeholder="Téléphone (optionnel)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={registerFormStyles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={registerFormStyles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={registerFormStyles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={registerFormStyles.buttonText}>Confirmer l'inscription</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={registerFormStyles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={registerFormStyles.cancelButtonText}>Annuler l'inscription</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;
