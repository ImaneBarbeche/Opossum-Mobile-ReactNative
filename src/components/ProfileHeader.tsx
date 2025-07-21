import React from "react";
import { View, Text } from "react-native";
import ProfileAvatar from "./ProfileAvatar";
import { colors } from "../theme";

interface ProfileHeaderProps {
  avatarUrl?: string;
  firstName?: string;
  email?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ avatarUrl, firstName, email }) => (
  <View style={{ alignItems: 'center', marginBottom: 12 }}>
    <ProfileAvatar avatarUrl={avatarUrl} firstName={firstName} />
    <Text style={{ color: '#1976d2', fontSize: 15, marginBottom: 2, fontWeight: '600', textAlign: 'center', marginTop: 10 }}>{email}</Text>
  </View>
);

export default ProfileHeader;
