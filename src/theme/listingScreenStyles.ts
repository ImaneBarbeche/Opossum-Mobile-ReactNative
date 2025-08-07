import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

export const listingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingTop: 64,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl, // plus d'espace en haut pour les badges
    paddingBottom: spacing.lg,
    marginVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: spacing.lg,
    justifyContent: 'flex-start', // pour aligner le contenu en haut
    alignItems: 'center',
    width: 120, // augmente la largeur pour laisser place à la catégorie
    height: 110, // augmente la hauteur pour la catégorie
    marginBottom: spacing.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: colors.mediumGray,
  },
  content: {
    flex: 1,
    justifyContent: 'center', // centre verticalement le contenu face à l'image
    alignItems: 'center', // centre horizontalement le contenu dans la colonne
    gap: spacing.md, // espace vertical entre les éléments du contenu
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
    marginTop: 32,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 8, // espace pour le rapprocher de l'image sans le coller
  },
  category: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginTop: spacing.sm,
    marginBottom: 4,
    flexShrink: 1,
    maxWidth: 120,
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: colors.darkGray,
    marginRight: 8,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
    flexShrink: 1,
    textAlign: 'center',
  },
});
