import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { colors } from '../../theme';

interface TypeSelectorProps {
  type: "LOST" | "FOUND" | "";
  setType: (v: "LOST" | "FOUND" | "") => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ type, setType }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
    <Text style={{ fontSize: 15, marginRight: 8 }}>Mon objet est&nbsp;:</Text>
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }} onPress={() => setType("LOST")}>  
      <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>{type === "LOST" && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}</View>
      <Text style={{ fontSize: 15 }}>Perdu</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }} onPress={() => setType("FOUND")}>  
      <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>{type === "FOUND" && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}</View>
      <Text style={{ fontSize: 15 }}>Trouvé</Text>
    </TouchableOpacity>
  </View>
);

export default TypeSelector;
