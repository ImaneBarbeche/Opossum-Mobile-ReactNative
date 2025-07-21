import { colors } from './colors';

// Tailles et styles de typographie
export const typography = {
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.black,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.black,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '500' as const,
    color: colors.black,
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.black,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.darkGray,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
} as const;

// Types pour TypeScript
export type TypographyKeys = keyof typeof typography;
