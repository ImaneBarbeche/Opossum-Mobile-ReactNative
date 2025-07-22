
// Service pour la gestion des annonces

import { ANNOUNCE_ENDPOINTS } from "../config/api";
import { CreateListingBody, FilterParams, Listing, ListingsResponse, SearchListingsParams, UpdateListingBody } from "../models/Annonce";
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

export const getMyListings = async (
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
    // Log la structure brute pour debug
    console.log('[getMyListings] response.data =', JSON.stringify(response.data, null, 2));
    console.log('[getMyListings] response.data.data =', JSON.stringify(response.data.data, null, 2));
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
    const response = await axios.get(ANNOUNCE_ENDPOINTS.listingDetailsById(id), {
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
    return response.data;
  } catch (error) {
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
  } catch (error) {
    throw error;
  }
};

export const searchListings = async (params?: SearchListingsParams, token?: string) => {
  try {
    // Nettoie les paramètres pour ne pas envoyer de valeurs undefined
    const cleanParams = Object.fromEntries(Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== null && v !== ''));
    const response = await axios.get<ListingsResponse>(ANNOUNCE_ENDPOINTS.search, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: cleanParams,
    });
    // Retourne le tableau d'annonces (data.content)
    return response.data.data.content;
  } catch (error) {
    throw error;
  }
};