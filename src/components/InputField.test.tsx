import React from 'react';
import { render } from '@testing-library/react-native';
import InputField from './InputField';

describe('InputField', () => {
  it('renders without crashing', () => {
    render(<InputField />);
  });
});
