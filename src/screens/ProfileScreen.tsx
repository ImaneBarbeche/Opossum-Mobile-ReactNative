import { colors } from '../theme';
import { profileScreenStyles } from '../theme/profileScreenStyles';
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getValidAccessToken } from "../services/token.helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile, deleteUserAccount } from "../services/user.service";
import Loader from "../components/Loader";
import ProfileEditForm from "../components/user/ProfileEditForm";
import ProfileAvatar from "../components/user/ProfileAvatar";
import ProfileInfoBlock from "../components/user/ProfileInfoBlock";
import DeleteAccountButton from "../components/user/DeleteAccountButton";
import { validateProfileForm } from "../utils/profileValidation";
import FloatingLogoutButton from '../components/FloatingLogoutButton';
import Toast from "react-native-toast-message";
import DeleteAccountModal from "../components/user/DeleteAccountModal";

const ProfileScreen: React.FC = () => {
  // Avatar upload state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const { user, logout, loading, setUser } = useAuth();
  // Log du user à chaque rendu pour debug
  React.useEffect(() => {
  }, [user]);

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhone(user?.phone || "");
    setAvatar(user?.avatar || "");
    setEditMode(false);
  };

  const handleSave = async () => {
    const validation = validateProfileForm({ firstName, lastName, phone, avatar });
    if (!validation.valid) {
      Toast.show({ type: 'error', ...(validation.error || { text1: 'Erreur', text2: 'Erreur inconnue.' }) });
      return;
    }
    setSaving(true);
    try {
      // Utilise le helper pour obtenir un token valide
      const token = await getValidAccessToken();
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Token manquant ou expiré, veuillez vous reconnecter.",
        });
        setSaving(false);
        return;
      }
      const data = {
        firstName,
        lastName,
        phone: phone,
        avatar: avatar,
        email: user?.email,
      };
      await updateUserProfile(data, token);
      // Rafraîchir le profil utilisateur dans le contexte
      try {
        const { fetchCurrentUserProfile } = await import("../services/user.service");
        const updatedProfile = await fetchCurrentUserProfile(token);
        if (updatedProfile) {
          setUser(updatedProfile);
        }
      } catch (e) {
        // ignore erreur de refresh
      }
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Profil mis à jour avec succès.",
      });
      setEditMode(false);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error?.error?.message || "Erreur lors de la mise à jour.",
      });
    } finally {
      setSaving(false);
    }
  }; // <-- Add this closing bracket for handleSave

  // Suppression du compte avec double confirmation et saisie du mot de passe
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Toast.show({
      type: 'info',
      text1: 'Suppression du compte',
      text2: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      position: 'bottom',
      autoHide: false,
      onPress: () => setShowPasswordPrompt(true),
    });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const token = await getValidAccessToken();
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Token manquant ou expiré, veuillez vous reconnecter.",
        });
        setDeleting(false);
        return;
      }
      if (!deletePassword) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Veuillez saisir votre mot de passe.",
        });
        setDeleting(false);
        return;
      }
      await deleteUserAccount(deletePassword, token);
      setShowPasswordPrompt(false);
      setDeletePassword("");
      Toast.show({
        type: "success",
        text1: "Compte supprimé",
        text2: "Votre compte a bien été supprimé.",
      });
      logout();
    } catch (error: any) {
      const errorMsg = (error?.error?.message || "Erreur lors de la suppression.");
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: errorMsg.length > 80 ? errorMsg.slice(0, 77) + '...' : errorMsg,
      });
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      {(saving || deleting) && <Loader visible={saving || deleting} />}
      <FloatingLogoutButton onLogout={logout} />
      <ScrollView contentContainerStyle={profileScreenStyles.scrollContent}>
        <View style={profileScreenStyles.avatarBlock}>
          <TouchableOpacity
            onPress={async () => {
              if (!editMode) return;
              // ...existing code...
            }}
            activeOpacity={editMode ? 0.7 : 1}
            style={profileScreenStyles.avatarTouchable}
            accessibilityLabel={editMode ? 'Changer l’avatar' : 'Avatar'}
          >
            <ProfileAvatar avatarUrl={user?.avatar} firstName={user?.firstName} />
            {avatarUploading && <Text style={profileScreenStyles.avatarLoadingText}>Chargement...</Text>}
            {editMode && !avatarUploading && <Text style={profileScreenStyles.avatarChangeText}>Changer l’avatar</Text>}
          </TouchableOpacity>
          <Text style={profileScreenStyles.emailText}>{user?.email}</Text>
        </View>

        <View style={profileScreenStyles.card}>
          {!editMode && (
            <View style={profileScreenStyles.editBtnRow}>
              <TouchableOpacity
                onPress={handleEdit}
                style={profileScreenStyles.editBtn}
                accessibilityLabel="Modifier le profil"
              >
                <MaterialIcons name="edit" size={22} color="#1976d2" />
              </TouchableOpacity>
            </View>
          )}
          {editMode ? (
            <>
              <TextInput
                style={profileScreenStyles.textInput}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Prénom"
              />
              <ProfileEditForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                phone={phone}
                setPhone={setPhone}
                saving={saving}
                onSave={handleSave}
                onCancel={handleCancel}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
              />
            </>
          ) : (
            <>
              <ProfileInfoBlock label="Prénom" value={user?.firstName} />
              <ProfileInfoBlock label="Nom" value={user?.lastName} />
              <ProfileInfoBlock label="Téléphone" value={user?.phone} />
            </>
          )}
        </View>

        <DeleteAccountButton onPress={handleDeleteAccount} />

        <DeleteAccountModal
          visible={showPasswordPrompt}
          deleting={deleting}
          deletePassword={deletePassword}
          setDeletePassword={setDeletePassword}
          onCancel={() => {
            setShowPasswordPrompt(false);
            setDeletePassword("");
          }}
          onConfirm={handleConfirmDelete}
        />
      </ScrollView>
    </>
  );
}

export default ProfileScreen;
