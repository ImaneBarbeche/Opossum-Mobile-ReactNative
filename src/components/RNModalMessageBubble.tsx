import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableHighlight, Image, ActionSheetIOS, Platform, Alert, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from "react-native";
import Modal from "react-native-modal";
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
        style={[styles.bubble, isFromMe ? styles.mine : styles.theirs]}
        onLongPress={handleLongPress}
      >
        <View>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <Text style={styles.text}>{content}</Text>
          )}
          <View style={styles.row}>
            <Text style={styles.date}>{new Date(sentAt).toLocaleString()}</Text>
            {isFromMe && (
              <Text style={styles.status}>{isRead ? "Lu" : "Envoyé"}</Text>
            )}
          </View>
        </View>
      </TouchableHighlight>
      {/* Modal de signalement */}
      <Modal
        isVisible={showReportModal}
        onBackdropPress={() => setShowReportModal(false)}
        onBackButtonPress={() => setShowReportModal(false)}
        avoidKeyboard
        useNativeDriver
        propagateSwipe={true}
        style={{ margin: 0, justifyContent: "center", alignItems: "center" }}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="always"
          >
            <Text style={styles.modalTitle}>Signaler le message</Text>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[styles.reasonBtn, selectedReason === reason && styles.reasonBtnSelected]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            {selectedReason === "Autre" && (
              <TextInput
                style={styles.input}
                placeholder="Votre raison..."
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowReportModal(false)}>
                <Text style={{ color: "#333" }}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={submitReport}
                disabled={loadingReport || (selectedReason === "Autre" && !customReason)}
              >
                {loadingReport ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "#fff" }}>Signaler</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, borderRadius: 12, marginVertical: 4, maxWidth: "80%" },
  mine: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  theirs: { backgroundColor: "#FFF", alignSelf: "flex-start" },
  text: { fontSize: 15 },
  image: { width: 200, height: 200, borderRadius: 12, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  date: { fontSize: 10, color: "#666", marginRight: 10 },
  status: { fontSize: 10, color: "#0A0", marginRight: 10 },
  delete: { fontSize: 10, color: "#E33" },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  reasonBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 8,
  },
  reasonBtnSelected: {
    backgroundColor: "#cce5ff",
  },
  reasonText: { fontSize: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginRight: 8,
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
