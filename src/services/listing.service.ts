// Service pour la gestion des annonces
import { ANNOUNCE_ENDPOINTS } from "../config/api";
import { CreateListingBody, FilterParams, ListingsResponse, UpdateListingBody } from "../models/Listing";
import axios from "axios";
import { API_BASE_URL } from "../config/api";


export const getFilteredListings = async (params?: FilterParams, token?: string) => {
  try {
    const response = await axios.get(ANNOUNCE_ENDPOINTS.filter, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params,
    });
    return (response.data as ListingsResponse).data.content;
  } catch (error) {
    throw error;
  }
};

export const getUserListings = async (
  token: string,
  params?: { userId?: string; type?: string; status?: string; page?: number; size?: number }
): Promise<any[]> => {
  try {
    const response = await axios.get<ListingsResponse>(`${API_BASE_URL}/listings/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    // Mapping pour compatibilité front : extrait les champs attendus à la racine
    const listings = (response.data.data?.content || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? '',
      type: item.type,
      category: item.category,
      status: item.status,
      latitude: item.location?.latitude ?? null,
      longitude: item.location?.longitude ?? null,
      address: item.location?.address ?? '',
      city: item.location?.city ?? '',
      photoUrl: item.photoUrl ?? item.thumbnailUrl ?? '',
      thumbnailUrl: item.thumbnailUrl ?? '',
      contactPhone: item.contactInfo?.phone ?? '',
      contactEmail: item.contactInfo?.email ?? '',
      userId: item.userId ?? '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      resolvedAt: item.resolvedAt,
      owner: item.owner,
    }));
    return listings;
  } catch (error) {
    throw error;
  }
};

export const createListing = async (token: string, body: CreateListingBody) => {
  try {
    const response = await axios.post(ANNOUNCE_ENDPOINTS.create, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListingDetails = async (id: string, token?: string) => {
  try {
    const url = ANNOUNCE_ENDPOINTS.listingDetailsById(id);
    if (!token) {
      console.error("[getListingDetails] ATTENTION: le token n'est pas transmis ou est undefined ! Vérifiez la récupération et la transmission du token côté frontend.");
    }
    const response = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const item = (response.data as { data: any }).data;
    // Mapping pour compatibilité front : extrait les champs attendus à la racine
    return {
      id: item.id,
      title: item.title,
      description: item.description ?? '',
      type: item.type,
      category: item.category,
      status: item.status,
      latitude: item.location?.latitude ?? null,
      longitude: item.location?.longitude ?? null,
      address: item.location?.address ?? '',
      city: item.location?.city ?? '',
      location: item.location
        ? {
            latitude: item.location.latitude ?? null,
            longitude: item.location.longitude ?? null,
            address: item.location.address ?? '',
            city: item.location.city ?? ''
          }
        : undefined,
      photoUrl: item.photoUrl ?? item.thumbnailUrl ?? '',
      thumbnailUrl: item.thumbnailUrl ?? '',
      photos: Array.isArray(item.imageUrls)
        ? item.imageUrls.filter((url: string) => !!url)
        : Array.isArray(item.photos)
          ? item.photos.map((p: any) => typeof p === 'string' ? p : (p?.url || p?.path || ''))
              .filter((url: string) => !!url)
          : (item.photoUrl ? [item.photoUrl] : []),
      contactPhone: item.contactInfo?.phone ?? '',
      contactEmail: item.contactInfo?.email ?? '',
      userId: item.user?.id ?? item.userId ?? '',
      owner: item.user ?? item.owner ?? null,
      user: item.user
        ? {
            id: item.user.id,
            firstName: item.user.firstName,
            lastName: item.user.lastName,
            avatar:
              item.user.avatar && item.user.avatar.trim() !== ''
                ? item.user.avatar
                : 'https://ui-avatars.com/api/?name=' + encodeURIComponent((item.user.firstName || '') + ' ' + (item.user.lastName || '')),
          }
        : undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      resolvedAt: item.resolvedAt,
    };
  } catch (error) {
    throw error;
  }
};

export const updateListing = async (id: string, token: string, body: UpdateListingBody) => {
  try {
    const response = await axios.put(ANNOUNCE_ENDPOINTS.update(id), body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const item = (response.data as { data: any }).data;
    return {
      id: item.id,
      title: item.title,
      description: item.description ?? '',
      type: item.type,
      category: item.category,
      status: item.status,
      latitude: item.location?.latitude ?? null,
      longitude: item.location?.longitude ?? null,
      address: item.location?.address ?? '',
      city: item.location?.city ?? '',
      photoUrl: item.photoUrl ?? item.thumbnailUrl ?? '',
      thumbnailUrl: item.thumbnailUrl ?? '',
      contactPhone: item.contactInfo?.phone ?? '',
      contactEmail: item.contactInfo?.email ?? '',
      userId: item.user?.id ?? item.userId ?? '',
      owner: item.user ?? item.owner ?? null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      resolvedAt: item.resolvedAt,
    };
  } catch (error: any) {
    console.error("Erreur updateListing:", error?.response?.data || error.message);
    throw error;
  }
};

export const deleteListing = async (id: string, token: string) => {
  try {
    const response = await axios.delete(ANNOUNCE_ENDPOINTS.delete(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur deleteListing:", error?.response?.data || error.message);
    throw error;
  }
};

// Récupère les annonces formatées pour la carte (et la liste proche)
export const fetchMapListings = async (
  params: {
    latitude?: number;
    longitude?: number;
    radius?: number;
    type?: string;
    category?: string;
    page?: number;
    size?: number;
    token?: string;
  }
) => {
  const { token, ...query } = params;
  const response = await axios.get(
    `${API_BASE_URL}/announcements/map`,
    {
      params: query,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
};

export const fetchNearbyListings = async (
  params: {
    latitude: number;
    longitude: number;
    radius?: number;
    type?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    page?: number;
    token?: string;
  }
) => {
  const { token, ...query } = params;
  const response = await axios.get(
    `${API_BASE_URL}/announcements/nearby`,
    {
      params: query,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
  return response.data;
};

export const fetchDistance = async (params: {
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
  unit?: "km" | "miles";
}) => {
  const response = await axios.get(
    `${API_BASE_URL}/location/distance`,
    { params }
  );
  return response.data;
};

// Valide des coordonnées GPS et la zone de service côté backend
export const validateLocation = async (params: {
  latitude: number;
  longitude: number;
  checkServiceArea?: boolean;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/location/validate`,
    {
      latitude: params.latitude,
      longitude: params.longitude,
      checkServiceArea: params.checkServiceArea !== false // true par défaut
    }
  );
  return response.data;
};