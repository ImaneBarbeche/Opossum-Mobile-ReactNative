// Formulaire pour déclarer un objet trouvé
import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert, ScrollView, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import { createListing } from "../services/annonce.service";
import { mockCreateListing } from "../services/mockApi";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const CreateListingScreen: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"LOST" | "FOUND" | "">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setDate(selectedTime);
  };

  const handleSubmit = async () => {
    if (!title || title.length < 5 || title.length > 200) {
      setError("Le titre est requis (5-200 caractères).");
      return;
    }
    if (!description || description.length < 10 || description.length > 2000) {
      setError("La description est requise (10-2000 caractères).");
      return;
    }
    if (!type) {
      setError("Le type est requis.");
      return;
    }
    if (!category) {
      setError("La catégorie est requise.");
      return;
    }
    if (!city) {
      setError("La ville est requise.");
      return;
    }
    if (!address && !useCurrentLocation) {
      setError("L'adresse est requise si la localisation GPS n'est pas utilisée.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (!token || !user) throw new Error("Utilisateur non authentifié.");
      const body = {
        title,
        description,
        type,
        category,
        location: {
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          address: address,
          city: city,
        },
        contactInfo: {
          phone: user.phone || "0600000000",
          email: user.email,
        },
        photos: image ? [image] : [],
        useCurrentLocation,
      };
      // Utilise le mock si l'API n'est pas dispo
      const res = mockCreateListing(body);
      Alert.alert("Succès", "Annonce mockée créée !");
      setTitle("");
      setType("");
      setDescription("");
      setAddress("");
      setImage(null);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la création de l'annonce.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
        <Text style={{ color: "red", fontSize: 18, marginBottom: 16 }}>Vous devez être connecté pour créer une annonce.</Text>
        <FloatingLogoutButton onLogout={logout} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eae6d6' }}>
      <View style={styles.formBox}>
        <FloatingLogoutButton onLogout={logout} />
        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Ionicons name="camera" size={64} color="#4F8EF7" />
          )}
          <Text style={styles.imageText}>Cliquez pour ajouter la photo de votre objet</Text>
        </TouchableOpacity>
        <View style={styles.radioRow}>
          <Text style={styles.radioLabel}>Mon objet est :</Text>
          <TouchableOpacity style={styles.radioOption} onPress={() => setType("LOST")}>  
            <View style={styles.radioCircle}>{type === "LOST" && <View style={styles.radioDot} />}</View>
            <Text style={styles.radioText}>Perdu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setType("FOUND")}>  
            <View style={styles.radioCircle}>{type === "FOUND" && <Ionicons name="checkmark" size={18} color="#4F8EF7" />}</View>
            <Text style={styles.radioText}>Trouvé</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="De quel objet s'agit-il ? (5-200 caractères)"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Description (10-2000 caractères)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Catégorie (ex: électronique, vêtement...)"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude (optionnel)"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude (optionnel)"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ marginRight: 8 }}>Utiliser la localisation GPS</Text>
          <TouchableOpacity
            style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#4F8EF7', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setUseCurrentLocation(!useCurrentLocation)}
          >
            {useCurrentLocation && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#4F8EF7' }} />}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Quand l'avez-vous perdu/trouvé ?</Text>
        <View style={styles.dateRow}>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color="#4F8EF7" />
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time" size={20} color="#4F8EF7" />
            <Text style={styles.dateText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Adresse (requis si GPS non utilisé)"
          value={address}
          onChangeText={setAddress}
        />
        {error && <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>}
        {isLoading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginVertical: 16 }} />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Publier</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formBox: {
    backgroundColor: '#fdf6e3',
    borderRadius: 16,
    padding: 20,
    width: '95%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginVertical: 24,
    alignItems: 'center',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  imageText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioLabel: {
    fontSize: 15,
    marginRight: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4F8EF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F8EF7',
  },
  radioText: {
    fontSize: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    minWidth: 120,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateListingScreen;
