import React, { useState } from "react";
import { View, Text, TouchableHighlight, Image, ActionSheetIOS, Platform, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import ReportMessageModal from "./ReportMessageModal";
import { Modal } from "react-native";
import messageBubbleStyles from "../theme/messageBubbleStyles";

type Props = {
  content: string;
  isFromMe: boolean;
  sentAt: string;
  isRead: boolean;
  imageUrl?: any;
  onDelete?: () => void;
  isDeletable?: boolean;
  deletedAt?: any;
  edited?: any;
  token?: string;
  messageId?: string;
};

const REPORT_REASONS = ["Spam", "Insulte", "Hors sujet", "Contenu inapproprié"];

export default function MessageBubble({
  content,
  isFromMe,
  sentAt,
  isRead,
  onDelete,
  imageUrl,
  deletedAt,
  edited,
  isDeletable,
  token,
  messageId,
}: Props) {
  // State pour la modal de signalement
  const [showReportModal, setShowReportModal] = useState(false);


  // Menu contextuel au long press
  const handleLongPress = () => {
    const options = ["Annuler"];
    let deleteButtonIndex = -1;
    let reportButtonIndex = -1;
    // Supprimer uniquement sur mes messages
    if (isFromMe && isDeletable && onDelete) {
      options.push("Supprimer");
      deleteButtonIndex = options.length - 1;
    }
    // Signaler uniquement sur les messages reçus
    if (!isFromMe) {
      options.push("Signaler");
      reportButtonIndex = options.length - 1;
    }
    const cancelButtonIndex = 0;

    const handleReport = () => {
      setShowReportModal(true);
    };

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex: deleteButtonIndex > 0 ? deleteButtonIndex : undefined,
        },
        (buttonIndex) => {
          if (buttonIndex === deleteButtonIndex && onDelete) {
            onDelete();
          }
          if (buttonIndex === reportButtonIndex && !isFromMe) {
            handleReport();
          }
        }
      );
    } else {
      const alertOptions = [];
      if (isFromMe && isDeletable && onDelete) {
        alertOptions.push({ text: "Supprimer", onPress: onDelete, style: "destructive" as const });
      }
      if (!isFromMe) {
        alertOptions.push({ text: "Signaler", onPress: handleReport });
      }
      alertOptions.push({ text: "Annuler", style: "cancel" as const });
      Alert.alert(
        "Options du message",
        "Que voulez-vous faire ?",
        alertOptions
      );
    }
  };


  return (
    <>
      <TouchableHighlight
        underlayColor="#e0e0e0"
        style={[messageBubbleStyles.bubble, isFromMe ? messageBubbleStyles.mine : messageBubbleStyles.theirs]}
        onLongPress={handleLongPress}
      >
        <View>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={messageBubbleStyles.image} />
          ) : (
            <Text style={messageBubbleStyles.text}>{content}</Text>
          )}
          <View style={messageBubbleStyles.row}>
            <Text style={messageBubbleStyles.date}>{new Date(sentAt).toLocaleString()}</Text>
            {isFromMe && (
              <Text style={messageBubbleStyles.status}>{isRead ? "Lu" : "Envoyé"}</Text>
            )}
          </View>
        </View>
      </TouchableHighlight>
      <ReportMessageModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        token={token}
        messageId={messageId}
      />
    </>
  );
}


