import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { validateCreateListingForm } from '../utils/createListingValidation';
import { createListing } from '../services/annonce.service';

type ImageType = { id: string; url: string; thumbnail: string };

interface UseCreateListingSubmitParams {
  token: string | null;
  user: any;
  title: string;
  setTitle: (v: string) => void;
  type: "" | "LOST" | "FOUND";
  setType: (v: "" | "LOST" | "FOUND") => void;
  description: string;
  setDescription: (v: string) => void;
  category: string;
  address: string;
  setAddress: (v: string) => void;
  city: string;
  images: ImageType[];
  setImages: (v: ImageType[]) => void;
  useCurrentLocation: boolean;
  resolveLocation: () => Promise<any>;
  locationError: string | null;
  setError: (v: string | null) => void;
  setIsLoading: (v: boolean) => void;
}

export function useCreateListingSubmit({
  token,
  user,
  title,
  setTitle,
  type,
  setType,
  description,
  setDescription,
  category,
  address,
  setAddress,
  city,
  images,
  setImages,
  useCurrentLocation,
  resolveLocation,
  locationError,
  setError,
  setIsLoading,
}: UseCreateListingSubmitParams) {
  const handleSubmit = useCallback(async () => {
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
      const resolvedLocation = await resolveLocation();
      if (!resolvedLocation) {
        setError(locationError || "Erreur de localisation.");
        setIsLoading(false);
        return;
      }
      const body = {
        title,
        description,
        type: type as "LOST" | "FOUND",
        category,
        location: {
          ...resolvedLocation,
          city: city || resolvedLocation.city || "",
        },
        fileIds: images.map((img: ImageType) => img.id),
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
  }, [token, user, title, type, description, category, address, city, images, useCurrentLocation, resolveLocation, locationError, setError, setIsLoading, setTitle, setType, setDescription, setAddress, setImages]);

  return { handleSubmit };
}
