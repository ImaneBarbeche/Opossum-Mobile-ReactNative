import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { colors, spacing } from '../theme';

interface MapSearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  onOpenFilters: () => void;
  onListView: () => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ search, setSearch, onOpenFilters, onListView }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    backgroundColor: colors.white,
    zIndex: 2,
    marginTop: 80,
  }}>
    <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.mediumGray,
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      height: 40,
    }}>
      <TextInput
        style={{
          flex: 1,
          fontSize: 16,
          color: colors.black,
          backgroundColor: colors.lightGray,
          borderRadius: 8,
          paddingHorizontal: spacing.xs,
          height: 40,
        }}
        placeholder="Rechercher..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.darkGray}
      />
    </View>
    <TouchableOpacity style={{
      marginLeft: spacing.xs,
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    }} onPress={onOpenFilters}>
      <Text style={{ color: colors.white, fontWeight: 'bold' }}>Filtres</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{
      marginLeft: spacing.xs,
      backgroundColor: colors.error,
      borderRadius: 8,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    }} onPress={onListView}>
      <Text style={{ color: colors.white, fontWeight: 'bold' }}>Vue liste</Text>
    </TouchableOpacity>
  </View>
);

export default MapSearchBar;
