// Messagerie privée
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from "../context/AuthContext";

const ChatScreen: React.FC = () => {
    const { user, logout, loading } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Messagerie</Text>
    </View>
  </View>
  );
};

export default ChatScreen;