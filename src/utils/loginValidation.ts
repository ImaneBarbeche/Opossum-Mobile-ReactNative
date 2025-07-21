// Validation logic for the login form

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: { text1: string; text2: string };
}

export function validateLoginForm(values: LoginFormValues): ValidationResult {
  if (!values.email || !values.password) {
    return { valid: false, error: { text1: 'Erreur', text2: 'Veuillez saisir votre email et mot de passe.' } };
  }
  // Simple email regex validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    return { valid: false, error: { text1: 'Erreur', text2: "L'adresse email n'est pas valide." } };
  }
  return { valid: true };
}
