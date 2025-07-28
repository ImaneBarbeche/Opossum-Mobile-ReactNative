// utils/networkErrorHandler.ts
import Toast from 'react-native-toast-message';


export function handleNetworkError(error: any) {
  if (
    error?.message?.includes('Network') ||
    error?.message?.includes('Failed to fetch') ||
    error?.code === 'ECONNABORTED' ||
    error?.response?.status === 0
  ) {
    Toast.show({
      type: 'error',
      text1: 'Erreur réseau',
      text2: 'Impossible de se connecter. Vérifiez votre connexion internet.',
    });
  } else {
    Toast.show({
      type: 'error',
      text1: 'Erreur',
      text2: error?.message || 'Une erreur est survenue.',
    });
  }
}
