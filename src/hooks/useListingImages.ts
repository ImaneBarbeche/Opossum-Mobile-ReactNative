import { uploadFile } from '../services/files.service';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export function useListingImages(token: string | null) {
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
        selectionLimit: 5
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

  return {
    images,
    setImages,
    isLoading,
    error,
    handleImagePick,
    handleRemoveImage,
    setError,
    setIsLoading,
  };
}
