import { handleNetworkError } from '../utils/networkErrorHandler';

jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
}));
jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

const { Alert } = require('react-native');
const Toast = require('react-native-toast-message');

describe('handleNetworkError', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show Alert for network error', () => {
    handleNetworkError({ message: 'Network Error' });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Erreur réseau',
      expect.stringContaining('Impossible de se connecter')
    );
  });

  it('should show Toast for other errors', () => {
    handleNetworkError({ message: 'Autre erreur' });
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        text1: 'Erreur',
        text2: 'Autre erreur',
      })
    );
  });
});
