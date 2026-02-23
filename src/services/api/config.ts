/**
 * API Configuration
 * Centralized config for API base URL
 */

export const API_CONFIG = {
    // Use 10.0.2.2 for Android Emulator to access localhost
    // Use localhost for iOS Simulator
    // Or specific IP for physical device
    BASE_URL: 'https://lhgsvq3v-8082.inc1.devtunnels.ms/',
    TIMEOUT: 10000, // 10 seconds
} as const;

export default API_CONFIG;
