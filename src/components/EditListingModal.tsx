import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { componentStyles, colors, spacing, typography } from '../theme';

interface EditListingModalProps {
  visible: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
  };
  onSave: (fields: { title: string; description: string; category: string; status: string }) => void;
}

const EditListingModal: React.FC<EditListingModalProps> = ({ visible, onClose, listing, onSave }) => {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [category, setCategory] = useState(listing.category);
  const [status, setStatus] = useState(listing.status);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[componentStyles.centerContainer, { backgroundColor: colors.overlay }]}> 
        <View style={[componentStyles.card, { backgroundColor: colors.white, borderRadius: 12, padding: spacing.lg, width: '90%' }]}> 
          <Text style={[typography.h2, { marginBottom: spacing.md }]}>Modifier l'annonce</Text>
          <TextInput style={[componentStyles.input, { marginBottom: spacing.sm }]} value={title} onChangeText={setTitle} placeholder="Titre" />
          <TextInput style={[componentStyles.input, { marginBottom: spacing.sm }]} value={description} onChangeText={setDescription} placeholder="Description" multiline />
          <TextInput style={[componentStyles.input, { marginBottom: spacing.sm }]} value={category} onChangeText={setCategory} placeholder="Catégorie" />
          <TextInput style={[componentStyles.input, { marginBottom: spacing.md }]} value={status} onChangeText={setStatus} placeholder="Statut (ACTIVE, RESOLVED, EXPIRED)" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={[componentStyles.buttonSecondary, { minWidth: 100, marginHorizontal: 4 }]} onPress={onClose}>
              <Text style={componentStyles.buttonTextSecondary}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[componentStyles.buttonPrimary, { minWidth: 100, marginHorizontal: 4 }]} onPress={() => onSave({ title, description, category, status })}>
              <Text style={componentStyles.buttonTextPrimary}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



export default EditListingModal;
