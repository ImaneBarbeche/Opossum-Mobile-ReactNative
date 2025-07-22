import React from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Image, Platform, ScrollView } from "react-native";
import { componentStyles, colors, spacing } from '../theme';
import FloatingLogoutButton from "../components/FloatingLogoutButton";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CreateListingFormProps {
  title: string;
  setTitle: (v: string) => void;
  type: "LOST" | "FOUND" | "";
  setType: (v: "LOST" | "FOUND" | "") => void;
  description: string;
  setDescription: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  // latitude/longitude supprimés
  useCurrentLocation: boolean;
  setUseCurrentLocation: (v: boolean) => void;
  date: Date;
  setDate: (v: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (v: boolean) => void;
  showTimePicker: boolean;
  setShowTimePicker: (v: boolean) => void;
  image: string | null;
  setImage: (v: string | null) => void;
  isLoading: boolean;
  error: string | null;
  onImagePick: () => void;
  onDateChange: (event: any, selectedDate?: Date) => void;
  onTimeChange: (event: any, selectedTime?: Date) => void;
  onSubmit: () => void;
  onLogout: () => void;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({
  title, setTitle, type, setType, description, setDescription, category, setCategory, address, setAddress, city, setCity, useCurrentLocation, setUseCurrentLocation, date, setDate, showDatePicker, setShowDatePicker, showTimePicker, setShowTimePicker, image, setImage, isLoading, error, onImagePick, onDateChange, onTimeChange, onSubmit, onLogout
}) => {
  return (
    <View style={[componentStyles.card, { backgroundColor: colors.lightGray, borderRadius: 16, padding: 20, width: '95%', marginVertical: 24, alignItems: 'center' }]}> 
      <FloatingLogoutButton onLogout={onLogout} />
      <TouchableOpacity style={{ alignItems: 'center', marginBottom: 16 }} onPress={onImagePick}>
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
      {/* Champs latitude/longitude supprimés, gérés automatiquement si GPS activé */}
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
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
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
        <TouchableOpacity style={[componentStyles.buttonPrimary, { width: '100%', marginTop: 12 }]} onPress={onSubmit}>
          <Text style={componentStyles.buttonTextPrimary}>Publier</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CreateListingForm;
