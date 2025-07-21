import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

const Loader: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  if (!visible) return null;
  return (
    <View style={{
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
      // backgroundColor: 'rgba(255,255,255,0.6)',
    }}>
      <ActivityIndicator size="large" color={colors.primaryDark} />
    </View>
  );
};



export default Loader;
