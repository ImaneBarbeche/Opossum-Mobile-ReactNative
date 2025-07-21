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
import styles from "./ProfileScreen.styles";
import { isValidPhone, isValidAvatarUrl } from "../utils/validators";
import ScreenBackground from '../components/ScreenBackground';
import FloatingLogoutButton from '../components/FloatingLogoutButton';
import Toast from "react-native-toast-message";

const ProfileScreen: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saving, setSaving] = useState(false);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setPhone(user?.phone || "");
    setAvatar(user?.avatar || "");
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Le prénom est obligatoire.",
      });
      return;
    }
    if (!lastName.trim()) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Le nom est obligatoire.",
      });
      return;
    }
    if (!isValidPhone(phone)) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Le téléphone est invalide.",
      });
      return;
    }
    if (!isValidAvatarUrl(avatar)) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "L'URL de l'avatar est invalide.",
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
        phone_number: phone,
        avatar_url: avatar,
      };
      await updateUserProfile(data, token);
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
    <ScreenBackground>
      {(saving || deleting) && <Loader visible={saving || deleting} />}
      <FloatingLogoutButton onLogout={logout} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCentered}>
          <View style={styles.avatarBox}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user?.firstName?.[0] || "?"}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.profileCard}>
          {!editMode && (
            <View
              style={{ width: "100%", alignItems: "flex-end", marginBottom: 2 }}
            >
              <TouchableOpacity
                onPress={handleEdit}
                style={styles.editIcon}
                accessibilityLabel="Modifier le profil"
              >
                <MaterialIcons name="edit" size={22} color="#1976d2" />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.label}>Prénom</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {editMode ? (
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Prénom"
              />
            ) : (
              <Text style={styles.value}>{user?.firstName}</Text>
            )}
          </View>
          {editMode ? (
            <>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Nom"
              />
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Téléphone"
                keyboardType="phone-pad"
              />
              <Text style={styles.label}>Avatar (URL)</Text>
              <TextInput
                style={styles.input}
                value={avatar}
                onChangeText={setAvatar}
                placeholder="URL de l'avatar"
              />
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Nom</Text>
              <Text style={styles.value}>{user?.lastName}</Text>
              <Text style={styles.label}>Téléphone</Text>
              <Text style={styles.value}>{user?.phone || "-"}</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteButtonText}>Supprimer le compte</Text>
        </TouchableOpacity>

        {/* Prompt de mot de passe pour suppression avec Modal natif */}
        <Modal
          visible={showPasswordPrompt}
          animationType="fade"
          transparent
          onRequestClose={() => {
            setShowPasswordPrompt(false);
            setDeletePassword("");
          }}
        >
          <View style={styles.passwordPromptOverlay}>
            <View style={styles.passwordPromptBox}>
              {deleting && <Loader visible={deleting} />}
              <Text style={styles.passwordPromptTitle}>
                Confirmer la suppression
              </Text>
              <Text style={styles.passwordPromptText}>
                Veuillez entrer votre mot de passe pour confirmer la suppression
                de votre compte.
              </Text>
              <TextInput
                style={styles.input}
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Mot de passe"
                secureTextEntry
                autoFocus={Platform.OS === "web" ? false : true}
                editable={!deleting}
                textContentType="password"
                returnKeyType="done"
              />
              <View style={styles.row}>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: "#c62828" }]}
                  onPress={handleConfirmDelete}
                  disabled={deleting}
                >
                  <Text style={styles.saveButtonText}>
                    {deleting ? "Suppression..." : "Supprimer"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowPasswordPrompt(false);
                    setDeletePassword("");
                  }}
                  disabled={deleting}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ScreenBackground>
  );
};

export default ProfileScreen;
