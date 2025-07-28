import * as React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface ImagePickerPreviewProps {
  images: { id: string, url: string, thumbnail: string }[];
  onRemoveImage: (idx: number) => void;
  onImagePick: () => void;
}

const ImagePickerPreview: React.FC<ImagePickerPreviewProps> = ({ images, onRemoveImage, onImagePick }) => (
  <TouchableOpacity style={{ alignItems: 'center', marginBottom: 16 }} onPress={onImagePick}>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
      {images.length === 0 && (
        <Ionicons name="camera" size={64} color={colors.primary} />
      )}
      {images.map((img, idx) => (
        <View key={idx} style={{ margin: 4, position: 'relative' }}>
          <Image source={{ uri: img.thumbnail || img.url }} style={{ width: 80, height: 80, borderRadius: 40 }} />
          <TouchableOpacity
            style={{ position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 2 }}
            onPress={() => onRemoveImage(idx)}
          >
            <Ionicons name="close" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
    <Text style={{ fontSize: 13, color: colors.darkGray, marginTop: 4, marginBottom: 8 }}>
      Cliquez pour ajouter une ou plusieurs photos (max 5)
    </Text>
  </TouchableOpacity>
);

export default ImagePickerPreview;
