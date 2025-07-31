// Configuration des couleurs de l'application Opossum
export const colors = {
  successLight: '#E6F9ED',
  warningLight: '#FFF9E6',
  // Couleurs principales
  primary: '#A8D5A8',
  primaryDark: '#85C485',
  primaryLight: '#C8E6C8',
  
  // Couleurs neutres
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#666666',
  black: '#000000',
  
  // Couleurs d'action
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Navigation
  navActive: '#A8D5A8',
  navInactive: '#999999',
  
  // Boutons
  buttonPrimary: '#A8D5A8',
  buttonSecondary: '#FFFFFF',
  buttonTextPrimary: '#FFFFFF',
  buttonTextSecondary: '#A8D5A8',
  
  // Transparences
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

// Types pour TypeScript
export type ColorKeys = keyof typeof colors;
