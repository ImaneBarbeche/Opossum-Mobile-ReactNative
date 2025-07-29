import { StyleSheet } from 'react-native';
import { colors } from './index';

export const profileEditFormStyles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 2,
    color: '#2e7d32',
  },
  input: {
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
  buttonSave: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonTextSave: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonTextCancel: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
