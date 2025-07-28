import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { mapSearchBarStyles } from '../../theme/map';
import { MapSearchBarProps } from "../../models/MapSearchBar";


const MapSearchBar: React.FC<MapSearchBarProps> = ({ search, setSearch, onOpenFilters, onListView, showListButton, showMapButton, onMapView }) => (
  <View style={mapSearchBarStyles.container}>
    <View style={mapSearchBarStyles.inputWrapper}>
      <Ionicons name="search" size={20} color={colors.darkGray} style={{ marginRight: 6 }} />
      <TextInput
        style={mapSearchBarStyles.textInput}
        placeholder="Rechercher..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.darkGray}
      />
    </View>
    <TouchableOpacity
      style={mapSearchBarStyles.filterButton}
      onPress={onOpenFilters}
      accessibilityLabel="Filtres"
    >
      <Ionicons name="options-outline" size={22} color={colors.white} />
    </TouchableOpacity>
    {showListButton && (
      <TouchableOpacity
        style={mapSearchBarStyles.listButton}
        onPress={onListView}
        accessibilityLabel="Vue liste"
      >
        <Ionicons name="list-outline" size={22} color={colors.white} />
      </TouchableOpacity>
    )}
    {showMapButton && (
      <TouchableOpacity
        style={mapSearchBarStyles.mapButton}
        onPress={onMapView}
        accessibilityLabel="Vue carte"
      >
        <Ionicons name="map" size={22} color={colors.white} />
      </TouchableOpacity>
    )}
  </View>
);

export default MapSearchBar;
