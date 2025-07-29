import React from "react";
import { Text } from "react-native";

interface ProfileInfoBlockProps {
  label: string;
  value?: string;
}

const ProfileInfoBlock: React.FC<ProfileInfoBlockProps> = ({ label, value }) => (
  <>
    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 12, marginBottom: 2, color: '#2e7d32' }}>{label}</Text>
    <Text style={{ alignSelf: 'center', fontSize: 16, color: '#333', marginBottom: 4 }}>{value || '-'}</Text>
  </>
);

export default ProfileInfoBlock;
