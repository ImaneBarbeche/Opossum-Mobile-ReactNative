import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyMessageListingsScreen from "../screens/Messaging/MyMessageListingsScreen";
import ListingConversationScreen from "../screens/Messaging/ListingConversationScreen";

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
      {/* Liste des annonces où l'utilisateur a écrit un message */}
      <Stack.Screen
        name="MyMessageListings"
        options={{ title: "Mes Messages" }}
      >
        {(props) => (
          <MyMessageListingsScreen
            {...props}
            token={token}
            myUserId={myUserId}
          />
        )}
      </Stack.Screen>
      {/* Conversation entre l'utilisateur et le propriétaire pour une annonce */}
      <Stack.Screen
        name="AnnonceConversation"
        options={{ title: "Conversation" }}
      >
        {(props) => (
          <ListingConversationScreen
            {...props}
            token={token}
            myUserId={myUserId}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
