import React from 'react';
import { render } from '@testing-library/react-native';
import ObjectCard from './ObjectCard';

describe('ObjectCard', () => {
  it('renders without crashing', () => {
    render(<ObjectCard />);
  });
});
