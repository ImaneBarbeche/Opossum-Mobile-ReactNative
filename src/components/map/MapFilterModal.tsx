import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { colors, typography } from '../../theme';
import { mapFilterModalStyles } from '../../theme/map';
import { MapFilterModalProps } from "../../models/Listing";


const MapFilterModal: React.FC<MapFilterModalProps & { filterQ?: string; setFilterQ?: (v: string) => void }> = ({
  visible, onClose,
  filterType, setFilterType,
  filterCategory, setFilterCategory,
  filterCity, setFilterCity,
  filterPage, setFilterPage,
  filterSize, setFilterSize,
  onReset,
  filterQ = '',
  setFilterQ = () => {},
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={mapFilterModalStyles.modalContainer}>
      <View style={mapFilterModalStyles.card}>
        <Text style={[typography.h2, mapFilterModalStyles.title]}>Recherche avancée</Text>
        {/* Mot-clé (q) */}
        <View style={mapFilterModalStyles.row}>
          <Text style={mapFilterModalStyles.label}>Mot-clé :</Text>
          <TextInput
            style={mapFilterModalStyles.textInput}
            placeholder="ex: sac, téléphone, clé..."
            value={filterQ}
            onChangeText={setFilterQ}
          />
        </View>
        {/* Type (type) */}
        <View style={mapFilterModalStyles.row}>
          <TouchableOpacity
            style={[{ flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' }, filterType === "LOST" && { backgroundColor: colors.error }]}
            onPress={() => setFilterType(filterType === "LOST" ? null : "LOST")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Perdu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' }, filterType === "FOUND" && { backgroundColor: colors.primary }]}
            onPress={() => setFilterType(filterType === "FOUND" ? null : "FOUND")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Trouvé</Text>
          </TouchableOpacity>
        </View>
        {/* Catégorie */}
        <View style={mapFilterModalStyles.row}>
          <Text style={mapFilterModalStyles.label}>Catégorie :</Text>
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={filterCategory || ''}
              onValueChange={setFilterCategory}
              style={mapFilterModalStyles.picker}
            >
              <Picker.Item label="Toutes les catégories" value="" />
              <Picker.Item label="Électronique" value="electronics" />
              <Picker.Item label="Vêtements" value="clothing" />
              <Picker.Item label="Accessoires" value="accessories" />
              <Picker.Item label="Documents" value="documents" />
              <Picker.Item label="Clés" value="keys" />
              <Picker.Item label="Autre" value="other" />
            </Picker>
          </View>
        </View>
        {/* Ville/adresse */}
        <View style={mapFilterModalStyles.row}>
          <Text style={mapFilterModalStyles.label}>Ville / Adresse :</Text>
          <TextInput
            style={mapFilterModalStyles.textInput}
            placeholder="ex: Paris, Lyon..."
            value={filterCity}
            onChangeText={setFilterCity}
          />
        </View>
        {/* Pagination */}
        <View style={mapFilterModalStyles.row}>
          <Text style={mapFilterModalStyles.label}>Page :</Text>
          <TextInput
            style={mapFilterModalStyles.textInput}
            placeholder="0"
            value={filterPage}
            onChangeText={setFilterPage}
            keyboardType="numeric"
          />
          <Text style={mapFilterModalStyles.label}>Taille :</Text>
          <TextInput
            style={mapFilterModalStyles.textInput}
            placeholder="20"
            value={filterSize}
            onChangeText={setFilterSize}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <TouchableOpacity style={mapFilterModalStyles.button} onPress={onClose}>
            <Text style={mapFilterModalStyles.buttonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={mapFilterModalStyles.button} onPress={() => { onReset(); onClose(); }}>
            <Text style={mapFilterModalStyles.buttonText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default MapFilterModal;
