import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
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
  const categories = [
    { label: 'Électronique', value: 'electronics' },
    { label: 'Vêtements', value: 'clothing' },
    { label: 'Accessoires', value: 'accessories' },
    { label: 'Documents', value: 'documents' },
    { label: 'Clés', value: 'keys' },
    { label: 'Autre', value: 'other' },
  ];
  const [status, setStatus] = useState(listing.status);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const handleSave = () => {
    if (!category || category.trim() === "") {
      setCategoryError("La catégorie est obligatoire");
      return;
    }
    setCategoryError(null);
    onSave({ title, description, category, status });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[componentStyles.centerContainer, { backgroundColor: colors.overlay }]}> 
        <View style={[componentStyles.card, { backgroundColor: colors.white, borderRadius: 12, padding: spacing.lg, width: '90%' }]}> 
          <Text style={[typography.h2, { marginBottom: spacing.md }]}>Modifier l'annonce</Text>
          <TextInput style={[componentStyles.input, { marginBottom: spacing.sm }]} value={title} onChangeText={setTitle} placeholder="Titre" />
          <TextInput style={[componentStyles.input, { marginBottom: spacing.sm }]} value={description} onChangeText={setDescription} placeholder="Description" multiline />
          <View style={{ marginBottom: spacing.sm }}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => {
                setCategory(itemValue);
                if (itemValue && itemValue.trim() !== "") setCategoryError(null);
              }}
              style={{ backgroundColor: '#f5f5f5', borderRadius: 8 }}
            >
              <Picker.Item label="Choisir une catégorie..." value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
            {categoryError && (
              <Text style={{ color: colors.error, marginTop: 2 }}>{categoryError}</Text>
            )}
          </View>
          <TextInput style={[componentStyles.input, { marginBottom: spacing.md }]} value={status} onChangeText={setStatus} placeholder="Statut (ACTIVE, RESOLVED, EXPIRED)" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={[componentStyles.buttonSecondary, { minWidth: 100, marginHorizontal: 4 }]} onPress={onClose}>
              <Text style={componentStyles.buttonTextSecondary}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[componentStyles.buttonPrimary, { minWidth: 100, marginHorizontal: 4, opacity: !category || category.trim() === "" ? 0.5 : 1 }]} onPress={handleSave} disabled={!category || category.trim() === ""}>
              <Text style={componentStyles.buttonTextPrimary}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



export default EditListingModal;
