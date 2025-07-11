/**
 * Calculate reading time for blog post content
 * @param content - The blog post content
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const imageTime = imageCount * 0.5; // 30 seconds per image
  
  return Math.ceil(words / wordsPerMinute + imageTime);
}

/**
 * Generate excerpt from content
 * @param content - The blog post content
 * @param maxLength - Maximum length of excerpt
 * @returns Excerpt string
 */
export function generateExcerpt(content: string, maxLength: number = 2000): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/[#*_`]/g, '') // Remove markdown formatting
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}