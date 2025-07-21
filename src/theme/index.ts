// Export central de tous les éléments du thème Opossum
export { colors, type ColorKeys } from './colors';
export { spacing, type SpacingKeys } from './spacing';
export { typography, type TypographyKeys } from './typography';
export { componentStyles } from './components';

// Import pour le thème global
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { componentStyles } from './components';

// Objet theme global pour faciliter les imports
export const theme = {
  colors,
  spacing,
  typography,
  components: componentStyles,
} as const;

// Type pour le thème complet
export type Theme = typeof theme;
