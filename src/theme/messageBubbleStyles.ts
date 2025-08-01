import { StyleSheet } from "react-native";

const messageBubbleStyles = StyleSheet.create({
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
    minHeight: 220,
    maxHeight: 340,
    alignSelf: "center",
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

export default messageBubbleStyles;
