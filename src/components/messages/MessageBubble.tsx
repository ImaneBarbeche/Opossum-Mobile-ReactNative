import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Platform, ActionSheetIOS, Alert } from "react-native";
import ReportMessageModal from "./ReportMessageModal";
import messageBubbleStyles from "../../theme/messageBubbleStyles";

const genericAvatar = require("../../../assets/images/avatar-placeholder.png");


interface AvatarWithFallbackProps {
  uri?: string;
  style?: any;
}
function AvatarWithFallback(props: AvatarWithFallbackProps) {
  const [error, setError] = React.useState(false);
  if (!props.uri || error) {
    return <Image source={genericAvatar} style={props.style} />;
  }
  return <Image source={{ uri: props.uri }} style={props.style} onError={() => setError(true)} />;
}

// Harmonized, modern message bubble with shadow, rounded corners, spacing, and improved timestamp/status
export default function MessageBubble({
  content,
  isFromMe,
  sentAt,
  isRead,
  onDelete,
  isDeletable,
  token,
  messageId,
  imageUrl,
  senderName,
  senderAvatarUrl,
}: {
  content: string;
  isFromMe?: boolean; // fallback for backend field
  sentAt: string;
  isRead?: boolean; // fallback for backend field
  onDelete?: () => void;
  isDeletable?: boolean;
  token?: string | null;
  messageId?: string;
  imageUrl?: string;
  senderName?: string;
  senderAvatarUrl?: string;
  // Accepts backend fields for harmonization
  fromMe?: boolean;
  read?: boolean;
}) {
  const [showReportModal, setShowReportModal] = useState(false);

  // Harmonize backend field names
  const mine = typeof isFromMe !== "undefined" ? isFromMe : !!(typeof arguments[0]?.fromMe !== "undefined" && arguments[0].fromMe);
  const readStatus = typeof isRead !== "undefined" ? isRead : !!(typeof arguments[0]?.read !== "undefined" && arguments[0].read);

  const handleReport = () => setShowReportModal(true);

  const handleLongPress = () => {
    const options = [
      ...(mine && isDeletable && onDelete ? ["Supprimer"] : []),
      ...(!mine ? ["Signaler"] : []),
      "Annuler",
    ];
    const cancelButtonIndex = options.length - 1;
    const deleteButtonIndex = options.indexOf("Supprimer");
    const reportButtonIndex = options.indexOf("Signaler");

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
          if (buttonIndex === reportButtonIndex && !mine) {
            handleReport();
          }
        }
      );
    } else {
      const alertOptions = [];
      if (mine && isDeletable && onDelete) {
        alertOptions.push({ text: "Supprimer", onPress: onDelete, style: "destructive" as const });
      }
      if (!mine) {
        alertOptions.push({ text: "Signaler", onPress: handleReport });
      }
      alertOptions.push({ text: "Annuler", style: "cancel" as const });
      Alert.alert(
        "Options du message",
        "Que voulez-vous faire ?",
        alertOptions
      );
    }
  };

  return (
    <>
      <View
        style={[
          messageBubbleStyles.bubble,
          mine ? messageBubbleStyles.mine : messageBubbleStyles.theirs,
          messageBubbleStyles.modernShadow,
        ]}
      >
        {/* Avatar + Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          {!mine && (
            <AvatarWithFallback uri={senderAvatarUrl} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }} />
          )}
          {!mine && senderName && (
            <Text style={{ fontSize: 13, color: '#888', fontWeight: '600', marginRight: 4 }}>{senderName}</Text>
          )}
        </View>
        {/* Message content */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={messageBubbleStyles.image} />
        ) : (
          <Text style={messageBubbleStyles.text}>{content}</Text>
        )}
        <View style={messageBubbleStyles.row}>
          <Text style={messageBubbleStyles.date}>{new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          {mine && (
            <Text style={[messageBubbleStyles.status, { marginLeft: 4 }]}>{readStatus ? "Lu" : "Envoyé"}</Text>
          )}
        </View>
        <TouchableOpacity
          style={messageBubbleStyles.bubbleOverlay}
          onLongPress={handleLongPress}
          activeOpacity={0.7}
        />
      </View>
      {/* Report modal remains unchanged */}
      <ReportMessageModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        token={token}
        messageId={messageId}
      />
    </>
  );
}



