import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from '../theme';

interface MapFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterType: string | null;
  setFilterType: (v: string | null) => void;
  filterCategory: string | null;
  setFilterCategory: (v: string | null) => void;
  filterCity: string;
  setFilterCity: (v: string) => void;
  filterRadius: string;
  setFilterRadius: (v: string) => void;
  filterDateFrom: string;
  setFilterDateFrom: (v: string) => void;
  filterDateTo: string;
  setFilterDateTo: (v: string) => void;
  filterSortBy: string;
  setFilterSortBy: (v: string) => void;
  filterPage: string;
  setFilterPage: (v: string) => void;
  filterSize: string;
  setFilterSize: (v: string) => void;
  onReset: () => void;
}

const MapFilterModal: React.FC<MapFilterModalProps> = ({
  visible, onClose,
  filterType, setFilterType,
  filterCategory, setFilterCategory,
  filterCity, setFilterCity,
  filterRadius, setFilterRadius,
  filterDateFrom, setFilterDateFrom,
  filterDateTo, setFilterDateTo,
  filterSortBy, setFilterSortBy,
  filterPage, setFilterPage,
  filterSize, setFilterSize,
  onReset
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
        {/* Type perdu/trouvé */}
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
            placeholder="ex: keys, electronics, accessories..."
            value={filterCategory || ""}
            onChangeText={setFilterCategory}
          />
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
        {/* Rayon (km) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Rayon (km) :</Text>
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
            placeholder="ex: 10"
            value={filterRadius}
            onChangeText={setFilterRadius}
            keyboardType="numeric"
          />
        </View>
        {/* Date min */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Date min :</Text>
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
            placeholder="YYYY-MM-DD"
            value={filterDateFrom}
            onChangeText={setFilterDateFrom}
          />
        </View>
        {/* Date max */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Date max :</Text>
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
            placeholder="YYYY-MM-DD"
            value={filterDateTo}
            onChangeText={setFilterDateTo}
          />
        </View>
        {/* Tri */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={{ fontSize: 15, color: colors.darkGray, marginRight: 8, minWidth: 90 }}>Tri :</Text>
          <TouchableOpacity
            style={[
              { flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
              filterSortBy === "relevance" && { backgroundColor: colors.primary }
            ]}
            onPress={() => setFilterSortBy("relevance")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Pertinence</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
              filterSortBy === "date" && { backgroundColor: colors.primary }
            ]}
            onPress={() => setFilterSortBy("date")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { flex: 1, backgroundColor: colors.mediumGray, borderRadius: 8, padding: 10, marginHorizontal: 4, alignItems: 'center' },
              filterSortBy === "distance" && { backgroundColor: colors.primary }
            ]}
            onPress={() => setFilterSortBy("distance")}
          >
            <Text style={{ color: colors.black, fontWeight: 'bold' }}>Distance</Text>
          </TouchableOpacity>
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
