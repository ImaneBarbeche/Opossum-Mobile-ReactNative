// Fonction mock pour récupérer les détails d'une annonce
import { getMockListingDetails } from "./mockApi";

export const getListingDetailsMock = async (id: string) => {
  // Simule un appel asynchrone
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMockListingDetails(id));
    }, 300);
  });
};

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
    return Array.isArray(response.data) ? response.data : [];
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
    return (response.data as { data: Listing }).data;
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
    const response = await axios.get<ListingsResponse>(ANNOUNCE_ENDPOINTS.search, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params,
    });
    return response.data.data.content;
  } catch (error) {
    throw error;
  }
};