import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ children }) => (
  <ImageBackground
    source={require('../../assets/images/background.png')}
    style={styles.bgContainer}
    resizeMode="cover"
  >
    <View style={styles.overlay} />
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});

export default ScreenBackground;
