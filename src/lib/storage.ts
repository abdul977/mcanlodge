import { supabase } from './supabase';

export const storageService = {
  // Upload passport photo to Supabase Storage
  async uploadPassportPhoto(file: File, referenceNumber: string): Promise<{ url: string | null; error: any }> {
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${referenceNumber}-passport.${fileExt}`;
      const filePath = `passport-photos/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('passport-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        return { url: null, error };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('passport-photos')
        .getPublicUrl(filePath);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Storage service error:', error);
      return { url: null, error };
    }
  },

  // Convert file to base64 (fallback for when storage is not configured)
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  },

  // Check if storage bucket exists and is accessible
  async checkStorageAccess(): Promise<boolean> {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Storage check timeout')), 5000)
      );

      const storagePromise = supabase.storage
        .from('passport-photos')
        .list('', { limit: 1 });

      const { data, error } = await Promise.race([storagePromise, timeoutPromise]) as any;

      if (error) {
        console.warn('Storage access failed:', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Storage access check failed, using base64 fallback:', error);
      return false;
    }
  }
};
