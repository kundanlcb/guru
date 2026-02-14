/**
 * Authentication Types — Guru (Teacher App)
 * Domain types that derive from generated API models where shapes overlap.
 * Components should ALWAYS import from here — never from src/api/ directly.
 */

// ============================================================================
// Re-exported API Types (for service layer use)
// ============================================================================

/** Generated request/response DTOs — use these in services that call the API directly */
export type { OtpRequestDto } from '../../api/models/otp-request-dto';
export type { OtpVerifyDto } from '../../api/models/otp-verify-dto';
export type { RefreshTokenRequestDto } from '../../api/models/refresh-token-request-dto';
export type { LoginRequest } from '../../api/models/login-request';
export type { AuthTokenResponseDto } from '../../api/models/auth-token-response-dto';
export type { UserProfileDto } from '../../api/models/user-profile-dto';

// ============================================================================
// Domain Types (used by components and stores)
// ============================================================================

export type UserRole = 'teacher' | 'admin';

export interface User {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}
