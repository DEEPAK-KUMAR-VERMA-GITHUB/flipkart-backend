import { ApiResponseDto } from '../dto/response.dto';

export class ResponseUtil {
  static success<T>(message: string, data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error(message: string, error?: any): ApiResponseDto {
    return new ApiResponseDto(false, message, null, error);
  }
}

export class PasswordUtil {
  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true };
  }
}
