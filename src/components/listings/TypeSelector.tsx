import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from '../../theme';

interface TypeSelectorProps {
  type: "LOST" | "FOUND" | "";
  setType: (v: "LOST" | "FOUND" | "") => void;
}


const badgeStyle = (active: boolean, color: string) => ({
  backgroundColor: active ? color : '#f0f0f0',
  borderRadius: 16,
  paddingHorizontal: 18,
  paddingVertical: 7,
  marginHorizontal: 8,
  borderWidth: active ? 0 : 1,
  borderColor: color,
  minWidth: 70,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  flexDirection: "row" as const,
});

const TypeSelector: React.FC<TypeSelectorProps> = ({ type, setType }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
    <Text style={{ fontSize: 15, marginRight: 8 }}>Mon objet est&nbsp;:</Text>
    <TouchableOpacity onPress={() => setType("LOST")}
      style={badgeStyle(type === "LOST", colors.error)}>
      <Text style={{ color: type === "LOST" ? colors.white : colors.error, fontWeight: 'bold', fontSize: 15 }}>Perdu</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setType("FOUND")}
      style={badgeStyle(type === "FOUND", colors.success)}>
      <Text style={{ color: type === "FOUND" ? colors.white : colors.success, fontWeight: 'bold', fontSize: 15 }}>Trouvé</Text>
    </TouchableOpacity>
  </View>
);

export default TypeSelector;
