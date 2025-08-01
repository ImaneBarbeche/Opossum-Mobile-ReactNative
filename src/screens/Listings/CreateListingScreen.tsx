import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useAuth } from "../../context/AuthContext";
import FloatingLogoutButton from "../../components/FloatingLogoutButton";
import CreateListingForm from "../../components/listings/CreateListingForm";
import { createListing } from "../../services/listing.service";
import { validateCreateListingForm } from "../../utils/createListingValidation";
import { useListingLocation } from "../../hooks/useListingLocation";
import { useListingImages } from "../../hooks/useListingImages";

const CreateListingScreen: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"" | "LOST" | "FOUND">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const {
    images,
    setImages,
    isLoading,
    error,
    handleImagePick,
    handleRemoveImage,
    setError,
    setIsLoading,
  } = useListingImages(token);
  const { userLocation, location, locationError, resolveLocation } =
    useListingLocation(useCurrentLocation, city, address);

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
      const resolvedLocation = await resolveLocation();
      if (!resolvedLocation) {
        setError(locationError || "Erreur de localisation.");
        setIsLoading(false);
        return;
      }
      // Toujours inclure city dans location pour le backend
      const body = {
        title,
        description,
        type: type as "LOST" | "FOUND",
        category,
        location: {
          ...resolvedLocation,
          city: city || resolvedLocation.city || "",
        },
        fileIds: images.map((img) => img.id),
      };

      await createListing(token, body);
      Toast.show({
        type: "success",
        text1: "Succès",
        text2: "Annonce créée !",
      });
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text style={{ color: "red", fontSize: 18, marginBottom: 16 }}>
          Vous devez être connecté pour créer une annonce.
        </Text>
        <FloatingLogoutButton onLogout={logout} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eae6d6",
      }}
    >
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
