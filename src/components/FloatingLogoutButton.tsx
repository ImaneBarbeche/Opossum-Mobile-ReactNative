import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FloatingLogoutButtonProps {
  onLogout: () => void;
  style?: ViewStyle;
}

const FloatingLogoutButton: React.FC<FloatingLogoutButtonProps> = ({ onLogout, style }) => (
  <TouchableOpacity
    onPress={onLogout}
    style={[styles.button, style]}
    accessibilityLabel="Déconnexion"
  >
    <MaterialIcons name="logout" size={28} color="#e53935" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default FloatingLogoutButton;
