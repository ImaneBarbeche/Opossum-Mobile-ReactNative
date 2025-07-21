// Validation logic for the create listing form

export interface CreateListingFormValues {
  title: string;
  description: string;
  type: "LOST" | "FOUND" | "";
  category: string;
  city: string;
  address: string;
  useCurrentLocation: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCreateListingForm(values: CreateListingFormValues): ValidationResult {
  if (!values.title || values.title.length < 5 || values.title.length > 200) {
    return { valid: false, error: "Le titre est requis (5-200 caractères)." };
  }
  if (!values.description || values.description.length < 10 || values.description.length > 2000) {
    return { valid: false, error: "La description est requise (10-2000 caractères)." };
  }
  if (!values.type) {
    return { valid: false, error: "Le type est requis." };
  }
  if (!values.category) {
    return { valid: false, error: "La catégorie est requise." };
  }
  if (!values.city) {
    return { valid: false, error: "La ville est requise." };
  }
  if (!values.address && !values.useCurrentLocation) {
    return { valid: false, error: "L'adresse est requise si la localisation GPS n'est pas utilisée." };
  }
  return { valid: true };
}
