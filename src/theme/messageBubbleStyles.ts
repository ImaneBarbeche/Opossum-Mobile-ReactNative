import { StyleSheet } from "react-native";

const messageBubbleStyles = StyleSheet.create({
  bubble: {
    padding: 14,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: "80%",
    minWidth: 60,
    position: "relative",
    marginHorizontal: 8,
  },
  mine: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 18,
  },
  theirs: {
    backgroundColor: "#FFF",
    alignSelf: "flex-start",
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 18,
  },
  text: {
    fontSize: 16,
    color: "#222",
    lineHeight: 22,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 14,
    marginBottom: 8,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "flex-end",
  },
  date: {
    fontSize: 11,
    color: "#888",
    marginRight: 2,
  },
  status: {
    fontSize: 11,
    color: "#0A0",
    marginLeft: 2,
    fontWeight: "bold",
  },
  delete: { fontSize: 10, color: "#E33" },
  modernShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
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
