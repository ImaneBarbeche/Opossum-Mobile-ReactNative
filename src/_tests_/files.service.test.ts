import * as filesService from '../services/files.service';
import axios from 'axios';

jest.mock('axios');

describe('files.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file successfully', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          id: 'file123',
          originalName: 'photo.jpg',
          url: 'https://example.com/photo.jpg',
          thumbnailUrl: 'https://example.com/photo-thumb.jpg',
          size: 12345,
          mimeType: 'image/jpeg',
          width: 800,
          height: 600,
        },
        message: 'Upload successful',
        timestamp: '2025-07-31T12:00:00Z',
      },
    });
    const res = await filesService.uploadFile('path/to/photo.jpg', 'token');
    expect(res.success).toBe(true);
    expect(res.data?.id).toBe('file123');
    expect(res.data?.url).toContain('photo.jpg');
  });

  it('should handle upload error with response', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: {
        status: 400,
        data: { error: 'Invalid file' },
      },
      message: 'Bad Request',
    });
    const res = await filesService.uploadFile('path/to/photo.jpg', 'token');
    expect(res.success).toBe(false);
    expect(res.message).toContain('HTTP 400');
    expect(res.error.response.status).toBe(400);
  });

  it('should handle upload error without response', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      message: 'Network Error',
    });
    const res = await filesService.uploadFile('path/to/photo.jpg', 'token');
    expect(res.success).toBe(false);
    expect(res.message).toBe('Network Error');
  });
});