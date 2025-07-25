import React from "react";
import ChatList from "../components/ChatList";

type Props = {
  token: string;
  myUserId: string;
  navigation: any;
};

export default function ConversationsScreen({
  token,
  myUserId,
  navigation,
}: Props) {
  // Callback quand on sélectionne une conversation
  const handleSelect = (listingId: string, otherUserId: string) => {
    navigation.navigate("ChatDetail", {
      listingId,
      otherUserId,
      token,
      myUserId,
    });
  };

  return (
    <ChatList
      token={token}
      myUserId={myUserId}
      onSelectConversation={handleSelect}
    />
  );
}
