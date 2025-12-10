import { supabase } from './supabase-client';

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a product image to Supabase Storage
 * @param file - The image file to upload
 * @returns Public URL of the uploaded image
 */
export async function uploadProductImage(file: File): Promise<string> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.');
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      throw new Error('Ukuran file melebihi 2MB.');
    }

    // Generate unique file name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExt = file.name.split('.').pop();
    const fileName = `product_${timestamp}_${randomString}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(error.message || 'Gagal mengupload gambar.');
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Gagal mendapatkan URL gambar.');
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error instanceof Error ? error : new Error('Terjadi kesalahan tidak terduga.');
  }
}

/**
 * Upload multiple product images
 * @param files - Array of image files to upload
 * @returns Array of public URLs
 */
export async function uploadProductImages(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadProductImage(file));
  return Promise.all(uploadPromises);
}

/**
 * Delete a product image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @returns boolean indicating success
 */
export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/product-images/');
    if (urlParts.length < 2) {
      console.error('Invalid image URL format');
      return false;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}