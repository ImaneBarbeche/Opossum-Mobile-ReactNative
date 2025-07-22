import Toast from 'react-native-toast-message';
// Formulaire pour déclarer un objet trouvé
import React, { useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import CreateListingForm from "../components/CreateListingForm";
import { createListing } from "../services/annonce.service";
import * as ImagePicker from 'expo-image-picker';
import { validateCreateListingForm } from '../utils/createListingValidation';

const CreateListingScreen: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"" | "LOST" | "FOUND">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  // latitude/longitude supprimés du state, gérés côté back si GPS activé
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
    const validation = validateCreateListingForm({
      title,
      description,
      type,
      category,
      city,
      address,
      useCurrentLocation,
    });
    if (!validation.valid) {
      setError(validation.error || "Erreur inconnue.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (!token || !user) throw new Error("Utilisateur non authentifié.");
      // Construction du body selon la spec :
      // - Si GPS activé, le back gérera la géoloc
      // - Sinon, on envoie l'adresse et la ville
      const location: any = { city };
      if (useCurrentLocation) {
        // Le back détectera la position GPS automatiquement
      } else {
        location.address = address;
      }
      const body = {
        title,
        description,
        type: type as "LOST" | "FOUND",
        category,
        location,
        contactInfo: {
          phone: user.phone || undefined,
          email: user.email || undefined,
        },
        photos: image ? [image] : [],
      };
      await createListing(token, body);
      Toast.show({ type: 'success', text1: 'Succès', text2: 'Annonce créée !' });
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
      <CreateListingForm
        title={title}
        setTitle={setTitle}
        type={type}
        setType={setType}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        address={address}
        setAddress={setAddress}
        city={city}
        setCity={setCity}
        useCurrentLocation={useCurrentLocation}
        setUseCurrentLocation={setUseCurrentLocation}
        date={date}
        setDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        image={image}
        setImage={setImage}
        isLoading={isLoading}
        error={error}
        onImagePick={handleImagePick}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onSubmit={handleSubmit}
        onLogout={logout}
      />
    </ScrollView>
  );
};



export default CreateListingScreen;
