import React, { useState } from "react";
import { View, Text, TouchableHighlight, Image, ActionSheetIOS, Platform, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { reportMessage } from "../services/message.service";
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

const REPORT_REASONS = ["Spam", "Insulte", "Hors sujet", "Autre"];

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
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);


  // Menu contextuel au long press
  const handleLongPress = () => {
    const options = ["Annuler"];
    if (isFromMe && isDeletable && onDelete) options.push("Supprimer");
    options.push("Signaler");
    const cancelButtonIndex = 0;
    const deleteButtonIndex = isFromMe && isDeletable && onDelete ? 1 : -1;
    const reportButtonIndex = options.length - 1;

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
          if (buttonIndex === reportButtonIndex) {
            handleReport();
          }
        }
      );
    } else {
      Alert.alert(
        "Options du message",
        "Que voulez-vous faire ?",
        [
          ...(isFromMe && isDeletable && onDelete
            ? [{ text: "Supprimer", onPress: onDelete, style: "destructive" as const }]
            : []),
          {
            text: "Signaler",
            onPress: handleReport,
          },
          { text: "Annuler", style: "cancel" as const },
        ]
      );
    }
  };

  // Envoi du signalement
  const submitReport = async () => {
    if (!token || !messageId) return;
    setLoadingReport(true);
    const reasonToSend = selectedReason === "Autre" ? customReason : selectedReason;
    try {
      await reportMessage(token, messageId, reasonToSend);
      setShowReportModal(false);
      setCustomReason("");
      setSelectedReason(REPORT_REASONS[0]);
      Toast.show({ type: "success", text1: "Message signalé avec succès" });
    } catch (e) {
      Alert.alert("Erreur", "Impossible de signaler le message");
    } finally {
      setLoadingReport(false);
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
      {/* Modal de signalement */}
      <Modal
        visible={showReportModal}
        onRequestClose={() => setShowReportModal(false)}
        animationType="slide"
        transparent
      >
        <View style={messageBubbleStyles.modalOverlay}>
          <View style={messageBubbleStyles.modalContent}>
            <Text style={messageBubbleStyles.modalTitle}>Signaler le message</Text>
            <View style={{ width: '100%' }}>
              {REPORT_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[messageBubbleStyles.reasonBtn, selectedReason === reason && messageBubbleStyles.reasonBtnSelected]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <Text style={messageBubbleStyles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                <TouchableOpacity style={messageBubbleStyles.cancelBtn} onPress={() => setShowReportModal(false)}>
                  <Text style={{ color: "#333" }}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={messageBubbleStyles.submitBtn}
                  onPress={submitReport}
                  disabled={loadingReport}
                >
                  {loadingReport ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: "#fff" }}>Signaler</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}


