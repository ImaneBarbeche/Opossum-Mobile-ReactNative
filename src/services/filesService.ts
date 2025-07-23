import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/files';

// Upload d’un fichier (image) – nécessite adaptation côté front pour le form-data
export async function uploadFile(file: { uri: string; name: string; type: string }, token: string) {
  // FormData utilisé pour l’API d’upload standard
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);

  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}

// Téléchargement d’un fichier/image à partir de son id
export async function downloadFile(fileId: string, thumbnail = false) {
  // Pas d’auth requise selon la doc
  const url = `${BASE_URL}/${fileId}${thumbnail ? '?thumbnail=true' : ''}`;
  return axios.get(url, {
    responseType: 'blob', // ou 'arraybuffer' selon la lib/plateforme
    // Pas d'Authorization ici
  });
}

// Helper pour obtenir l’URL publique d’une image (affichage direct dans l’app)
export function getFileUrl(fileId: string, thumbnail = false) {
  return `${BASE_URL}/${fileId}${thumbnail ? '?thumbnail=true' : ''}`;
}