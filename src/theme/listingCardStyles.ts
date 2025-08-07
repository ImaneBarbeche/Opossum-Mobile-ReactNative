// ...existing code...
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

export const listingCardStyles = StyleSheet.create({
  content: {
    paddingTop: 28, // espace pour le badge
  },
  card: {
    backgroundColor: colors.white,
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
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  badge: {
    // No absolute position, badge is now in card row
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  imageFallback: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallbackEmoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  badgeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoIcon: {
    marginRight: 4,
    color: colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  description: {
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  actionBtn: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: spacing.sm,
  },
  actionBtnText: {
    color: colors.buttonTextPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  favoriteBtn: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: spacing.sm,
  },
});
