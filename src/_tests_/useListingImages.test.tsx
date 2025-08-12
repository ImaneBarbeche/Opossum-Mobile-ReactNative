import React from 'react';
import { render, act } from '@testing-library/react-native';
import { View } from 'react-native';

jest.mock('../hooks/../services/files.service', () => ({
  uploadFile: jest.fn(),
}));
import { uploadFile } from '../services/files.service';
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));
import * as ImagePicker from 'expo-image-picker';
import { useListingImages } from '../hooks/useListingImages';

// Helper test component to use the hook
function TestComponent({ token, onHook }: { token: string; onHook: (hook: any) => void }) {
  const hook = useListingImages(token);
  React.useEffect(() => {
    if (onHook) onHook(hook);
  }, [hook, onHook]);
  return <View />;
}

describe('useListingImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add images after successful pick and upload', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'img1.jpg' }, { uri: 'img2.jpg' }],
    });
    (uploadFile as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: { id: '1', url: 'url1', thumbnailUrl: 'thumb1' } })
      .mockResolvedValueOnce({ success: true, data: { id: '2', url: 'url2', thumbnailUrl: 'thumb2' } });
    let hook: any;
    render(<TestComponent token="token" onHook={h => (hook = h)} />);
    await act(async () => {
      await hook.handleImagePick();
    });
    expect(hook.images).toEqual([
      { id: '1', url: 'url1', thumbnail: 'thumb1' },
      { id: '2', url: 'url2', thumbnail: 'thumb2' },
    ]);
    expect(hook.error).toBeNull();
    expect(hook.isLoading).toBe(false);
  });

  it('should set error if upload fails', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'img1.jpg' }],
    });
    (uploadFile as jest.Mock).mockResolvedValueOnce({ success: false, error: { message: 'Erreur upload' } });
    let hook: any;
    render(<TestComponent token="token" onHook={h => (hook = h)} />);
    await act(async () => {
      await hook.handleImagePick();
    });
    expect(hook.error).toContain('Erreur upload');
    expect(hook.images).toEqual([]);
  });

  it('should remove image by index', () => {
    let hook: any;
    render(<TestComponent token="token" onHook={h => (hook = h)} />);
    act(() => {
      hook.setImages([
        { id: '1', url: 'url1', thumbnail: 'thumb1' },
        { id: '2', url: 'url2', thumbnail: 'thumb2' },
      ]);
      hook.handleRemoveImage(0);
    });
    expect(hook.images).toEqual([
      { id: '2', url: 'url2', thumbnail: 'thumb2' },
    ]);
  });
});