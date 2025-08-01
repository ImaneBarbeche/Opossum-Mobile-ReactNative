import { uploadFile } from "../services/files.service";
import React from "react";
import { Button } from "react-native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

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
      Toast.show({ type: "error", text1: "Format non supporté", text2: "JPEG/PNG/WebP uniquement" });
      return;
    }
    // Pour la taille, il faut récupérer la taille du fichier (option selon la lib RN)
    // Ici on ne le fait pas, à ajouter selon besoin.

    // Upload
    try {
      const response = await uploadFile(uri, token);
      if (response.success) {
        onUploaded(response.data);
      } else {
        Toast.show({ type: "error", text1: "Erreur", text2: "Upload échoué" });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Erreur", text2: "Problème lors de l’upload" });
    }
  };

  return <Button title="📷 Photo" onPress={pickAndUpload} />;
}
