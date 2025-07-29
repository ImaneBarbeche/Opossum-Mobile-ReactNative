import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { geocodeAddress } from '../utils/geocode';
import { validateLocation } from '../services/listing.service';

export function useListingLocation(useCurrentLocation: boolean, city: string, address: string) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [location, setLocation] = useState<any>({});

  useEffect(() => {
    if (useCurrentLocation) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (loc?.coords) {
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      })();
    }
  }, [useCurrentLocation]);

  const resolveLocation = async () => {
    setLocationError(null);
    if (useCurrentLocation) {
      if (!userLocation) {
        setLocationError("Impossible de récupérer la position GPS. Merci d'autoriser la localisation.");
        return null;
      }
      setLocation({ latitude: userLocation.latitude, longitude: userLocation.longitude });
      return { latitude: userLocation.latitude, longitude: userLocation.longitude };
    } else {
      if (!city || !address) {
        setLocationError("Ville et adresse requises.");
        return null;
      }
      const coords = await geocodeAddress(address, city);
      if (!coords) {
        setLocationError("Adresse introuvable. Merci de vérifier l’orthographe ou d’entrer une adresse plus précise.");
        return null;
      }
      const validationRes = await validateLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        checkServiceArea: true,
      });
      if (!validationRes.success) {
        setLocationError(
          validationRes.error?.message ||
          "Coordonnées invalides ou hors zone de service. Essayez une autre adresse ou contactez le support."
        );
        return null;
      }
      setLocation({ latitude: coords.latitude, longitude: coords.longitude, city, address });
      return { latitude: coords.latitude, longitude: coords.longitude, city, address };
    }
  };

  return { userLocation, location, locationError, resolveLocation };
}
