// Messagerie privée
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
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import {
  getConversationMessages,
  sendMessage,
  deleteMessage,
  markConversationAsRead,
} from "../services/message.service";
import MessageBubble from "../components/MessageBubble";
import FileUploadButton from "../components/FileUploadButton";

// Types pour les props et les messages
type Props = {
  token: string;
  listingId: string;
  otherUserId: string;
  myUserId: string;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
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

  // Charger les messages et marquer comme lus à l'ouverture
  useEffect(() => {
    setLoading(true);
    getConversationMessages(token, listingId, otherUserId)
      .then((res) => {
        const response = res as {
          data: { success: boolean; data: { messages: Message[] } };
        };
        if (response.data.success) setMessages(response.data.data.messages);
        // Marquer tous les messages comme lus d’un coup
        markConversationAsRead(token, listingId, otherUserId).catch(() => {});
      })
      .catch(() => {
        /* gestion d’erreur simplifiée */
      })
      .finally(() => setLoading(false));
  }, [token, listingId, otherUserId]);

  // Envoyer un message texte
  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(token, listingId, otherUserId, input.trim())
      .then((res) => {
        const response = res as {
          data: { success: boolean; data: { message: Message } };
        };
        if (response.data.success) {
          setMessages((m) => [...m, response.data.data.message]);
          setInput("");
          setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
      })
      .catch(() => Alert.alert("Erreur", "Impossible d'envoyer le message"));
  };

  // Envoi d’une image
  const handleImageUploaded = (fileData: any) => {
    const imageUrl = fileData.url || fileData.fileUrl;
    sendMessage(token, listingId, otherUserId, `[photo] ${imageUrl}`)
      .then((res) => {
        const response = res as {
          data: { success: boolean; data: { message: Message } };
        };
        if (response.data.success)
          setMessages((m) => [...m, response.data.data.message]);
      })
      .catch(() => Alert.alert("Erreur", "Impossible d’envoyer la photo"));
  };

  // Suppression d’un message
  const handleDeleteMessage = (msgId: string) => {
    Alert.alert("Supprimer", "Confirmer la suppression de ce message ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => {
          deleteMessage(token, msgId)
            .then((res) => {
              const response = res as { data: { success: boolean } };
              if (response.data.success)
                setMessages((m) => m.filter((msg) => msg.id !== msgId));
            })
            .catch(() => Alert.alert("Erreur", "Impossible de supprimer"));
        },
      },
    ]);
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            content={item.content}
            isFromMe={item.senderId === myUserId}
            sentAt={item.sentAt}
            isRead={item.isRead}
            onDelete={
              item.senderId === myUserId
                ? () => handleDeleteMessage(item.id)
                : undefined
            }
            isDeletable={
              item.senderId === myUserId &&
              Date.now() - new Date(item.sentAt).getTime() < 24 * 60 * 60 * 1000
            }
            imageUrl={
              item.content.startsWith("[photo] ")
                ? item.content.slice(8)
                : undefined
            }
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
