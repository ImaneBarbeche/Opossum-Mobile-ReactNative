// Validation logic for the registration form
import { isValidEmail, isStrongPassword, isValidName } from '../utils/validators';

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  avatar?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: { text1: string; text2: string };
}

export function validateRegisterForm(values: RegisterFormValues): ValidationResult {
  if (!values.firstName || !values.lastName || !values.email || !values.password || !values.confirmPassword) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Tous les champs obligatoires doivent être remplis.' } };
  }
  if (!isValidName(values.firstName)) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Le prénom doit comporter entre 1 et 50 caractères.' } };
  }
  if (!isValidName(values.lastName)) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Le nom doit comporter entre 1 et 50 caractères.' } };
  }
  if (!isValidEmail(values.email)) {
    return { valid: false, error: { text1: 'Erreur', text2: "L'adresse email n'est pas valide." } };
  }
  if (values.phone && values.phone.length > 0 && !/^\+?[0-9\s-]{6,20}$/.test(values.phone)) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Le numéro de téléphone est invalide.' } };
  }
  if (values.avatar && values.avatar.length > 0 && !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(values.avatar)) {
    return { valid: false, error: { text1: 'Erreur', text2: 'L\'URL de l\'avatar doit être une URL d\'image valide.' } };
  }
  if (!isStrongPassword(values.password)) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule et un chiffre.' } };
  }
  if (values.password !== values.confirmPassword) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Les mots de passe ne correspondent pas.' } };
  }
  return { valid: true };
}
