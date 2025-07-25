import { componentStyles, colors, spacing, typography } from '../theme';
// Profil utilisateur
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { getValidAccessToken } from "../services/token.helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile, deleteUserAccount } from "../services/user.service";
import Loader from "../components/Loader";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfoBlock from "../components/ProfileInfoBlock";
import DeleteAccountButton from "../components/DeleteAccountButton";
// styles supprimés, utiliser theme et inline
import { validateProfileForm } from "../utils/profileValidation";
import ScreenBackground from '../components/ScreenBackground';
import FloatingLogoutButton from '../components/FloatingLogoutButton';
import Toast from "react-native-toast-message";
import DeleteAccountModal from "../components/DeleteAccountModal";

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
        console.log('Avatar après update:', updatedProfile?.avatar);
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
    Alert.alert(
      "Suppression du compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setShowPasswordPrompt(true),
        },
      ]
    );
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
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error?.error?.message || "Erreur lors de la suppression.",
      });
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      {(saving || deleting) && <Loader visible={saving || deleting} />}
      <FloatingLogoutButton onLogout={logout} />
      <ScrollView contentContainerStyle={{ marginTop: 32, marginBottom: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            onPress={async () => {
              if (!editMode) return;
              // Demande la permission
              const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permissionResult.granted) {
                Toast.show({ type: 'error', text1: 'Permission refusée', text2: 'Autorisez l’accès aux photos pour changer l’avatar.' });
                return;
              }
              const pickerResult = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
              if (pickerResult.canceled || !pickerResult.assets?.length) return;
              setAvatarUploading(true);
              try {
                const token = await getValidAccessToken();
                if (!token) throw new Error('Token manquant');
                const { uploadFile } = await import('../services/files.service');
                const uploadRes = await uploadFile(pickerResult.assets[0].uri, token);
                console.log('Avatar upload response:', uploadRes);
                if (uploadRes.data && uploadRes.data.url) {
                  setAvatar(uploadRes.data.url);
                  Toast.show({ type: 'success', text1: 'Avatar mis à jour', text2: 'Votre photo de profil a été changée.' });
                } else {
                  throw new Error(uploadRes.message || 'Erreur upload');
                }
              } catch (e: any) {
                console.log('Avatar upload error:', e);
                let details = '';
                if (e.response) {
                  details = `Code: ${e.response.status} - ${e.response.data?.message || JSON.stringify(e.response.data)}`;
                } else if (e.message) {
                  details = e.message;
                } else {
                  details = JSON.stringify(e);
                }
                Toast.show({ type: 'error', text1: 'Erreur avatar', text2: `Erreur lors de l’upload. ${details}` });
              } finally {
                setAvatarUploading(false);
              }
            }}
            activeOpacity={editMode ? 0.7 : 1}
            style={{ alignSelf: 'center' }}
            accessibilityLabel={editMode ? 'Changer l’avatar' : 'Avatar'}
          >
            <ProfileAvatar avatarUrl={user?.avatar} firstName={user?.firstName} />
            {avatarUploading && <Text style={{ color: '#1976d2', fontSize: 12, marginTop: 4 }}>Chargement...</Text>}
            {editMode && !avatarUploading && <Text style={{ color: '#1976d2', fontSize: 12, marginTop: 4 }}>Changer l’avatar</Text>}
          </TouchableOpacity>
          <Text style={{ color: '#1976d2', fontSize: 15, marginBottom: 2, fontWeight: '600', textAlign: 'center', marginTop: 10 }}>{user?.email}</Text>
        </View>

        <View style={{
          backgroundColor: colors.white,
          borderRadius: 24,
          padding: 24,
          maxWidth: 420,
          width: '90%',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 32,
          marginBottom: 32,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}>
          {!editMode && (
            <View style={{ width: "100%", alignItems: "flex-end", marginBottom: 2 }}>
              <TouchableOpacity
                onPress={handleEdit}
                style={{ marginLeft: 2, padding: 2 }}
                accessibilityLabel="Modifier le profil"
              >
                <MaterialIcons name="edit" size={22} color="#1976d2" />
              </TouchableOpacity>
            </View>
          )}
          {editMode ? (
            <>
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
