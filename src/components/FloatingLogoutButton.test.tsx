import React from 'react';
import { render } from '@testing-library/react-native';
import FloatingLogoutButton from './FloatingLogoutButton';

describe('FloatingLogoutButton', () => {
  it('renders without crashing', () => {
    render(<FloatingLogoutButton />);
  });
});
