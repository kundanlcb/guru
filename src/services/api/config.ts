/**
 * API Configuration
 * Centralized config for API base URL
 */

export const API_CONFIG = {
    // Use 10.0.2.2 for Android Emulator to access localhost
    // Use localhost for iOS Simulator
    // Or specific IP for physical device
    BASE_URL: 'http://10.0.2.2:8080/api',
    TIMEOUT: 10000, // 10 seconds
} as const;

export default API_CONFIG;
