import { StyleSheet } from "react-native";
import { colors, typography } from "./index";

export const listingConversationsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    ...typography.h1,
    color: colors.primary,
    textAlign: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: "column",
    borderLeftWidth: 4,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.black,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  lastMessage: {
    ...typography.body,
    color: colors.darkGray,
    marginBottom: 8,
  },
  lastMessageItalic: {
    ...typography.body,
    color: colors.darkGray,
    marginBottom: 8,
    fontStyle: "italic",
  },
  lastActivity: {
    ...typography.caption,
    color: colors.mediumGray,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  emptyText: {
    textAlign: "center",
    color: colors.darkGray,
    fontSize: 16,
  },
  emptySubText: {
    textAlign: "center",
    color: colors.mediumGray,
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
