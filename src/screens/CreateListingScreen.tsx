import Toast from 'react-native-toast-message';
import React, { useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import CreateListingForm from "../components/CreateListingForm";
import { createListing, validateLocation } from "../services/annonce.service";
import { geocodeAddress } from '../utils/geocode';
import * as ImagePicker from 'expo-image-picker';
import { uploadFile } from '../services/files.service';
import { validateCreateListingForm } from '../utils/createListingValidation';
import * as Location from 'expo-location';

const CreateListingScreen: React.FC = () => {
  // Position GPS de l'utilisateur (pour création avec GPS)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (loc?.coords) {
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    })();
  }, []);
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
  const [images, setImages] = useState<{ id: string, url: string, thumbnail: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagePick = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        selectionLimit: 5 // permet jusqu'à 5 images
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uploads = await Promise.all(result.assets.map(async asset => {
          if (!token) throw new Error('Authentification requise');
          const uploadRes = await uploadFile(asset.uri, token);
          if (!uploadRes.success) {
            throw new Error(uploadRes.error?.message || 'Erreur upload');
          }
          return {
            id: uploadRes.data?.id || '',
            url: uploadRes.data?.url || '',
            thumbnail: uploadRes.data?.thumbnailUrl || '',
          };
        }));
        setImages(prev => [...prev, ...uploads]);
      }
    } catch (e: any) {
      if (e?.response?.status === 413 || e?.message?.includes('FILE_TOO_LARGE')) {
        setError('Le fichier dépasse la taille maximum autorisée (10MB).');
      } else if (e?.message?.includes('format')) {
        setError('Format de fichier non supporté.');
      } else {
        setError(e.message || 'Erreur lors de l’upload de la photo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
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
      let location: any = {};
      if (useCurrentLocation) {
        if (!userLocation) {
          setError("Impossible de récupérer la position GPS. Merci d'autoriser la localisation.");
          setIsLoading(false);
          return;
        }
        location.latitude = userLocation.latitude;
        location.longitude = userLocation.longitude;
      } else {
        location.city = city;
        location.address = address;
        // Géocodage de l'adresse pour obtenir latitude/longitude
        const coords = await geocodeAddress(address, city);
        if (!coords) {
          setError("Adresse introuvable. Merci de vérifier l’orthographe ou d’entrer une adresse plus précise.");
          setIsLoading(false);
          return;
        }
        // Validation de la localisation côté backend
        const validationRes = await validateLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          checkServiceArea: true,
        });
        if (!validationRes.success) {
          setError(
            validationRes.error?.message ||
            "Coordonnées invalides ou hors zone de service. Essayez une autre adresse ou contactez le support."
          );
          setIsLoading(false);
          return;
        }
        location.latitude = coords.latitude;
        location.longitude = coords.longitude;
      }
      const body = {
        title,
        description,
        type: type as "LOST" | "FOUND",
        category,
        location,
        fileIds: images.map(img => img.id),
      };

      await createListing(token, body);
      Toast.show({ type: 'success', text1: 'Succès', text2: 'Annonce créée !' });
      setTitle("");
      setType("");
      setDescription("");
      setAddress("");
      setImages([]);
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
        images={images}
        setImages={setImages}
        onRemoveImage={handleRemoveImage}
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
