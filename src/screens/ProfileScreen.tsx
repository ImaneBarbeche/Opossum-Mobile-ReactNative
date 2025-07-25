import { componentStyles, colors, spacing, typography } from "../theme";
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
import { validateProfileForm } from "../utils/profileValidation";
import ScreenBackground from "../components/ScreenBackground";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import Toast from "react-native-toast-message";
import DeleteAccountModal from "../components/DeleteAccountModal";

const ProfileScreen: React.FC = () => {
  const { user, logout, loading, setUser } = useAuth();

  // Gérer le statut utilisateur (ACTIVE, BLOCKED, DELETED)
  if (user?.status === "BLOCKED") {
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
  if (user?.status === "DELETED") {
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

  // Log du user à chaque rendu pour debug
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
          "../services/user.service"
        );
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
        <ProfileHeader
          avatarUrl={user?.avatar}
          firstName={user?.firstName}
          email={user?.email}
        />

        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 24,
            padding: 24,
            maxWidth: 420,
            width: "90%",
            alignItems: "center",
            alignSelf: "center",
            marginTop: 32,
            marginBottom: 32,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {!editMode && (
            <View
              style={{ width: "100%", alignItems: "flex-end", marginBottom: 2 }}
            >
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
                  backgroundColor: "#f8f8f8",
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  fontSize: 16,
                  alignSelf: "center",
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
                avatar={avatar}
                setAvatar={setAvatar}
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
