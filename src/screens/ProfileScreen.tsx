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
import { getValidAccessToken } from "../services/token.helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile, deleteUserAccount } from "../services/user.service";
import Loader from "../components/Loader";
// styles supprimés, utiliser theme et inline
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
      <ScrollView contentContainerStyle={{ marginTop: 32, marginBottom: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 86,
            height: 86,
            borderRadius: 43,
            backgroundColor: '#e3f2fd',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 18,
            borderWidth: 2,
            borderColor: '#90caf9',
            shadowColor: '#90caf9',
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 2,
          }}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={{ width: 76, height: 76, borderRadius: 38, resizeMode: 'cover' }} />
            ) : (
              <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: '#bbdefb', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 32, color: '#1976d2', fontWeight: 'bold' }}>
                  {user?.firstName?.[0] || "?"}
                </Text>
              </View>
            )}
          </View>
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
          <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Prénom</Text>
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
            ) : (
              <Text style={{ alignSelf: 'center', fontSize: 16, color: '#333', marginBottom: 4 }}>{user?.firstName}</Text>
            )}
          </View>
          {editMode ? (
            <>
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
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#eee', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, minWidth: 90, alignItems: 'center' }}
                  onPress={handleCancel}
                  disabled={saving}
                >
                  <Text style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Nom</Text>
              <Text style={{ alignSelf: 'center', fontSize: 16, color: '#333', marginBottom: 4 }}>{user?.lastName}</Text>
              <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>Téléphone</Text>
              <Text style={{ alignSelf: 'center', fontSize: 16, color: '#333', marginBottom: 4 }}>{user?.phone || "-"}</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#c62828',
            borderRadius: 18,
            paddingVertical: 14,
            paddingHorizontal: 24,
            marginTop: 12,
            marginBottom: 24,
            alignSelf: 'center',
            minWidth: 220,
            alignItems: 'center',
            shadowColor: '#c62828',
            shadowOpacity: 0.10,
            shadowRadius: 6,
            elevation: 2,
          }}
          onPress={handleDeleteAccount}
        >
          <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 18, textAlign: 'center', letterSpacing: 0.2 }}>Supprimer le compte</Text>
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
          <View style={{ position: 'absolute', top: 0, shadowRadius: 10, elevation: 4, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              backgroundColor: colors.white,
              borderRadius: 18,
              padding: 28,
              marginHorizontal: 24,
              alignItems: 'center',
              shadowColor: colors.black,
              shadowOpacity: 0.12,
              shadowRadius: 8,
              elevation: 6,
              minWidth: 260,
              maxWidth: 340,
            }}>
              {deleting && <Loader visible={deleting} />}
              <Text style={{ fontSize: 19, fontWeight: 'bold', color: '#c62828', marginBottom: 8, textAlign: 'center' }}>
                Confirmer la suppression
              </Text>
              <Text style={{ fontSize: 15, color: '#333', marginBottom: 14, textAlign: 'center' }}>
                Veuillez entrer votre mot de passe pour confirmer la suppression
                de votre compte.
              </Text>
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
                value={deletePassword}
                onChangeText={setDeletePassword}
                placeholder="Mot de passe"
                secureTextEntry
                autoFocus={Platform.OS === "web" ? false : true}
                editable={!deleting}
                textContentType="password"
                returnKeyType="done"
              />
              <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#c62828', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 8, minWidth: 90, alignItems: 'center' }}
                  onPress={handleConfirmDelete}
                  disabled={deleting}
                >
                  <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                    {deleting ? "Suppression..." : "Supprimer"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: '#eee', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, minWidth: 90, alignItems: 'center' }}
                  onPress={() => {
                    setShowPasswordPrompt(false);
                    setDeletePassword("");
                  }}
                  disabled={deleting}
                >
                  <Text style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Annuler</Text>
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
