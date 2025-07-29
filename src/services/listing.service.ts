import { API_BASE_URL } from "../config/api";
import type { Listing } from "../models/Listing";

/**
 * Récupère toutes les annonces
 */
export async function getAllListings(token: string): Promise<Listing[]> {
  const response = await fetch(`${API_BASE_URL}/listings`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.listings || data || [];
}

/**
 * Récupère les annonces de l'utilisateur connecté
 */
export async function getUserListings(token: string): Promise<Listing[]> {
  const response = await fetch(`${API_BASE_URL}/listings/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.listings || data || [];
}

/**
 * Récupère une annonce par son ID
 */
export async function getListingById(token: string, id: string): Promise<Listing> {
  const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Crée une nouvelle annonce
 */
export async function createListing(token: string, listingData: Partial<Listing>): Promise<Listing> {
  const response = await fetch(`${API_BASE_URL}/listings/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(listingData),
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Met à jour une annonce
 */
export async function updateListing(token: string, id: string, listingData: Partial<Listing>): Promise<Listing> {
  const response = await fetch(`${API_BASE_URL}/listings/${id}/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(listingData),
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Supprime une annonce
 */
export async function deleteListing(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/listings/${id}/delete`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
}

/**
 * Recherche d'annonces
 */
export async function searchListings(token: string, searchParams: any): Promise<Listing[]> {
  const queryString = new URLSearchParams(searchParams).toString();
  const response = await fetch(`${API_BASE_URL}/listings/search?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.listings || data || [];
}

/**
 * Filtre les annonces
 */
export async function filterListings(token: string, filters: any): Promise<Listing[]> {
  const response = await fetch(`${API_BASE_URL}/listings/filter`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(filters),
  });
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.listings || data || [];
}