import React, { useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";

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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.header}>Modifier l'annonce</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Titre" />
          <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" multiline />
          <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Catégorie" />
          <TextInput style={styles.input} value={status} onChangeText={setStatus} placeholder="Statut (ACTIVE, RESOLVED, EXPIRED)" />
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={onClose}><Text style={styles.buttonText}>Annuler</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onSave({ title, description, category, status })}><Text style={styles.buttonText}>Enregistrer</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, minWidth: 100, marginHorizontal: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});

export default EditListingModal;
