// utils/networkErrorHandler.ts
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';


export function handleNetworkError(error: any) {
  if (
    error?.message?.includes('Network') ||
    error?.message?.includes('Failed to fetch') ||
    error?.code === 'ECONNABORTED' ||
    error?.response?.status === 0
  ) {
    Alert.alert('Erreur réseau', 'Impossible de se connecter. Vérifiez votre connexion internet.'); 
  } else {
    Toast.show({
      type: 'error',
      text1: 'Erreur',
      text2: error?.message || 'Une erreur est survenue.',
    });
  }
}
