
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableHighlight, Image, ActionSheetIOS, Platform, Alert, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import messageBubbleStyles from "../theme/messageBubbleStyles";
import { Modal } from "react-native";
import Toast from "react-native-toast-message";
import { reportMessage } from "../services/message.service";

const REPORT_REASONS = ["Spam", "Insulte", "Hors sujet", "Autre"];

export default function RNModalMessageBubble({
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
}) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  const customReasonInputRef = useRef(null);

  useEffect(() => {
    if (showReportModal && selectedReason === "Autre") {
      if (customReasonInputRef.current) {
        customReasonInputRef.current.focus();
      }
    }
  }, [showReportModal, selectedReason]);

  const handleLongPress = () => {
    const options = ["Annuler"];
    if (isFromMe && isDeletable && onDelete) options.push("Supprimer");
    options.push("Signaler");
    const cancelButtonIndex = 0;
    const deleteButtonIndex = isFromMe && isDeletable && onDelete ? 1 : -1;
    const reportButtonIndex = options.length - 1;

    const handleReport = () => setShowReportModal(true);

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

  const submitReport = async () => {
    if (!token || !messageId) return;
    setLoadingReport(true);
    const reasonToSend = selectedReason === "Autre" ? customReason : selectedReason;
    try {
      console.log("[Signalement] Envoi:", { token, messageId, reasonToSend });
      await reportMessage(token, messageId, reasonToSend);
      console.log("[Signalement] Succès: signalement envoyé");
      setShowReportModal(false);
      setCustomReason("");
      setSelectedReason(REPORT_REASONS[0]);
      Toast.show({ type: "success", text1: "Message signalé avec succès" });
    } catch (e) {
      console.error("[Signalement] Erreur lors du signalement:", e);
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
      >
        <View style={messageBubbleStyles.modalOverlay}>
          <View style={messageBubbleStyles.modalContent}>
            <Text style={messageBubbleStyles.modalTitle}>Signaler le message</Text>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[messageBubbleStyles.reasonBtn, selectedReason === reason && messageBubbleStyles.reasonBtnSelected]}
                onPress={() => {
                  setSelectedReason(reason);
                }}
              >
                <Text style={messageBubbleStyles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            {selectedReason === "Autre" && (
              <TextInput
                ref={customReasonInputRef}
                style={messageBubbleStyles.input}
                placeholder="Votre raison..."
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
              <TouchableOpacity style={messageBubbleStyles.cancelBtn} onPress={() => setShowReportModal(false)}>
                <Text style={{ color: "#333" }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={messageBubbleStyles.submitBtn}
                onPress={submitReport}
                disabled={loadingReport || (selectedReason === "Autre" && !customReason)}
              >
                {loadingReport ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Signaler</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

