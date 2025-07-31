import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyMessageListingsScreen from "../screens/Messaging/MyMessageListingsScreen";
import ConversationChatScreen from "../screens/Messaging/ConversationChatScreen";
import ListingConversationsScreen from "../screens/Messaging/ListingConversationsScreen";

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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
      >
        {(props) => (
          <ConversationChatScreen
            {...props}
            token={token}
            myUserId={myUserId}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ListingConversationsScreen"
        options={{ headerShown: false }}
      >
        {(props) => (
          <ListingConversationsScreen
            {...props}
            token={token}
            myUserId={myUserId}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
