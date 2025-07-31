import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import {
  getConversationMessages,
  sendMessage,
  deleteMessage,
  markConversationAsRead,
} from "../services/message.service";
import MessageBubble from "../components/MessageBubble";
import FileUploadButton from "../components/FileUploadButton";
import type { Message } from "../models/Message";

type Props = {
  token: string;
  listingId: string;
  otherUserId: string;
  myUserId: string;
};

const ChatScreen: React.FC<Props> = ({
  token,
  listingId,
  otherUserId,
  myUserId,
}) => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setLoading(true);
    getConversationMessages(token, listingId)
      .then((res) => {
        const response = res as unknown as {
          data: { success: boolean; data: { messages: Message[] } };
        };
        if (response.data.success) {
          setMessages(
            response.data.data.messages.filter((msg) => msg.status === "ACTIVE")
          );
        }
        markConversationAsRead(token, listingId).catch(() => {});
      })
      .catch(() => {
        /* gestion d’erreur simplifiée */
      })
      .finally(() => setLoading(false));
  }, [token, listingId, otherUserId]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(token, listingId, input.trim(), otherUserId)
      .then((res) => {
        const response = res as unknown as {
          data: { success: boolean; data: { message: Message } };
        };
        if (response.data.success) {
          setMessages((m) => [...m, response.data.data.message]);
          setInput("");
          setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
      })
      .catch(() => Toast.show({ type: "error", text1: "Erreur", text2: "Impossible d'envoyer le message" }));
  };

  const handleImageUploaded = (fileData: any) => {
    const imageUrl = fileData.url || fileData.fileUrl;
    sendMessage(token, listingId, `[photo] ${imageUrl}`, otherUserId)
      .then((res) => {
        const response = res as unknown as {
          data: { success: boolean; data: { message: Message } };
        };
        if (response.data.success)
          setMessages((m) => [...m, response.data.data.message]);
      })
      .catch(() => Toast.show({ type: "error", text1: "Erreur", text2: "Impossible d’envoyer la photo" }));
  };

  const handleDeleteMessage = (msgId: string) => {
    Alert.alert(
      "Suppression",
      "Confirmer la suppression de ce message ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteMessage(token, msgId)
              .then((res) => {
                const response = res as unknown as { data: { success: boolean } };
                if (response.data.success) {
                  setMessages((m) => m.filter((msg) => msg.messageId !== msgId));
                }
              })
              .catch(() => Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de supprimer" }));
          },
        },
      ]
    );
  };

  if (loading) return <ActivityIndicator />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Optionnel : bouton logout flottant */}
      {/* <FloatingLogoutButton /> */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.messageId}
        renderItem={({ item }) => (
          <MessageBubble
            content={
              item.status === "DELETED" ? "[Message supprimé]" : item.content
            }
            isFromMe={item.senderId === myUserId}
            sentAt={item.sentAt}
            isRead={item.isRead}
            onDelete={
              item.senderId === myUserId && item.status === "ACTIVE"
                ? () => handleDeleteMessage(item.messageId)
                : undefined
            }
            isDeletable={
              item.senderId === myUserId &&
              item.status === "ACTIVE" &&
              Date.now() - new Date(item.sentAt).getTime() < 24 * 60 * 60 * 1000
            }
            imageUrl={
              item.content.startsWith("[photo] ")
                ? item.content.slice(8)
                : undefined
            }
            deletedAt={item.deletedAt}
            edited={item.edited}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucun message</Text>}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Votre message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <Button title="Envoyer" onPress={handleSend} />
        <FileUploadButton onUploaded={handleImageUploaded} token={token} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    padding: 10,
    marginRight: 8,
  },
  empty: { textAlign: "center", marginTop: 30, color: "#AAA" },
});
