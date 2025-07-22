import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, typography } from '../theme';
import { MapFilterModalProps } from "../models/Annonce";


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
    <View style={{
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View style={{
        width: '90%',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 24,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      }}>
        <Text style={[typography.h2, { color: colors.primary, marginBottom: spacing.md, alignSelf: 'center' }]}>Recherche avancée</Text>
        {/* Mot-clé (q) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Mot-clé :</Text>
          <TextInput
            style={{
              flex: 1,
              fontSize: 15,
              color: colors.black,
              backgroundColor: colors.lightGray,
              borderRadius: 8,
              paddingHorizontal: spacing.xs,
              height: 38,
            }}
            placeholder="ex: sac, téléphone, clé..."
            value={filterQ}
            onChangeText={setFilterQ}
          />
        </View>
        {/* Type (type) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <TouchableOpacity
            style={[
              { flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
              filterType === "LOST" && { backgroundColor: colors.error }
            ]}
            onPress={() => setFilterType(filterType === "LOST" ? null : "LOST")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Perdu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
              filterType === "FOUND" && { backgroundColor: colors.primary }
            ]}
            onPress={() => setFilterType(filterType === "FOUND" ? null : "FOUND")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Trouvé</Text>
          </TouchableOpacity>
        </View>
        {/* Catégorie */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Catégorie :</Text>
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={filterCategory || ''}
              onValueChange={setFilterCategory}
              style={{ backgroundColor: colors.lightGray, borderRadius: 8 }}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Ville / Adresse :</Text>
          <TextInput
            style={{
              flex: 1,
              fontSize: 15,
              color: colors.black,
              backgroundColor: colors.lightGray,
              borderRadius: 8,
              paddingHorizontal: spacing.xs,
              height: 38,
            }}
            placeholder="ex: Paris, Lyon..."
            value={filterCity}
            onChangeText={setFilterCity}
          />
        </View>
        {/* Pagination */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Page :</Text>
          <TextInput
            style={{
              flex: 1,
              fontSize: 15,
              color: colors.black,
              backgroundColor: colors.lightGray,
              borderRadius: 8,
              paddingHorizontal: spacing.xs,
              height: 38,
            }}
            placeholder="0"
            value={filterPage}
            onChangeText={setFilterPage}
            keyboardType="numeric"
          />
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Taille :</Text>
          <TextInput
            style={{
              flex: 1,
              fontSize: 15,
              color: colors.black,
              backgroundColor: colors.lightGray,
              borderRadius: 8,
              paddingHorizontal: spacing.xs,
              height: 38,
            }}
            placeholder="20"
            value={filterSize}
            onChangeText={setFilterSize}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10, marginHorizontal: 4 }} onPress={onClose}>
            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10, marginHorizontal: 4 }} onPress={onReset}>
            <Text style={{ color: colors.white, fontWeight: 'bold', fontSize: 16 }}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default MapFilterModal;
