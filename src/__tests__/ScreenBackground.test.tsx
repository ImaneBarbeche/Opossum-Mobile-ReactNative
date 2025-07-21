import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import ScreenBackground from './ScreenBackground';

describe('ScreenBackground', () => {
  it('renders without crashing', () => {
    render(
      <ScreenBackground>
        <React.Fragment>
          <Text>Contenu test</Text>
        </React.Fragment>
      </ScreenBackground>
    );
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <ScreenBackground>
        <React.Fragment>
          <Text>Mon contenu</Text>
        </React.Fragment>
      </ScreenBackground>
    );
    expect(getByText('Mon contenu')).toBeTruthy();
  });
});
