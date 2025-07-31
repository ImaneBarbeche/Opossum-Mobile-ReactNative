import { StyleSheet, Platform } from "react-native";
import { colors, typography, componentStyles, spacing } from "./index";

const conversationChatScreenStyles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...typography.body,
    color: colors.darkGray,
    marginTop: 16,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 32, // plus d'espace en bas pour éviter la barre
    paddingTop: 16, // espace en haut pour éviter la caméra/notch
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    ...typography.h3,
    color: colors.darkGray,
    textAlign: "center",
  },
  emptySubtext: {
    ...typography.body,
    color: colors.mediumGray,
    textAlign: "center",
    marginTop: 8,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  // ✅ Styles spécifiques au mode Contact
  contactTextInput: {
    borderWidth: 1,
    borderColor: colors.mediumGray,
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    backgroundColor: colors.white,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  contactSendButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  contactSendButtonDisabled: {
    backgroundColor: colors.mediumGray,
  },
});

export default conversationChatScreenStyles;
