import { StyleSheet } from 'react-native';
import { colors } from './index';

export const profileScreenStyles = StyleSheet.create({
  scrollContent: {
    marginTop: 32,
    marginBottom: 32,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarTouchable: {
    alignSelf: 'center',
  },
  avatarLoadingText: {
    color: '#1976d2',
    fontSize: 12,
    marginTop: 4,
  },
  avatarChangeText: {
    color: '#1976d2',
    fontSize: 12,
    marginTop: 4,
  },
  emailText: {
    color: '#1976d2',
    fontSize: 15,
    marginBottom: 2,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    maxWidth: 420,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 32,
    marginBottom: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editBtnRow: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  editBtn: {
    marginLeft: 2,
    padding: 2,
  },
  textInput: {
    width: 260,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    alignSelf: 'center',
  },
});
