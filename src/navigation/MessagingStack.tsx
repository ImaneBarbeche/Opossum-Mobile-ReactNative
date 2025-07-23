import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ConversationsScreen from "../screens/ConversationsScreen";
import ChatScreen from "../screens/ChatScreen"; // Met à jour le chemin si ChatScreen est bien rangé dans screens

const Stack = createStackNavigator();

type MessagingStackProps = {
  screenProps: {
    token: string;
    myUserId: string;
  };
};

export default function MessagingStack({ screenProps }: MessagingStackProps) {
  const { token, myUserId } = screenProps;

  return (
    <Stack.Navigator>
      <Stack.Screen name="Conversations" options={{ title: "Conversations" }}>
        {(props) => (
          <ConversationsScreen {...props} token={token} myUserId={myUserId} />
        )}
      </Stack.Screen>
      <Stack.Screen name="ChatDetail" options={{ title: "Conversation" }}>
        {(props) => <ChatScreen {...props} token={token} myUserId={myUserId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
