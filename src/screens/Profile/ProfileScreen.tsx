import { profileScreenStyles } from "../../theme/profileScreenStyles";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getValidAccessToken } from "../../services/token.helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile, deleteUserAccount } from "../../services/user.service";
import Loader from "../../components/Loader";
import ProfileEditForm from "../../components/user/ProfileEditForm";
import ProfileAvatar from "../../components/user/ProfileAvatar";
import ProfileInfoBlock from "../../components/user/ProfileInfoBlock";
import DeleteAccountButton from "../../components/user/DeleteAccountButton";
import { validateProfileForm } from "../../utils/profileValidation";
import FloatingLogoutButton from "../../components/FloatingLogoutButton";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";
import DeleteAccountModal from "../../components/user/DeleteAccountModal";

const ProfileScreen: React.FC = () => {
  // Avatar upload state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const { user, logout, loading, setUser } = useAuth();

  // Gérer le statut utilisateur (ACTIVE, BLOCKED, DELETED ou fallback sur isActive)
  const userStatus = user?.status ?? (user?.isActive === false ? "DELETED" : "ACTIVE");
  if (userStatus === "BLOCKED") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <MaterialIcons name="block" size={56} color="#d32f2f" />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#d32f2f",
            marginTop: 16,
          }}
        >
          Compte bloqué
        </Text>
        <Text style={{ color: "#333", marginTop: 10, textAlign: "center" }}>
          Votre compte a été bloqué par l'administration. Veuillez contacter le
          support si besoin.
        </Text>
        <FloatingLogoutButton onLogout={logout} />
      </View>
    );
  }
  if (userStatus === "DELETED") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <MaterialIcons name="delete-forever" size={56} color="#d32f2f" />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 22,
            color: "#d32f2f",
            marginTop: 16,
          }}
        >
          Compte supprimé
        </Text>
        <Text style={{ color: "#333", marginTop: 10, textAlign: "center" }}>
          Ce compte a été supprimé. Vous ne pouvez plus accéder à vos données.
        </Text>
        <FloatingLogoutButton onLogout={logout} />
      </View>
    );
  }

  React.useEffect(() => {}, [user]);

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
    const validation = validateProfileForm({
      firstName,
      lastName,
      phone,
      avatar,
    });
    if (!validation.valid) {
      Toast.show({
        type: "error",
        ...(validation.error || { text1: "Erreur", text2: "Erreur inconnue." }),
      });
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
        const { fetchCurrentUserProfile } = await import(
          "../../services/user.service"
        );
        const updatedProfile = await fetchCurrentUserProfile(token);
        if (updatedProfile) {
          setUser(updatedProfile);
        } else {
        }
      } catch (e) {
        Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de rafraîchir le profil utilisateur." });
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
        text2: error?.error?.message || error?.message || "Erreur lors de la mise à jour.",
      });
    } finally {
      setSaving(false);
    }
  };

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
          text: "Confirmer",
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
      const errorMsg =
        error?.error?.message || "Erreur lors de la suppression.";
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: errorMsg.length > 80 ? errorMsg.slice(0, 77) + "..." : errorMsg,
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
              // Ouvre la galerie pour choisir une image
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
              });
              if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatarUploading(true);
                try {
                  // Ici, tu peux uploader l'image sur ton serveur si besoin
                  // Pour l'instant, on prend l'URI locale
                  setAvatar(result.assets[0].uri);
                } catch (e) {
                  Toast.show({ type: 'error', text1: 'Erreur', text2: "Impossible de mettre à jour l'avatar." });
                } finally {
                  setAvatarUploading(false);
                }
              }
            }}
            activeOpacity={editMode ? 0.7 : 1}
            style={profileScreenStyles.avatarTouchable}
            accessibilityLabel={editMode ? "Changer l’avatar" : "Avatar"}
          >
            <ProfileAvatar
              avatarUrl={user?.avatar}
              firstName={user?.firstName}
            />
            {avatarUploading && (
              <Text style={profileScreenStyles.avatarLoadingText}>
                Chargement...
              </Text>
            )}
            {editMode && !avatarUploading && (
              <Text style={profileScreenStyles.avatarChangeText}>
                Changer l’avatar
              </Text>
            )}
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
};

export default ProfileScreen;
