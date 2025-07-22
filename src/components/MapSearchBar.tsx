import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface MapSearchBarProps {
  search: string;
  setSearch: (v: string) => void;
  onOpenFilters: () => void;
  onListView: () => void;
  showListButton?: boolean;
  showMapButton?: boolean;
  onMapView?: () => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({ search, setSearch, onOpenFilters, onListView, showListButton, showMapButton, onMapView }) => (
  <View style={{
    position: 'absolute',
    top: 28,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
    elevation: 10,
  }}>
    <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 16,
      paddingHorizontal: spacing.md,
      height: 44,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.10,
      shadowRadius: 8,
      elevation: 6,
    }}>
      <Ionicons name="search" size={20} color={colors.darkGray} style={{ marginRight: 6 }} />
      <TextInput
        style={{
          flex: 1,
          fontSize: 16,
          color: colors.black,
          backgroundColor: 'transparent',
          borderRadius: 8,
          paddingHorizontal: 0,
          height: 44,
        }}
        placeholder="Rechercher..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.darkGray}
      />
    </View>
    <TouchableOpacity
      style={{
        marginLeft: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 6,
      }}
      onPress={onOpenFilters}
      accessibilityLabel="Filtres"
    >
      <Ionicons name="options-outline" size={22} color={colors.white} />
    </TouchableOpacity>
    {showListButton && (
      <TouchableOpacity
        style={{
          marginLeft: spacing.sm,
          backgroundColor: colors.error,
          borderRadius: 16,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.10,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={onListView}
        accessibilityLabel="Vue liste"
      >
        <Ionicons name="list-outline" size={22} color={colors.white} />
      </TouchableOpacity>
    )}
    {showMapButton && (
      <TouchableOpacity
        style={{
          marginLeft: spacing.sm,
          backgroundColor: colors.primary,
          borderRadius: 16,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.10,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={onMapView}
        accessibilityLabel="Vue carte"
      >
        <Ionicons name="map" size={22} color={colors.white} />
      </TouchableOpacity>
    )}
  </View>
);

export default MapSearchBar;
