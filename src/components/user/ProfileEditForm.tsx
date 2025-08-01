import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { profileEditFormStyles } from '../../theme/user';
import { ProfileEditFormProps } from '../../models/ProfileEditForm.types';

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  firstName, setFirstName, lastName, setLastName, phone, setPhone, saving, onSave, onCancel,
  currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword
}) => (
  <View>
    <Text style={profileEditFormStyles.label}>Mot de passe actuel</Text>
    <TextInput
      style={profileEditFormStyles.input}
      value={currentPassword}
      onChangeText={setCurrentPassword}
      placeholder="Mot de passe actuel"
      secureTextEntry
    />
    <Text style={profileEditFormStyles.label}>Nouveau mot de passe</Text>
    <TextInput
      style={profileEditFormStyles.input}
      value={newPassword}
      onChangeText={setNewPassword}
      placeholder="Nouveau mot de passe"
      secureTextEntry
    />
    <Text style={profileEditFormStyles.label}>Confirmer le nouveau mot de passe</Text>
    <TextInput
      style={profileEditFormStyles.input}
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      placeholder="Confirmer le nouveau mot de passe"
      secureTextEntry
    />
    <Text style={profileEditFormStyles.label}>Nom</Text>
    <TextInput
      style={profileEditFormStyles.input}
      value={lastName}
      onChangeText={setLastName}
      placeholder="Nom"
    />
    <Text style={profileEditFormStyles.label}>Prénom</Text>
    <TextInput
      style={profileEditFormStyles.input}
      value={firstName}
      onChangeText={setFirstName}
      placeholder="Prénom"
    />
    <Text style={profileEditFormStyles.label}>Téléphone</Text>
    <TextInput
      style={profileEditFormStyles.input}
      value={phone}
      onChangeText={setPhone}
      placeholder="Téléphone"
      keyboardType="phone-pad"
    />
    <View style={profileEditFormStyles.buttonRow}>
      <TouchableOpacity
        style={profileEditFormStyles.buttonSave}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={profileEditFormStyles.buttonTextSave}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={profileEditFormStyles.buttonCancel}
        onPress={onCancel}
        disabled={saving}
      >
        <Text style={profileEditFormStyles.buttonTextCancel}>Annuler</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default ProfileEditForm;
