
export interface Listing {
  id: string;
  title: string;
  description: string;
  type: "LOST" | "FOUND";
  category: string;
  status: "ACTIVE" | "RESOLVED" | "ARCHIVED" | "DELETED";
  latitude: number;
  longitude: number;
  address?: string;
  city: string;
  photoUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface FilterParams {
  type?: string;
  category?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ListingsResponse {
  success: boolean;
  data: {
    content: Listing[];
    page: {
      number: number;
      size: number;
      totalElements: number;
      totalPages: number;
    };
  };
  timestamp: string;
}

export interface CreateListingBody {
  title: string;
  description: string;
  isLost: boolean;
  userId: string;
}

export interface UpdateListingBody {
  title?: string;
  description?: string;
  category?: string;
  status?: "ACTIVE" | "RESOLVED" | "EXPIRED";
}

export interface SearchListingsParams {
  q?: string;
  type?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  page?: number;
  size?: number;
}
