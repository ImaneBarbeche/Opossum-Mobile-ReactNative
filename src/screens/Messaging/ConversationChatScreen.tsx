import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  getConversationMessages,
  sendMessage,
  deleteMessage,
  markConversationAsRead,
  contactListingOwner,
} from "../../services/message.service";
import { getListingDetails } from "../../services/listing.service";
import { getValidAccessToken } from "../../services/token.helper";
import { useAuth } from "../../context/AuthContext";
import MessageBubble from "../../components/MessageBubble";
import type { Message } from "../../models/Message";
import type { ConversationMessagesResponse } from "../../models/Conversation";
import { colors, typography, componentStyles, spacing } from "../../theme";
import styles from "../../theme/conversationChatScreenStyles";

// ✅ Types pour gérer les deux modes
type ContactModeParams = {
  mode: "contact";
  listingId: string; // ✅ data.id depuis ObjectDetailScreen
  receiverId: string; // ✅ data.user.id depuis ObjectDetailScreen
};

type ChatModeParams = {
  mode: "chat";
  conversationId: string;
  listingId: string;
  otherUserId: string;
  otherUserName: string;
  listingTitle: string;
};

type RouteParams = ContactModeParams | ChatModeParams;

type ConversationChatScreenProps = {
  token?: string;
  myUserId?: string;
  navigation?: any;
  route?: any;
};

export default function ConversationChatScreen({
  token: propToken,
  myUserId: propMyUserId,
  navigation,
  route,
}: ConversationChatScreenProps) {
  const { user } = useAuth();
  const routeParams =
    route?.params ??
    useRoute<RouteProp<{ params: RouteParams }, "params">>().params;

  // ✅ Gestion du token et userId
  const [token, setToken] = useState<string | null>(propToken || null);
  const myUserId = propMyUserId || user?.id;

  // ✅ Mode de fonctionnement
  const isContactMode = routeParams.mode === "contact";
  const isChatMode = routeParams.mode === "chat";

  // ✅ États communs
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // ✅ États spécifiques au mode Contact
  const [listingInfo, setListingInfo] = useState<any>(null);
  const [ownerName, setOwnerName] = useState("Propriétaire");
  const [loadingListing, setLoadingListing] = useState(isContactMode);

  // ✅ Récupération du token au montage
  useEffect(() => {
    const getToken = async () => {
      if (!token) {
        const validToken = await getValidAccessToken();
        setToken(validToken);
      }
    };
    getToken();
  }, [token]);

  // ✅ Chargement des informations en mode Contact
  useEffect(() => {
    const loadListingInfo = async () => {
      if (!isContactMode || !token) return;

      try {
        setLoadingListing(true);
        const listing = await getListingDetails(routeParams.listingId, token);
        setListingInfo(listing);
        if (listing.user) {
          const fullName = `${listing.user.firstName || ""} ${listing.user.lastName || ""}`.trim();
          setOwnerName(fullName || "Propriétaire");
        }
      } catch (error: any) {
        console.error("❌ Erreur chargement annonce:", error);
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Impossible de charger les informations de l'annonce",
        });
      } finally {
        setLoadingListing(false);
        setLoading(false);
      }
    };

    if (isContactMode && token) {
      loadListingInfo();
    }
  }, [isContactMode, token, routeParams]);

  // ✅ Chargement des messages en mode Chat
  const loadMessages = useCallback(async () => {
    if (!isChatMode || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response: ConversationMessagesResponse =
        await getConversationMessages(
          token,
          (routeParams as ChatModeParams).conversationId,
          0,
          50
        );

      const activeMessages = response.messages.filter(
        (msg) => msg.status === "ACTIVE"
      );
      setMessages(activeMessages);

      await markConversationAsRead(
        token,
        (routeParams as ChatModeParams).conversationId
      );
    } catch (error: any) {
      console.error("❌ Erreur loadMessages:", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de charger les messages",
      });
    } finally {
      setLoading(false);
    }
  }, [token, isChatMode, routeParams]);

  // ✅ Envoi de message - Mode Contact (premier message)
  const handleSendFirstMessage = useCallback(async () => {
    if (
      !newMessage.trim() ||
      sending ||
      !isContactMode ||
      !token ||
      !myUserId
    ) {
      if (!newMessage.trim()) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Veuillez écrire un message",
        });
      }
      return;
    }

    setSending(true);
    try {
      const response = await contactListingOwner(
        token,
        routeParams.listingId,
        newMessage.trim(),
        (routeParams as ContactModeParams).receiverId
      );
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Message envoyé avec succès !",
        onHide: () => {
          navigation?.replace("ConversationChatScreen", {
            mode: "chat",
            conversationId: response.conversationId,
            listingId: routeParams.listingId,
            otherUserId: (routeParams as ContactModeParams).receiverId,
            otherUserName: ownerName,
            listingTitle: listingInfo?.title || "Annonce",
          });
        },
      });
    } catch (error: any) {
      console.error("❌ Erreur envoi message:", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: error.message || "Impossible d'envoyer le message",
      });
    } finally {
      setSending(false);
    }
  }, [
    token,
    myUserId,
    newMessage,
    sending,
    isContactMode,
    routeParams,
    ownerName,
    listingInfo,
    navigation,
  ]);

  // ✅ Envoi de message - Mode Chat (message dans conversation existante)
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending || !isChatMode || !token) return;
    setSending(true);
    try {
      const response = await sendMessage(
        token,
        (routeParams as ChatModeParams).conversationId,
        newMessage.trim(),
        (routeParams as ChatModeParams).otherUserId
      );
      setMessages((prev) => [...prev, response.message]);
      setNewMessage("");

      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    } catch (error: any) {
      console.error("❌ Erreur envoi:", error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible d'envoyer le message",
      });
    } finally {
      setSending(false);
    }
  }, [token, newMessage, sending, isChatMode, routeParams]);

  // ✅ Suppression de message (mode Chat uniquement)
  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      if (!isChatMode || !token) return;

      Alert.alert("Suppression", "Confirmer la suppression de ce message ?", [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMessage(token, messageId);

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.messageId === messageId
                    ? {
                        ...msg,
                        status: "DELETED" as const,
                        content: "[Message supprimé]",
                      }
                    : msg
                )
              );

              Toast.show({
                type: "success",
                text1: "Message supprimé",
              });
            } catch (error) {
              console.error("❌ Erreur suppression:", error);
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Impossible de supprimer",
              });
            }
          },
        },
      ]);
    },
    [token, isChatMode]
  );

  // ✅ Chargement des messages en mode Chat
  useEffect(() => {
    if (isChatMode && token) {
      loadMessages();
    }
  }, [loadMessages, isChatMode, token]);

  // ✅ Configuration du header
  useEffect(() => {
    if (isContactMode && listingInfo) {
      navigation?.setOptions({
        title: `Contacter ${ownerName}`,
        headerTitleStyle: { fontSize: 16 }
        // Ne pas définir headerLeft ni d'autres options
      });
    } else if (isChatMode) {
      const chatParams = routeParams as ChatModeParams;
      navigation?.setOptions({
        title: `${chatParams.otherUserName} - ${chatParams.listingTitle}`,
        headerTitleStyle: { fontSize: 16 }
        // Ne pas définir headerLeft ni d'autres options
      });
    }
  }, [
    navigation,
    isContactMode,
    isChatMode,
    ownerName,
    listingInfo,
    routeParams,
  ]);

  // ✅ Affichage de chargement
  if (loading || (isContactMode && loadingListing)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {isContactMode
              ? "Chargement des informations..."
              : "Chargement des messages..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Interface Mode Contact
  if (isContactMode) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
          <Text style={[typography.h1, { color: colors.primary, marginBottom: spacing.lg, textAlign: "center" }]}>Contacter {ownerName}</Text>

          {/* Informations de l'annonce */}
          {listingInfo && (
            <View style={[styles.listingCard, { backgroundColor: listingInfo.type === "FOUND" ? colors.successLight : colors.warningLight }]}> 
              <Text style={[typography.h3, { color: colors.black, marginBottom: spacing.sm }]}>À propos de :</Text>
              <Text style={[typography.h3, { color: colors.black, marginBottom: spacing.xs, fontSize: 18, fontWeight: "600" }]}>{listingInfo.title}</Text>
              <Text style={[typography.caption, { color: listingInfo.type === "FOUND" ? colors.success : colors.error, fontWeight: "bold", marginBottom: spacing.sm }]}>{listingInfo.type === "FOUND" ? "Objet trouvé" : "Objet perdu"}</Text>
              {listingInfo.description && (
                <Text style={[typography.body, { color: colors.darkGray, fontStyle: "italic" }]} numberOfLines={3}>{listingInfo.description}</Text>
              )}
            </View>
          )}

          {/* Formulaire de message */}
          <View style={styles.contactFormCard}>
            <Text style={[typography.h3, { color: colors.black, marginBottom: spacing.sm }]}>Votre message :</Text>
            <TextInput
              style={styles.contactTextInput}
              placeholder="Bonjour, je suis intéressé par votre annonce..."
              placeholderTextColor={colors.mediumGray}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
              editable={!sending}
            />
            <Text style={[typography.caption, { color: colors.mediumGray, marginBottom: spacing.md }]}>{newMessage.length}/500 caractères</Text>
            <TouchableOpacity
              onPress={handleSendFirstMessage}
              disabled={sending || !newMessage.trim()}
              style={[styles.contactSendButton, (sending || !newMessage.trim()) && styles.contactSendButtonDisabled]}
            >
              {sending && <ActivityIndicator size="small" color={colors.white} style={{ marginRight: 8 }} />}
              <Text style={[typography.button, { color: colors.white, fontWeight: "bold" }]}>{sending ? "Envoi en cours..." : "Envoyer le message"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <Text style={[typography.caption, { color: colors.mediumGray, textAlign: "center", fontStyle: "italic" }]}>Votre message sera envoyé au propriétaire de cette annonce. Une conversation sera créée pour vous permettre d'échanger.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ✅ Interface Mode Chat
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 24}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.messageId}
            renderItem={({ item }) => (
              <MessageBubble
                content={item.content}
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
                  Date.now() - new Date(item.sentAt).getTime() <
                    24 * 60 * 60 * 1000
                }
                token={token}
                messageId={item.messageId}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Aucun message dans cette conversation
                </Text>
                <Text style={styles.emptySubtext}>
                  Envoyez le premier message !
                </Text>
              </View>
            }
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            contentContainerStyle={styles.messagesList}
            style={{ flexGrow: 1 }}
          />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Écrivez votre message..."
              placeholderTextColor={colors.mediumGray}
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={handleSendMessage}
              editable={!sending}
              multiline
              maxLength={500}
            />

            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              style={[
                styles.sendButton,
                (!newMessage.trim() || sending) && styles.sendButtonDisabled,
              ]}
            >
              {sending ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.sendButtonText}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

