import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { colors } from '../theme';

interface ProfileEditFormProps {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  avatar: string;
  setAvatar: (v: string) => void;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  firstName, setFirstName, lastName, setLastName, phone, setPhone, avatar, setAvatar, saving, onSave, onCancel,
  currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword
}) => (
  <View>
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Mot de passe actuel</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={currentPassword}
      onChangeText={setCurrentPassword}
      placeholder="Mot de passe actuel"
      secureTextEntry
    />
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Nouveau mot de passe</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={newPassword}
      onChangeText={setNewPassword}
      placeholder="Nouveau mot de passe"
      secureTextEntry
    />
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Confirmer le nouveau mot de passe</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      placeholder="Confirmer le nouveau mot de passe"
      secureTextEntry
    />
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Nom</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={lastName}
      onChangeText={setLastName}
      placeholder="Nom"
    />
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Prénom</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={firstName}
      onChangeText={setFirstName}
      placeholder="Prénom"
    />
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Téléphone</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={phone}
      onChangeText={setPhone}
      placeholder="Téléphone"
      keyboardType="phone-pad"
    />
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Avatar (URL)</Text>
    <TextInput
      style={{
        width: 260,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        alignSelf: 'center',
      }}
      value={avatar}
      onChangeText={setAvatar}
      placeholder="URL de l'avatar"
    />
    <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={{ backgroundColor: '#2e7d32', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 8, minWidth: 90, alignItems: 'center' }}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: '#eee', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, minWidth: 90, alignItems: 'center' }}
        onPress={onCancel}
        disabled={saving}
      >
        <Text style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Annuler</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default ProfileEditForm;
