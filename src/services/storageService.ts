import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';

export const storageService = {
  // Upload image to workshop-images bucket
  async uploadWorkshopImage(
    workshopId: string,
    imageUri: string
  ): Promise<string> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('Not authenticated');

    // Get file extension
    const ext = imageUri.split('.').pop();
    const fileName = `${userId}/${workshopId}-${Date.now()}.${ext}`;

    // Convert URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('workshop-images')
      .upload(fileName, blob, {
        contentType: `image/${ext}`,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('workshop-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  },

  // Upload image to event-images bucket
  async uploadEventImage(eventId: string, imageUri: string): Promise<string> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const ext = imageUri.split('.').pop();
    const fileName = `${userId}/${eventId}-${Date.now()}.${ext}`;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(fileName, blob, {
        contentType: `image/${ext}`,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('event-images')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  },

  // Upload user avatar
  async uploadAvatar(imageUri: string): Promise<string> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error('Not authenticated');

    const ext = imageUri.split('.').pop();
    const fileName = `${userId}/avatar.${ext}`;

    const response = await fetch(imageUri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: `image/${ext}`,
        upsert: true, // Replace existing avatar
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  },

  // Pick image from device
  async pickImage(): Promise<string | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access gallery is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  },

  // Take photo with camera
  async takePhoto(): Promise<string | null> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access camera is required');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  },

  // Delete image from storage
  async deleteImage(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  },
};
