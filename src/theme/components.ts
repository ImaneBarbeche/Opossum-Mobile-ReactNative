import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

// Styles de composants réutilisables
export const componentStyles = StyleSheet.create({
  // Conteneurs
  container: {
    flex: 1,
    // backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  
  safeContainer: {
    flex: 1,
    // backgroundColor: colors.white,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.white,
  },
  
  // Cartes
  card: {
    // backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  
  // Boutons
  buttonPrimary: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Accessibilité
  },
  
  buttonSecondary: {
    backgroundColor: colors.buttonSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.buttonPrimary,
    minHeight: 44,
  },
  
  buttonTextPrimary: {
    ...typography.button,
    color: colors.buttonTextPrimary,
  },
  
  buttonTextSecondary: {
    ...typography.button,
    color: colors.buttonTextSecondary,
  },
  
  // Champs de saisie
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    ...typography.body,
  },
  
  inputFocused: {
    borderColor: colors.primary,
  },
  
  // Images
  objectImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.mediumGray,
  },
  
  // États
  loading: {
    opacity: 0.6,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  // Messages
  errorText: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
  },
  
  successText: {
    ...typography.caption,
    color: colors.success,
    textAlign: 'center',
  },
});
