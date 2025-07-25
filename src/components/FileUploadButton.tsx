import React from "react";
import { Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadFile } from "../services/filesService";

type Props = {
  onUploaded: (fileData: any) => void; // callback appelé après succès upload
  token: string;
};

export default function FileUploadButton({ onUploaded, token }: Props) {
  const pickAndUpload = async () => {
    // Ouvre le sélecteur d’image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: false,
    });

    if (result.canceled) return;

    // Ici, on est sûr que result est de type ImagePickerSuccessResult
    const { assets } = result as ImagePicker.ImagePickerSuccessResult;
    if (!assets || assets.length === 0) return;

    const asset = assets[0];
    const { uri, type } = asset;
    const filename = uri.split("/").pop();
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(type)) {
      Alert.alert("Erreur", "Format non supporté (JPEG/PNG/WebP uniquement)");
      return;
    }
    // Pour la taille, il faut récupérer la taille du fichier (option selon la lib RN)
    // Ici on ne le fait pas, à ajouter selon besoin.

    // Upload
    try {
      const response = await uploadFile({ uri, name: filename, type }, token);
      const data = response.data as { success: boolean; data: any };
      if (data.success) {
        onUploaded(data.data);
      } else {
        Alert.alert("Erreur", "Upload échoué");
      }
    } catch (e) {
      Alert.alert("Erreur", "Problème lors de l’upload");
    }
  };

  return <Button title="📷 Photo" onPress={pickAndUpload} />;
}
