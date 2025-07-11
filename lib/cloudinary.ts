import { v2 as cloudinary } from 'cloudinary';

/**
 * Cloudinary configuration
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param file - File buffer or base64 string
 * @param folder - Cloudinary folder to store the image
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  folder: string = 'blog-posts'
): Promise<{
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}> {
  try {
    let uploadFile: string;
    if (Buffer.isBuffer(file)) {
      // Default to jpeg if mime type is unknown; adjust as needed
      const base64 = file.toString('base64');
      uploadFile = `data:image/jpeg;base64,${base64}`;
    } else {
      uploadFile = file;
    }

    const result = await cloudinary.uploader.upload(uploadFile, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'limit', quality: 'auto' },
      ],
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID of the image
 * @returns Promise with deletion result
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

/**
 * Generate optimized image URL
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
}

export default cloudinary;