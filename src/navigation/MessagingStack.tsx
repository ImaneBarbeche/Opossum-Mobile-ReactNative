import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyMessageListingsScreen from "../screens/Messaging/MyMessageListingsScreen";
import ConversationChatScreen from "../screens/Messaging/ConversationChatScreen";

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
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="MyMessageListings"
        options={{ title: "Mes Conversations" }}
      >
        {(props) => (
          <MyMessageListingsScreen
            {...props}
            token={token}
            myUserId={myUserId}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ConversationChatScreen"
        options={{ title: "Conversation" }}
      >
        {(props) => (
          <ConversationChatScreen
            {...props}
            token={token}
            myUserId={myUserId}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
