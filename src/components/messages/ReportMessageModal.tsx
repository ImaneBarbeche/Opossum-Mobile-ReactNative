
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import messageBubbleStyles from "../../theme/messageBubbleStyles";
import { Modal } from "react-native";
import Toast from "react-native-toast-message";
import { reportMessage } from "../../services/message.service";

const REPORT_REASONS = ["Spam", "Insulte", "Hors sujet", "Contenu inapproprié"];

export default function ReportMessageModal({
  visible,
  onClose,
  token,
  messageId,
}) {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [loadingReport, setLoadingReport] = useState(false);

  const submitReport = async () => {
    if (!token || !messageId) {
      Toast.show({ type: "error", text1: "Impossible de signaler : identifiants manquants" });
      return;
    }
    setLoadingReport(true);
    try {
      await reportMessage(token, messageId, selectedReason);
      setSelectedReason(REPORT_REASONS[0]);
      Toast.show({ type: "success", text1: "Le message a bien été signalé." });
      if (onClose) onClose();
    } catch (e) {
      Toast.show({ type: "error", text1: "Erreur lors du signalement" });
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent={true}
    >
      <View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <View style={messageBubbleStyles.modalContent}>
          <Text style={messageBubbleStyles.modalTitle}>Signaler le message</Text>
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
            <TouchableOpacity style={messageBubbleStyles.cancelBtn} onPress={onClose}>
              <Text style={{ color: "#333" }}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={messageBubbleStyles.submitBtn}
              onPress={submitReport}
              disabled={loadingReport}
            >
              {loadingReport ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff" }}>Signaler</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

