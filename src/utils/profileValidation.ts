// Validation logic for the profile form

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: { text1: string; text2: string };
}

import { isValidPhone, isValidAvatarUrl } from "../utils/validators";

export function validateProfileForm(values: ProfileFormValues): ValidationResult {
  if (!values.firstName.trim()) {
    return { valid: false, error: { text1: "Erreur", text2: "Le prénom est obligatoire." } };
  }
  if (!values.lastName.trim()) {
    return { valid: false, error: { text1: "Erreur", text2: "Le nom est obligatoire." } };
  }
  if (!isValidPhone(values.phone)) {
    return { valid: false, error: { text1: "Erreur", text2: "Le téléphone est invalide." } };
  }
  if (!isValidAvatarUrl(values.avatar)) {
    return { valid: false, error: { text1: "Erreur", text2: "L'URL de l'avatar est invalide." } };
  }
  return { valid: true };
}
