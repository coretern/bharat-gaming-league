/**
 * Cloudinary image optimization helper.
 * Transforms Cloudinary URLs to use auto-format and auto-quality for faster loading.
 */

export function optimizeCloudinaryUrl(url: string, options?: { width?: number; height?: number; blur?: boolean }): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  const transforms: string[] = ['f_auto', 'q_auto'];

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.blur) transforms.push('e_blur:1000', 'q_10');

  const transformStr = transforms.join(',');

  // Insert transforms after /upload/
  return url.replace('/upload/', `/upload/${transformStr}/`);
}

/**
 * Generate a thumbnail URL from a Cloudinary image.
 */
export function cloudinaryThumb(url: string, size = 150): string {
  return optimizeCloudinaryUrl(url, { width: size, height: size });
}
