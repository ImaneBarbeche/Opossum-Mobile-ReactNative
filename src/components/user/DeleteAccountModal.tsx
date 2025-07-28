import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import Loader from "../Loader";
import { colors } from '../../theme';

interface DeleteAccountModalProps {
  visible: boolean;
  deleting: boolean;
  deletePassword: string;
  setDeletePassword: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible, deleting, deletePassword, setDeletePassword, onCancel, onConfirm
}) => (
  <Modal
    visible={visible}
    animationType="fade"
    transparent
    onRequestClose={onCancel}
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
            onPress={onConfirm}
            disabled={deleting}
          >
            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
              {deleting ? "Suppression..." : "Supprimer"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#eee', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, minWidth: 90, alignItems: 'center' }}
            onPress={onCancel}
            disabled={deleting}
          >
            <Text style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default DeleteAccountModal;
