import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

type Props = {
  content: string;
  isFromMe: boolean;
  sentAt: string;
  isRead: boolean;
  imageUrl?: string; // si le message contient une image
  onDelete?: () => void;
  isDeletable?: boolean;
};

export default function MessageBubble({
  content,
  isFromMe,
  sentAt,
  isRead,
  imageUrl,
  onDelete,
  isDeletable,
}: Props) {
  return (
    <View style={[styles.bubble, isFromMe ? styles.mine : styles.theirs]}>
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
        {isFromMe && isDeletable && onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.delete}>Supprimer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
});
