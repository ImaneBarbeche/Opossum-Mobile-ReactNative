// Fonctions de validation des champs de formulaire

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): boolean {
  // Au moins 8 caractères, une majuscule, une minuscule, un chiffre
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export function isValidName(name: string): boolean {
  return typeof name === 'string' && name.length >= 1 && name.length <= 50;
}

export function isValidPhone(phone?: string): boolean {
  if (!phone) return true; // Optionnel
  // Format français simple : commence par 0, puis 9 chiffres
  return /^0[1-9](\d{8})$/.test(phone);
}

export function isValidAvatarUrl(url?: string): boolean {
  if (!url) return true; // Optionnel
  // Accepte les URLs http(s) ou les chemins locaux file://
  return /^https?:\/\/.+\..+/.test(url) || url.startsWith('file://');
}
