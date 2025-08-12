import React from 'react';
import { render, act } from '@testing-library/react-native';
import { View } from 'react-native';
import { useListingLocation } from '../hooks/useListingLocation';

// Helper test component to use the hook
function TestComponent({ onHook }: { onHook: (hook: any) => void }) {
  const hook = useListingLocation(false, 'Paris', '10 rue de Rivoli');
  React.useEffect(() => {
    if (onHook) onHook(hook);
  }, [hook, onHook]);
  return <View />;
}

describe('useListingLocation', () => {
  it('should set and clear location', () => {
    let hook: any;
    render(<TestComponent onHook={h => (hook = h)} />);
    // Set location
    act(() => {
      hook.setLocation({ latitude: 48.8566, longitude: 2.3522 });
    });
    expect(hook.location).toEqual({ latitude: 48.8566, longitude: 2.3522 });
    // Clear location
    act(() => {
      hook.clearLocation();
    });
    expect(hook.location).toBeNull();
  });

  it('should handle error state', () => {
    let hook: any;
    render(<TestComponent onHook={h => (hook = h)} />);
    act(() => {
      hook.setError('Erreur de localisation');
    });
    expect(hook.error).toBe('Erreur de localisation');
    act(() => {
      hook.setError(null);
    });
    expect(hook.error).toBeNull();
  });
});