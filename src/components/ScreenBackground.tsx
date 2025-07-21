import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { componentStyles } from '../theme';

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children }) => (
  <ImageBackground
    source={require('../../assets/images/background.png')}
    style={[componentStyles.container, { justifyContent: 'center', alignItems: 'center' }]}
    resizeMode="cover"
  >
    <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.4)' }} />
    {children}
  </ImageBackground>
);



export default ScreenBackground;
