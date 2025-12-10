/**
 * Case Conversion Utilities
 * Convert between camelCase (TypeScript) and snake_case (PostgreSQL)
 */
/**
 * Convert camelCase object keys to snake_case
 * @param obj - Object with camelCase keys
 * @returns Object with snake_case keys
 */
export function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  // Special field mappings (exact mappings that bypass conversion)
  const specialMappings: Record<string, string> = {
    // Photo/File URLs
    'picPhotoPath': 'pic_photo_url',
    'picKtpFilePath': 'pic_ktp_url',
    
    // Acronyms (RT/RW)
    'picRT': 'pic_rt',
    'picRW': 'pic_rw',
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined/null values
    if (value === undefined || value === null) {
      continue;
    }
    // Check special mappings first
    if (specialMappings[key]) {
      result[specialMappings[key]] = value;
    } else {
      // Standard camelCase to snake_case conversion
      // Handle consecutive uppercase letters (e.g., "picRT" should not become "pic_r_t")
      const snakeKey = key
        .replace(/([A-Z])([A-Z]+)([A-Z][a-z])/g, '$1_$2_$3') // XMLHttpRequest → xml_http_request
        .replace(/([a-z\d])([A-Z])/g, '$1_$2') // picName → pic_name
        .toLowerCase();
      
      result[snakeKey] = value;
    }
  }
  return result;
}
/**
 * Convert snake_case object keys to camelCase
 * @param obj - Object with snake_case keys
 * @returns Object with camelCase keys
 */
export function toCamelCase(obj: Record<string, any>): Record<string, any> {
  // Special field mappings (reverse)
  const specialMappings: Record<string, string> = {
    'pic_photo_url': 'picPhotoPath',
    'pic_ktp_url': 'picKtpFilePath',
    'pic_rt': 'picRT',
    'pic_rw': 'picRW',
  };
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Check special mappings first
    if (specialMappings[key]) {
      result[specialMappings[key]] = value;
    } else {
      // Standard snake_case to camelCase conversion
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = value;
    }
  }
  return result;
}
