/**
 * Safe localStorage utilities for use in both server and client environments.
 * These functions check if window is defined before accessing localStorage.
 */

/**
 * Get an item from localStorage
 * @param key - The key to get from localStorage
 * @param defaultValue - The default value to return if key doesn't exist
 * @returns The value from localStorage or defaultValue
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
}

/**
 * Set an item in localStorage
 * @param key - The key to set in localStorage
 * @param value - The value to set
 * @returns true if set successfully, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
}

/**
 * Remove an item from localStorage
 * @param key - The key to remove from localStorage
 * @returns true if removed successfully, false otherwise
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Clear all items from localStorage
 * @returns true if cleared successfully, false otherwise
 */
export function clearStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}
