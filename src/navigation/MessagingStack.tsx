import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../theme/colors";
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
        options={{ headerShown: true }}
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
        options={{
          headerShown: true,
          title: "Conversations",
          headerTitleAlign: "center",
          headerTitleStyle: { color: colors.primary, fontWeight: "bold" },
        }}
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
