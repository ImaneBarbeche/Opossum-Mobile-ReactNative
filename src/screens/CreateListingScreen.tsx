// Formulaire pour déclarer un objet trouvé
import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Image, Platform, StyleSheet } from "react-native";
import { componentStyles, colors, spacing, typography } from '../theme';
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
      <View style={[componentStyles.card, { backgroundColor: colors.lightGray, borderRadius: 16, padding: 20, width: '95%', marginVertical: 24, alignItems: 'center' }]}> 
        <FloatingLogoutButton onLogout={logout} />
        <TouchableOpacity style={{ alignItems: 'center', marginBottom: 16 }} onPress={handleImagePick}>
          {image ? (
            <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 8 }} />
          ) : (
            <Ionicons name="camera" size={64} color={colors.primary} />
          )}
          <Text style={{ fontSize: 13, color: colors.darkGray, marginTop: 4, marginBottom: 8 }}>Cliquez pour ajouter la photo de votre objet</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 15, marginRight: 8 }}>Mon objet est :</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }} onPress={() => setType("LOST")}>  
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>{type === "LOST" && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}</View>
            <Text style={{ fontSize: 15 }}>Perdu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }} onPress={() => setType("FOUND")}>  
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>{type === "FOUND" && <Ionicons name="checkmark" size={18} color={colors.primary} />}</View>
            <Text style={{ fontSize: 15 }}>Trouvé</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="De quel objet s'agit-il ? (5-200 caractères)"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="Description (10-2000 caractères)"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="Catégorie (ex: électronique, vêtement...)"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="Ville"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="Latitude (optionnel)"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="Longitude (optionnel)"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ marginRight: 8 }}>Utiliser la localisation GPS</Text>
          <TouchableOpacity
            style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => setUseCurrentLocation(!useCurrentLocation)}
          >
            {useCurrentLocation && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary }} />}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 15, marginBottom: 4, alignSelf: 'flex-start' }}>Quand l'avez-vous perdu/trouvé ?</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, width: '100%' }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.mediumGray, marginRight: 8, minWidth: 120 }} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={{ marginLeft: 6, fontSize: 15 }}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: colors.mediumGray, marginRight: 8, minWidth: 120 }} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={{ marginLeft: 6, fontSize: 15 }}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
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
          style={[componentStyles.input, { marginBottom: spacing.sm }]}
          placeholder="Adresse (requis si GPS non utilisé)"
          value={address}
          onChangeText={setAddress}
        />
        {error && <Text style={{ color: colors.error, marginBottom: 12 }}>{error}</Text>}
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primaryDark} style={{ marginVertical: 16 }} />
        ) : (
          <TouchableOpacity style={[componentStyles.buttonPrimary, { width: '100%', marginTop: 12 }]} onPress={handleSubmit}>
            <Text style={componentStyles.buttonTextPrimary}>Publier</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};



export default CreateListingScreen;
