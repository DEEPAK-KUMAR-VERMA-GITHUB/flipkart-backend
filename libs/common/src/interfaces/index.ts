export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  fullName?: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  userId: number;
  email: string;
  role: string;
  fullName?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
}
