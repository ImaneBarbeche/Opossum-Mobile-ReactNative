import * as React from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { componentStyles, colors, spacing } from '../../theme';
import ImagePickerPreview from './ImagePickerPreview';
import TypeSelector from './TypeSelector';
import DateTimeSelector from './DateTimeSelector';
import { categories, getCategoryLabel } from '../../utils/categories';
import { CreateListingFormProps } from "../../models/CreateListingForm.types";

const CreateListingForm: React.FC<CreateListingFormProps> = ({
  title, setTitle, type, setType, description, setDescription, category, setCategory, address, setAddress, city, setCity, useCurrentLocation, setUseCurrentLocation, date, setDate, showDatePicker, setShowDatePicker, showTimePicker, setShowTimePicker, images, setImages, onRemoveImage, isLoading, error, onImagePick, onDateChange, onTimeChange, onSubmit, onLogout
}) => {
  const [categoryError, setCategoryError] = React.useState<string | null>(null);

  const handleCategoryChange = (itemValue: string) => {
    setCategory(itemValue);
    if (itemValue && itemValue.trim() !== "") setCategoryError(null);
  };

  return (
    <View style={[componentStyles.card, { backgroundColor: colors.lightGray, borderRadius: 16, padding: 20, width: '95%', marginVertical: 24, alignItems: 'center' }]}> 
      <ImagePickerPreview images={images} onRemoveImage={onRemoveImage} onImagePick={onImagePick} />
      <TypeSelector type={type} setType={setType} />
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
      <View style={{ marginBottom: spacing.sm, width: '100%' }}>
        <Picker
          selectedValue={category}
          onValueChange={handleCategoryChange}
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
      <TextInput
        style={[componentStyles.input, { marginBottom: spacing.sm }]}
        placeholder="Ville"
        value={city}
        onChangeText={setCity}
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
      <DateTimeSelector
        date={date}
        setDate={setDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        showTimePicker={showTimePicker}
        setShowTimePicker={setShowTimePicker}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
      />
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
