import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { colors } from "../../theme";

interface DeleteAccountButtonProps {
  onPress: () => void;
}

const DeleteAccountButton: React.FC<DeleteAccountButtonProps> = ({ onPress }) => (
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
    onPress={onPress}
  >
    <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 18, textAlign: 'center', letterSpacing: 0.2 }}>Supprimer le compte</Text>
  </TouchableOpacity>
);

export default DeleteAccountButton;
