// auth-types.d.ts

import { ID, DateISO, ApiResponse } from './core';

// User role enum
export enum UserRole {
  ADMIN = 'ADMIN',         // Full access (Nechama)
  MANAGER = 'MANAGER',     // Administrative assistant (Rachel)
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'  // Technical admin
}

// User model
export interface User {
  id?: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  googleId?: string;
  lastLogin?: DateISO;
  active: boolean;
  createdAt: DateISO;
  updatedAt: DateISO;
}

// Login request
export interface LoginRequest {
  email: string;
  password?: string;
  googleToken?: string;
}

// Login response
export interface LoginResponse {
  user: User;
  token: string;
  sessionId?: string;
  expiresAt: DateISO;
  cookie?: string; // Optional cookie for session management
  googleAccessToken?: string;
}

// Register user request
export interface RegisterUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
  googleId?: string;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Reset password request
export interface ResetPasswordRequest {
  email: string;
}

// Set new password request
export interface SetNewPasswordRequest {
  token: string;
  newPassword: string;
}

// Update user profile request
export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Get users request
export interface GetUsersRequest {
  role?: UserRole[];
  active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Update user role request
export interface UpdateUserRoleRequest {
  role: UserRole;
}

// Activate/deactivate user request
export interface ToggleUserActiveRequest {
  active: boolean;
}
