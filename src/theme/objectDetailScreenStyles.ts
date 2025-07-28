import { StyleSheet } from 'react-native';
import { colors, typography } from './index';

export const objectDetailScreenStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  card: {
    flex: 1,
    minHeight: 420,
    margin: 16,
    padding: 24,
    justifyContent: 'flex-start',
    borderRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionRow: {
    position: 'absolute',
    top: 18,
    right: 18,
    flexDirection: 'row',
    zIndex: 10,
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.mediumGray,
    marginBottom: 12,
  },
  photoScroll: {
    marginBottom: 12,
  },
  photoItem: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.mediumGray,
    marginRight: 10,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: 6,
  },
  type: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  category: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: colors.darkGray,
    textAlign: 'center',
  },
  locationBlock: {
    marginBottom: 12,
    alignItems: 'center',
  },
  locationLabel: {
    fontWeight: 'bold',
  },
  locationText: {
    textAlign: 'center',
  },
  distance: {
    color: colors.info,
    marginTop: 4,
    fontWeight: 'bold',
  },
  date: {
    color: colors.darkGray,
    marginBottom: 16,
    textAlign: 'center',
  },
  ownerBlock: {
    marginBottom: 10,
    alignItems: 'center',
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  ownerBtn: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  ownerBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  contactBtn: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  contactBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
