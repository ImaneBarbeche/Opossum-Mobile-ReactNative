// Service pour l'upload de fichiers (images)
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export interface UploadResponse {
  success: boolean;
  url?: string;
  data?: {
    id: string;
    originalName: string;
    url: string;
    thumbnailUrl: string;
    size: number;
    mimeType: string;
    width: number;
    height: number;
  };
  message?: string;
  error?: any;
  timestamp?: string;
}

export const uploadFile = async (fileUri: string, token: string): Promise<UploadResponse> => {
  const formData = new FormData();
  // Extraction du nom de fichier
  const fileName = fileUri.split('/').pop() || 'photo.jpg';
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg', // à adapter selon le type réel
    name: fileName,
  } as any);

  try {
    const response = await axios.post(`${API_BASE_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    // Ajoute la réponse brute pour le Toast
    if (error.response) {
      return {
        success: false,
        message: `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`,
        error,
      };
    }
    return {
      success: false,
      message: error.message || 'Erreur inconnue',
      error,
    };
  }
};
