import { StyleSheet } from "react-native";
import { colors, typography } from "./index";

export const messagingScreenStyles = StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: 6,
  },
  badgeContainer: {
    marginLeft: 16,
    alignItems: "center",
  },
  badge: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
  },
  badgeText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  badgeLabel: {
    color: colors.primaryDark,
    fontSize: 12,
    marginTop: 2,
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
});
