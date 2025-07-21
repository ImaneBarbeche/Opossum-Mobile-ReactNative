
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
  thumbnailUrl?: string;
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
  page?: number;
  size?: number;
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
  type: "LOST" | "FOUND";
  category: string;
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
  useCurrentLocation?: boolean;
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
  city?: string;
  page?: number;
  size?: number;
}

export interface MapFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterType: string | null;
  setFilterType: (v: string | null) => void;
  filterCategory: string | null;
  setFilterCategory: (v: string | null) => void;
  filterCity: string;
  setFilterCity: (v: string) => void;
  filterPage: string;
  setFilterPage: (v: string) => void;
  filterSize: string;
  setFilterSize: (v: string) => void;
  onReset: () => void;
}
