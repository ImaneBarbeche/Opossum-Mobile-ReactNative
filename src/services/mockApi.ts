import { Listing } from "../models/Annonce";

import { User } from "../models/User";

// Utilisateurs fictifs pour le mock
export const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "alice@example.com",
    isEmailVerified: true,
    lastLoginAt: new Date(),
    firstName: "Alice",
    lastName: "Dupont",
    isActive: true,
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    phone: "0600000000",
    avatar: "",
    password: "password123"
  },
  {
    id: "2",
    email: "bob@example.com",
    isEmailVerified: true,
    lastLoginAt: new Date(),
    firstName: "Bob",
    lastName: "Martin",
    isActive: true,
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    phone: "06000002000",
    avatar: "",
    password: "password123"
  },
  {
    id: "3",
    email: "barbecheimane@gmail.com",
    isEmailVerified: true,
    lastLoginAt: new Date(),
    firstName: "Barbeche",
    lastName: "Imane",
    isActive: true,
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
    phone: "0612345678",
    avatar: "",
    password: "password123"
  }
];

export interface MockListing {
  id: string;
  title: string;
  description: string;
  type: "LOST" | "FOUND";
  category: string;
  status?: "ACTIVE" | "RESOLVED" | "EXPIRED";
  location: {
    latitude?: number;
    longitude?: number;
    address?: string;
    city: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  photos?: string[];
  createdAt: string;
  updatedAt?: string;
}

let mockListings: MockListing[] = [
  // Annonces mockées pour barbecheimane@gmail.com
  {
    id: "101",
    title: "Portefeuille perdu au métro République",
    description: "Portefeuille en cuir marron, perdu le 15 juillet vers 18h à la station République.",
    type: "LOST",
    category: "accessories",
    status: "ACTIVE",
    location: {
      latitude: 48.867,
      longitude: 2.363,
      address: "Métro République",
      city: "Paris"
    },
    contactInfo: {
      phone: "0612345678",
      email: "barbecheimane@gmail.com"
    },
    photos: ["https://via.placeholder.com/80"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "102",
    title: "Téléphone trouvé sur un banc",
    description: "Smartphone Samsung noir trouvé sur un banc du parc des Buttes-Chaumont.",
    type: "FOUND",
    category: "electronics",
    status: "ACTIVE",
    location: {
      latitude: 48.880,
      longitude: 2.381,
      address: "Parc des Buttes-Chaumont",
      city: "Paris"
    },
    contactInfo: {
      phone: "0612345678",
      email: "barbecheimane@gmail.com"
    },
    photos: ["https://via.placeholder.com/80"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "103",
    title: "Clés perdues devant la boulangerie",
    description: "Petit trousseau de clés avec porte-clés bleu, perdu devant la boulangerie du quartier.",
    type: "LOST",
    category: "keys",
    status: "ACTIVE",
    location: {
      latitude: 48.853,
      longitude: 2.349,
      address: "Boulangerie du quartier",
      city: "Paris"
    },
    contactInfo: {
      phone: "0612345678",
      email: "barbecheimane@gmail.com"
    },
    photos: ["https://via.placeholder.com/80"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Annonces mockées pour autres utilisateurs (pour test admin)
  {
    id: "1",
    title: "Sac à dos noir perdu",
    description: "Sac à dos noir avec ordinateur portable, perdu à la gare de Lyon.",
    type: "LOST",
    category: "accessories",
    status: "ACTIVE",
    location: {
      latitude: 48.844,
      longitude: 2.374,
      address: "Gare de Lyon",
      city: "Paris"
    },
    contactInfo: {
      phone: "0600000000",
      email: "alice@example.com"
    },
    photos: ["https://via.placeholder.com/80"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Clés trouvées devant le parc",
    description: "Trousseau de clés trouvé devant le parc Monceau, avec porte-clés rouge.",
    type: "FOUND",
    category: "keys",
    status: "ACTIVE",
    location: {
      latitude: 48.879,
      longitude: 2.309,
      address: "Parc Monceau",
      city: "Paris"
    },
    contactInfo: {
      phone: "06000002000",
      email: "bob@example.com"
    },
    photos: ["https://via.placeholder.com/80"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getMockListingDetails = (id: string) => {
  const found = mockListings.find((l) => l.id === id);
  if (!found) {
    return {
      success: false,
      error: {
        code: "ANNOUNCEMENT_NOT_FOUND",
        message: "Annonce introuvable"
      },
      timestamp: new Date().toISOString()
    };
  }
  // Trouve le propriétaire via l'email de contact
  const owner = mockUsers.find(u => u.email === found.contactInfo?.email);
  return {
    success: true,
    data: {
      id: found.id,
      title: found.title,
      description: found.description,
      type: found.type,
      category: found.category,
      status: "ACTIVE",
      location: {
        latitude: found.location.latitude ?? 48.8566,
        longitude: found.location.longitude ?? 2.3522,
        address: found.location.address ?? "Adresse mockée",
        city: found.location.city
      },
      photoUrl: found.photos?.[0] ?? "",
      contactInfo: found.contactInfo ?? { phone: "0600000000", email: "mock@example.com" },
      user: owner ? {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName,
        avatar: owner.avatar || ""
      } : undefined,
      createdAt: found.createdAt,
      updatedAt: found.createdAt,
    },
    timestamp: new Date().toISOString()
  };
};

export const mockCreateListing = (data: Partial<MockListing>) => {
  const newListing: MockListing = {
    id: (mockListings.length + 1).toString(),
    title: data.title || "Titre mocké",
    description: data.description || "Description mockée",
    type: data.type || "LOST",
    category: data.category || "autre",
    location: {
      latitude: data.location?.latitude ?? 48.8566,
      longitude: data.location?.longitude ?? 2.3522,
      address: data.location?.address ?? "Adresse mockée",
      city: data.location?.city ?? "Paris",
    },
    contactInfo: data.contactInfo || { phone: "0600000000", email: "mock@example.com" },
    photos: data.photos || ["mock-photo-1"],
    createdAt: new Date().toISOString(),
  };
  mockListings.push(newListing);
  return { success: true, data: newListing, message: "Annonce mockée créée", timestamp: new Date().toISOString() };
};


/**
 * Récupère les annonces mockées.
 * @param userId ID de l'utilisateur connecté
 * @param showAll Si true, retourne toutes les annonces (pas seulement celles de l'utilisateur)
 * Exemple :
 *   getMockListings(userId) // seulement mes annonces
 *   getMockListings(userId, true) // toutes les annonces
 */
export const getMockListings = (userId: string = "1", showAll: boolean = false): Listing[] => {
  if (showAll) {
    // Retourne toutes les annonces
    return mockListings.map((mock) => {
      // Trouve l'utilisateur propriétaire via contactEmail
      const owner = mockUsers.find(u => u.email === mock.contactInfo?.email);
      return {
        id: mock.id,
        title: mock.title,
        description: mock.description,
        type: mock.type,
        category: mock.category,
        status: "ACTIVE",
        latitude: mock.location.latitude ?? 48.8566,
        longitude: mock.location.longitude ?? 2.3522,
        address: mock.location.address ?? "Adresse mockée",
        city: mock.location.city,
        photoUrl: mock.photos?.[0] ?? "",
        contactPhone: mock.contactInfo?.phone ?? "0600000000",
        contactEmail: mock.contactInfo?.email ?? "mock@example.com",
        userId: owner?.id || userId,
        owner: owner ? {
          id: owner.id,
          firstName: owner.firstName,
          lastName: owner.lastName,
          avatar: owner.avatar || "",
        } : undefined,
        createdAt: mock.createdAt,
        updatedAt: mock.createdAt,
        resolvedAt: undefined,
      };
    });
  }
  // Sinon, filtre par utilisateur connecté
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return [];
  return mockListings
    .filter(mock => mock.contactInfo?.email === user.email)
    .map((mock) => {
      const owner = mockUsers.find(u => u.email === mock.contactInfo?.email);
      return {
        id: mock.id,
        title: mock.title,
        description: mock.description,
        type: mock.type,
        category: mock.category,
        status: "ACTIVE",
        latitude: mock.location.latitude ?? 48.8566,
        longitude: mock.location.longitude ?? 2.3522,
        address: mock.location.address ?? "Adresse mockée",
        city: mock.location.city,
        photoUrl: mock.photos?.[0] ?? "",
        contactPhone: mock.contactInfo?.phone ?? "0600000000",
        contactEmail: mock.contactInfo?.email ?? "mock@example.com",
        userId: owner?.id || userId,
        owner: owner ? {
          id: owner.id,
          firstName: owner.firstName,
          lastName: owner.lastName,
          avatar: owner.avatar || "",
        } : undefined,
        createdAt: mock.createdAt,
        updatedAt: mock.createdAt,
        resolvedAt: undefined,
      };
    });
};
// Mock de la mise à jour d'une annonce
/**
 * Met à jour une annonce mockée.
 * @param id ID de l'annonce
 * @param userId ID de l'utilisateur connecté
 * @param body Champs à modifier
 * @param showAll Si true, permet de modifier n'importe quelle annonce
 * Exemple :
 *   mockUpdateListing(id, userId, fields) // seulement mes annonces
 *   mockUpdateListing(id, userId, fields, true) // toutes les annonces
 */
export const mockUpdateListing = (id: string, userId: string, body: Partial<MockListing>, showAll: boolean = false) => {
  const found = mockListings.find((l) => l.id === id);
  if (!found) {
    return {
      success: false,
      error: {
        code: "ANNOUNCEMENT_NOT_FOUND",
        message: "Annonce introuvable"
      },
      timestamp: new Date().toISOString()
    };
  }
  // Seul l'auteur peut modifier, sauf si showAll
  if (!showAll && found.contactInfo?.email !== mockUsers.find(u => u.id === userId)?.email) {
    return {
      success: false,
      error: {
        code: "ACCESS_DENIED",
        message: "Vous ne pouvez modifier que vos propres annonces"
      },
      timestamp: new Date().toISOString()
    };
  }
  // Mise à jour des champs autorisés
  if (body.title && body.title.length >= 3 && body.title.length <= 100) found.title = body.title;
  if (body.description && body.description.length >= 10 && body.description.length <= 1000) found.description = body.description;
  if (body.category && ["electronics", "clothing", "accessories", "documents", "keys", "other"].includes(body.category)) found.category = body.category;
  if (body.status && ["ACTIVE", "RESOLVED", "EXPIRED"].includes(body.status)) found.status = body.status;
  found.updatedAt = new Date().toISOString();
  return {
    success: true,
    data: {
      id: found.id,
      title: found.title,
      description: found.description,
      type: found.type,
      category: found.category,
      status: found.status || "ACTIVE",
      location: found.location,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    },
    message: "Annonce modifiée avec succès",
    timestamp: found.updatedAt,
  };
};

// Mock de la suppression d'une annonce
/**
 * Supprime une annonce mockée.
 * @param id ID de l'annonce
 * @param userId ID de l'utilisateur connecté
 * @param showAll Si true, permet de supprimer n'importe quelle annonce
 * Exemple :
 *   mockDeleteListing(id, userId) // seulement mes annonces
 *   mockDeleteListing(id, userId, true) // toutes les annonces
 */
export const mockDeleteListing = (id: string, userId: string, showAll: boolean = false) => {
  const foundIndex = mockListings.findIndex((l) => l.id === id);
  if (foundIndex === -1) {
    return {
      success: false,
      error: {
        code: "ANNOUNCEMENT_NOT_FOUND",
        message: "Annonce introuvable"
      },
      timestamp: new Date().toISOString()
    };
  }
  const found = mockListings[foundIndex];
  const user = mockUsers.find(u => u.id === userId);
  // Seul l'auteur ou un admin peut supprimer
  const isOwner = found.contactInfo?.email === user?.email;
  const isAdmin = user?.role === "ADMIN";
  if (!showAll && !isOwner && !isAdmin) {
    return {
      success: false,
      error: {
        code: "ACCESS_DENIED",
        message: "Vous ne pouvez supprimer que vos propres annonces"
      },
      timestamp: new Date().toISOString()
    };
  }
  // Suppression définitive
  mockListings.splice(foundIndex, 1);
  return {
    success: true,
    message: "Annonce supprimée avec succès",
    timestamp: new Date().toISOString()
  };
};