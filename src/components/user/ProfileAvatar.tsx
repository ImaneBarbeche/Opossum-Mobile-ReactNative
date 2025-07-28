import React from "react";
import { View, Text, Image } from "react-native";

interface ProfileAvatarProps {
  avatarUrl?: string;
  firstName?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, firstName }) => (
  <View style={{
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    borderWidth: 2,
    borderColor: '#90caf9',
    shadowColor: '#90caf9',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  }}>
    {avatarUrl && avatarUrl.trim() !== "" ? (
      <Image source={{ uri: avatarUrl }} style={{ width: 76, height: 76, borderRadius: 38, resizeMode: 'cover' }} />
    ) : (
      <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: '#bbdefb', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, color: '#1976d2', fontWeight: 'bold' }}>
          {firstName?.[0] || "?"}
        </Text>
      </View>
    )}
  </View>
);

export default ProfileAvatar;
